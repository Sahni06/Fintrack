import EmailTemplate from "@/emails/template";

export default function EmailPreviewPage() {
  const PREVIEW_DATA = {
    monthlyReport: {
      userName: "John Doe",
      type: "monthly-report",
      data: {
        month: "December",
        stats: {
          totalIncome: 5000,
          totalExpenses: 3500,
          byCategory: {
            housing: 1500,
            groceries: 600,
            transportation: 400,
            entertainment: 300,
            utilities: 700,
          },
        },
        insights: [
          "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
          "Great job keeping entertainment expenses under control this month!",
          "Setting up automatic savings could help you save 20% more of your income.",
        ],
      },
    },
  };

  const { userName, type, data } = PREVIEW_DATA.monthlyReport;

  return <EmailTemplate userName={userName} type={type} data={data} />;
}
