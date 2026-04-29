export const calculateDebtForecast = (transactions: any[]) => {
  let income = 0;
  let expense = 0;
  let debt = 0;

  for (const t of transactions) {
    if (t.type === "income") income += Number(t.amount);
    if (t.type === "expense") expense += Number(t.amount);
    if (t.type === "debt") debt += Number(t.amount);
  }

  const balance = income - expense;

  if (debt <= 0) {
    return {
      months: 0,
      message: "У тебя нет долгов 👍"
    };
  }

  if (balance <= 0) {
    return {
      months: null,
      message: "⚠️ Ты не сможешь закрыть долг с текущими расходами"
    };
  }

  const months = Math.ceil(debt / balance);

  return {
    months,
    message: `Закроешь долг примерно за ${months} мес.`
  };
};