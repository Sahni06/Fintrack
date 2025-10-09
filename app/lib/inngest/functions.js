import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { sendEmail } from "@/actions/send-eamil";
import EmailTemplate from "@/emails/template";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, //every 6 hrs
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });
    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue; // Skip if no default account

      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1); // Start of current month
/////////////////
        const currentDate = new Date();
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        startDate.setDate(1); //start of the current month
////////////////////////
        // Calculate total expenses for the default account only
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id, // Only consider default account
            type: "EXPENSE",
            date: {
              gte: startDate,
            },
          },
          _sum: {
            amount: true,
          },
        });
        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = Number(budget.amount);
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        console.log('Budget calculations', {
          totalExpenses,
          budgetAmount,
          percentageUsed,
          shouldSendAlert: percentageUsed >= 80,
          lastAlertSent: budget.lastAlertSent,
          isNewMonth: budget.lastAlertSent ?
            isNewMonth(new Date(budget.lastAlertSent), new Date()) :
            true
        });



        //Check if we should send an alert
        if (percentageUsed >= 80 && (!budget.lastAlertSent || shouldSendNewAlert(new Date(budget.lastAlertSent), new Date()))) {
          try {
            // Send Email
            await sendEmail({
              to: budget.user.email,
              subject: `Budget Alert for ${defaultAccount.name}`,
              react: EmailTemplate({
                userName: budget.user.name,
                type: "budget-alert",
                data: {
                  percentageUsed,
                  budgetAmount: parseInt(budgetAmount).toFixed(1),
                  totalExpenses: parseInt(totalExpenses).toFixed(1),
                  accountName: defaultAccount.name,
                }
              })
            });
            // Only update lastAlertSent if email was sent successfully
            await db.budget.update({
              where: { id: budget.id },
              data: { lastAlertSent: new Date() },
            });

            step.log('Alert sent successfully');
          } catch (error) {
            step.log('Failed to send alert', { error: error.message });
          }
        }
        // //Update lastAlertSent
        // await db.budget.update({
        //   where: { id: budget.id },
        //   data: { lastAlertSent: new Date() },
        // })
        //
      })
    }
  },
);

// function isNewMonth(lastAlertDate, currentDate) {
//   return (
//     lastAlertDate.getMonth() !== currentDate.getMonth() ||
//     lastAlertDate.getFullYear() !== currentDate.getFullYear()
//   )
// }

function shouldSendNewAlert(lastAlertDate, currentDate) {
  if (!lastAlertDate) return true;
  const lastAlert = new Date(lastAlertDate);
  const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  return currentDate.getTime() - lastAlert.getTime() >= weekInMilliseconds;
}

//Trigger recurring transaction with batching
export const triggerRecurringTransactions = inngest.createFunction({
  id: "trigger-recurring-transactions", //unique id
  name: "Trigger Recurring Transaction",
},
  { cron: "0 0 * * *" }, //daily at minight
  async ({ step }) => {
    //1.fetch all due recurring transactions

    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null }, //Never processed
              {
                nextRecurringDate: {
                  lte: new Date(),

                },
              },
            ]
          }
        })
      }
    );


    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      await inngest.send(events);
    }
    return { triggered: recurringTransactions.length }
  }
)
export const processRecurringTransaction = inngest.createFunction({
  id: "process-recurring-transaction",
  name: "Process Recurring Transaction",
  throttle: {
    limit: 10, //Only proces 10 transaction
    period: "1m", //per min
    key: "event.data.userId", //per user
  },
},
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    //Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("invalid event data:", event);
      return { error: "Missing required event data" };
    }
    await step.run("proces-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;
        //Create new transaction and update account balance in a transaction
     
      await db.$transaction(async (tx) => {
        //Create new transaction 
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        //Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } }
        })
        //Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            )
          }
        })


      })
    })
  })
////////
function isTransactionDue(transaction) {
  //if no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;
  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);
  //Compare with nextDue date
  return nextDue <= today;
}
// Helpes function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}

export const generatteMonthlyReports = inngest.createFunction (  {
  id: "generate-monthlly-reports",
  name: "Generate Monthly Reportss",

},
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    })
    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        })

        //gerenartive AI insight
        const insights = await generateFinancialInsights( stats, monthName);

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            }
          })
        });
      })
    }
    return { processed: users.length }

  });

// 2. Monthly Report Generation
async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
       Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: ₹${stats.totalIncome}
    - Total Expenses: ₹${stats.totalExpenses}
    - Net Income: ₹${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: ₹${amount}`)
      .join(", ")}

      Also provide current profitable stocks they can afford to invest in if they save enough money.

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
      
    `
  try {
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("Invalid response from Gemini API");
    }

    const response = result.response;
    const text = response.text();
    // console.log("Gemini API response text:", text);
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

const getMonthlyStats = async (userId, month) => {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}