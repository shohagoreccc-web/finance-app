// 📡 Отправка запроса к AI
export const fetchAIAdvice = async (
  text: string,
  transactions: any[],
  debts: any[],
  goals: any[]
) => {
  try {
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

    const data = await res.json();

    if (!res.ok) {
      console.log("🔥 REAL ERROR:", data);
      throw new Error(data.answer || "AI error");
    }

    return data.answer;
  } catch (error: any) {
    console.log("🔥 FETCH ERROR:", error);
    return "Ошибка: " + error.message;
  }
};


// 🧠 Анализ данных (мозг AI)
export function analyzeData(transactions: any[], debts: any[]) {
  let income = 0;
  let expenses = 0;

  const categories: Record<string, number> = {};

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;

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