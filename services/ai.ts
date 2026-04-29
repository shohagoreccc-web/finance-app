export const askAI = async (
  transactions: any,
  question: string,
  messages: any[]
) => {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transactions,
        question,
        messages
      })
    });

    const data = await res.json();
    return data.answer;
  } catch (e: any) {
    return "Ошибка: " + e.message;
  }
};
export const analyzeFinance = (transactions: any[]) => {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    income,
    expense,
    balance: income + expense
  };
};