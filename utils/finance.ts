// 💰 Баланс по валюте
export const calculateBalance = (transactions: any, currency: any) => {
  if (!Array.isArray(transactions)) return 0;

  const safeCurrency = (currency || "").toString().toUpperCase();

  return transactions.reduce((sum, t) => {
    const txCurrency = (t.currency || "").toString().toUpperCase();

    if (txCurrency !== safeCurrency) return sum;

    if (t.type === "income") return sum + Number(t.amount || 0);
    if (t.type === "expense") return sum - Number(t.amount || 0);

    return sum;
  }, 0);
};

// 📅 Статистика за сегодня
export const getDayStats = (transactions: any[]) => {
  if (!Array.isArray(transactions)) {
    return { income: 0, expense: 0, balance: 0 };
  }

  let income = 0;
  let expense = 0;

  const today = new Date().toDateString();

  transactions.forEach((t) => {
    let date = "";

    if (t.date?.seconds) {
      // 🔥 Firebase дата
      date = new Date(t.date.seconds * 1000).toDateString();
    } else if (t.date) {
      // обычная дата
      date = new Date(t.date).toDateString();
    }

    if (date !== today) return;

    const amount = Number(t.amount) || 0;

    if (t.type === "income") income += amount;
    if (t.type === "expense") expense += amount;
  });

  return {
    income,
    expense,
    balance: income - expense
  };
};

// 📊 Расходы по категориям
export const getCategoryStats = (transactions: any[]) => {
  if (!Array.isArray(transactions)) return {};

  const categories: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type !== "expense") return;

    const cat = t.category || "Другое";
    const amount = Number(t.amount) || 0;

    if (!categories[cat]) categories[cat] = 0;

    categories[cat] += amount;
  });

  return categories;
};