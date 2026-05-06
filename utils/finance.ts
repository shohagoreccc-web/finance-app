// 💱 курс USD
const USD_RATE = 13000;

// 💰 Баланс по валюте
export const calculateBalance = (
  transactions: any[],
  currency: string
) => {

  if (!Array.isArray(transactions)) {
    return 0;
  }

  const safeCurrency = (
    currency || ""
  )
    .toString()
    .toUpperCase();

  return transactions.reduce(
    (sum, t) => {

      const txCurrency = (
        t.currency || ""
      )
        .toString()
        .toUpperCase();

      if (
        txCurrency !== safeCurrency
      ) {
        return sum;
      }

      // 💰 доход
      if (t.type === "income") {
        return sum + Number(t.amount || 0);
      }

      // 💸 расход
      if (t.type === "expense") {
        return sum - Number(t.amount || 0);
      }

      return sum;

    },
    0
  );
};

// 📅 Статистика за сегодня
export const getDayStats = (
  transactions: any[]
) => {

  if (!Array.isArray(transactions)) {

    return {
      income: 0,
      expense: 0,
      balance: 0
    };

  }

  let income = 0;
  let expense = 0;

  const today =
    new Date().toDateString();

  transactions.forEach((t) => {

    let date = "";

    // 🔥 Firebase Timestamp
    if (t.date?.seconds) {

      date = new Date(
        t.date.seconds * 1000
      ).toDateString();

    }

    // 🔥 обычная дата
    else if (t.date) {

      date = new Date(
        t.date
      ).toDateString();

    }

    if (date !== today) return;

    const amount =
      Number(t.amount) || 0;

    if (t.type === "income") {
      income += amount;
    }

    if (t.type === "expense") {
      expense += amount;
    }

  });

  return {

    income,

    expense,

    balance:
      income - expense

  };

};

// 📊 Расходы по категориям
export const getCategoryStats = (
  transactions: any[]
) => {

  if (!Array.isArray(transactions)) {
    return {};
  }

  const categories:
    Record<string, number> = {};

  transactions.forEach((t) => {

    if (t.type !== "expense") {
      return;
    }

    const cat =
      t.category || "Другое";

    const amount =
      Number(t.amount) || 0;

    if (!categories[cat]) {
      categories[cat] = 0;
    }

    categories[cat] += amount;

  });

  return categories;
};

// 💳 AI план погашения
export const buildDebtPlan = (
  transactions: any[]
) => {

  const safe = Array.isArray(transactions)
    ? transactions
    : [];

  // 💰 ДОХОД
  const income = safe
    .filter(t => t.type === "income")
    .reduce(
      (s, t) =>
        s + Number(t.amount || 0),
      0
    );

  // 💸 РАСХОДЫ
  const expense = safe
    .filter(t => t.type === "expense")
    .reduce(
      (s, t) =>
        s + Number(t.amount || 0),
      0
    );

  // 🏦 ДОЛГИ
  const debt = safe
    .filter(t => t.type === "debt")
    .reduce((s, t) => {

      const amount =
        Number(t.amount || 0);

      // 💵 USD → SUM
      if (t.currency === "USD") {
        return s + amount * USD_RATE;
      }

      return s + amount;

    }, 0);

  // 🛟 РЕЗЕРВ НА ЖИЗНЬ
  // 🛟 обязательные деньги на жизнь
const livingCost = income * 0.6;

// 🔥 резерв
const reserve = income * 0.1;

// 💰 реальные свободные деньги
const safeMoney =
  income - expense - livingCost - reserve;

  // ❌ долгов нет
  if (debt <= 0) {

    return {

  message:
    "У тебя нет долгов 🎉",

  months: 0,

  balancedPayment: 0,

  minimumPayment: 0,

  aggressivePayment: 0,

  reserve: 0,

  totalDebt: 0

};

  }

  // ❌ нечем платить
  if (safeMoney <= 0) {

    return {

  message:
    "Сейчас нет безопасной суммы для погашения ❌",

  months: 0,

  balancedPayment: 0,

  minimumPayment: 0,

  aggressivePayment: 0,

  reserve: 0,

  totalDebt: debt

};

  }

// 💸 минимальный
const minimum = Math.round(
  income * 0.2
);

// ⚖️ сбалансированный
const balanced = Math.round(
  income * 0.50
);

// 🚀 агрессивный
const aggressive = Math.round(
  income * 1.0
);

const months = Math.ceil(
  debt / balanced
);

  return {

  message:
  `Сбалансированный платёж ${balanced.toLocaleString()} сум в месяц`,

    months,

    balancedPayment:
  balanced,

    minimumPayment:
      minimum,

    aggressivePayment:
      aggressive,

    reserve,

    totalDebt: debt

  };

};

// 🧠 AI стратегия
export const buildSmartStrategy = (
  transactions: any[]
) => {

  const safe = Array.isArray(transactions)
    ? transactions
    : [];

  const income = safe
    .filter(t => t.type === "income")
    .reduce(
      (s, t) =>
        s + Number(t.amount || 0),
      0
    );

  const expense = safe
    .filter(t => t.type === "expense")
    .reduce(
      (s, t) =>
        s + Number(t.amount || 0),
      0
    );

  const debt = safe
    .filter(t => t.type === "debt")
    .reduce((s, t) => {

      const amount =
        Number(t.amount || 0);

      // 💵 USD → SUM
      if (t.currency === "USD") {
        return s + amount * USD_RATE;
      }

      return s + amount;

    }, 0);

  // 🛟 резерв
  const reserve = income * 0.4;

  const safeMoney =
    income - expense - reserve;

  if (debt <= 0) {

    return [
      "👍 У тебя нет долгов"
    ];

  }

  const tips: string[] = [];
  const currentMonths =

  safeMoney > 0

    ? Math.ceil(
        debt / safeMoney
      )

    : 0;

// 📊 категории
const categories:
  Record<string, number> = {};

safe.forEach((t) => {

  if (t.type === "expense") {

    categories[t.category] =
      (categories[t.category] || 0)
      + Number(t.amount || 0);

  }

});

// 🔥 самая большая категория
const top = Object
  .entries(categories)
  .sort((a, b) => b[1] - a[1])[0];

// 💼 доход
const extraIncome = 5000000;

const fasterMonths = Math.ceil(
  debt / (safeMoney + extraIncome)
);

const savedMonths =
  currentMonths - fasterMonths;

tips.push(
  `💼 Доп. доход +1000000 сократит срок на ${Math.max(
    savedMonths,
    0
  )} мес.`
);

// 📉 сокращение расходов
if (top) {

  tips.push(
    `📉 Сокращение "${top[0]}" на 20% освободит ${Math.round(
      top[1] * 0.2
    ).toLocaleString()} сум`
  );

}

// 🛟 резерв
tips.push(
  `🛟 Рекомендуемый резерв: ${Math.round(
    reserve
  ).toLocaleString()} сум`
);

// 🚀 aggressive
tips.push(
  `🚀 Агрессивное погашение позволит закрыть долг быстрее`
);

// ⏳ balanced
tips.push(
  `⏳ Сбалансированный режим снижает нагрузку`
);

return tips;
};