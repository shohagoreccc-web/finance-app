export const calculateDebtForecast = (transactions: any[]) => {
  // 🔥 защита от undefined / null
  const safeTx = Array.isArray(transactions) ? transactions : [];

  let income = 0;
  let expense = 0;
  let debt = 0;

  for (const t of safeTx) {
    if (!t) continue;

    if (t.type === "income") income += Number(t.amount) || 0;
    if (t.type === "expense") expense += Number(t.amount) || 0;
    if (t.type === "debt") debt += Number(t.amount) || 0;
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

// 🛟 обязательные деньги на жизнь
const livingCost = income * 0.6;

// 🔥 резерв
const reserve = income * 0.1;

// 💰 комфортные деньги
const safeMoney =
  income - expense - livingCost - reserve;

// 💳 комфортный платёж
const comfortable = safeMoney * 0.7;

// ⏳ реальный срок
const months = Math.ceil(
  debt / comfortable
);

  return {
    months,
    message: `Закроешь долг примерно за ${months} мес.`
  };
};