export const askAI = async (transactions: any, question?: string) => {
  try {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transactions: safeTransactions,
        question
      })
    });

    const data = await res.json();

    return data.answer;
  } catch (e: any) {
    return "Ошибка: " + e.message;
  }
};