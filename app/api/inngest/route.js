import { serve } from "inngest/next";
import { checkBudgetAlerts, generatteMonthlyReports, helloWorld, processRecurringTransaction, triggerRecurringTransactions } from "@/app/lib/inngest/functions";
import { inngest } from "@/app/lib/inngest/client";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkBudgetAlerts, triggerRecurringTransactions,
    processRecurringTransaction,
    generatteMonthlyReports
  ],
}); 