// 📡 Отправка запроса к AI
export const fetchAIAdvice = async (
  text: string,
  transactions: any[],
  debts: any,
  goals: any[]
) => {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      transactions,
      debts,
      goals,
    }),
  });

  if (!res.ok) {
    throw new Error("AI error");
  }

  const data = await res.json();
  return data.answer;
};

// 🧠 Анализ данных (мозг AI)
export function analyzeData(transactions: any[], debts: any[] | any) {
  let income = 0;
  let expenses = 0;

  const categories: Record<string, number> = {};

  transactions.forEach((tx) => {
    const amount = Number(tx.amount);

    if (tx.type === "income") {
      income += amount;
    }

    if (tx.type === "expense") {
      expenses += amount;

      if (!categories[tx.category]) {
        categories[tx.category] = 0;
      }

      categories[tx.category] += amount;
    }
  });

  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
    categories,
    debts,
  };
}