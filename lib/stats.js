// lib/stats.js

export const filterByPeriod = (transactions, period) => {
  const now = new Date();

  return transactions.filter(t => {
    const date = new Date(t.date);

    switch (period) {
      case "day":
        return date.toDateString() === now.toDateString();

      case "week":
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;

      case "month":
        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();

      case "year":
        return date.getFullYear() === now.getFullYear();

      default:
        return true;
    }
  });
};

export const getStats = (transactions) => {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense };
};