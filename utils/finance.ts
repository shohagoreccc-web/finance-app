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
export const buildDebtPlan = (transactions: any[]) => {
  const safe = Array.isArray(transactions) ? transactions : [];

  const income = safe
    .filter(t => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = safe
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const debt = safe
    .filter(t => t.type === "debt")
    .reduce((s, t) => s + Number(t.amount), 0);

  const freeMoney = income - expense;

  if (debt <= 0) {
    return {
      message: "У тебя нет долгов 🎉"
    };
  }

  if (freeMoney <= 0) {
    return {
      message: "Нет свободных денег для погашения ❌"
    };
  }

  const months = Math.ceil(debt / freeMoney);

  return {
    message: `Погаси по ${freeMoney.toLocaleString()} в месяц`,
    months,
    monthlyPayment: freeMoney,
    totalDebt: debt
  };
};
export const buildSmartStrategy = (transactions: any[]) => {
  const safe = Array.isArray(transactions) ? transactions : [];

  const income = safe
    .filter(t => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = safe
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const debt = safe
    .filter(t => t.type === "debt")
    .reduce((s, t) => s + Number(t.amount), 0);

  const free = income - expense;

  if (debt <= 0) return [];

  const tips: string[] = [];

  // 🔥 базовый срок
  const currentMonths = free > 0 ? Math.ceil(debt / free) : null;

  // 🔥 категории
  const categories: Record<string, number> = {};

  safe.forEach(t => {
    if (t.type === "expense") {
      categories[t.category] =
        (categories[t.category] || 0) + Number(t.amount);
    }
  });

  const top = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  // 🔥 если есть главная категория
  if (top && free > 0) {
    const reduced = free + top[1] * 0.2; // сократить 20%
    const newMonths = Math.ceil(debt / reduced);

    if (currentMonths && newMonths < currentMonths) {
      tips.push(
        `📉 Если сократишь "${top[0]}" на 20%, закроешь долг на ${
          currentMonths - newMonths
        } мес. быстрее`
      );
    }
  }

  // 🔥 если увеличить доход
  const extraIncome = free + 500000;

  if (free > 0) {
    const faster = Math.ceil(debt / extraIncome);

    if (currentMonths && faster < currentMonths) {
      tips.push(
        `💼 Если увеличишь доход на 500k, сократишь срок на ${
          currentMonths - faster
        } мес.`
      );
    }
  }

  if (tips.length === 0) {
    tips.push("👍 Ты уже двигаешься оптимально");
  }

  return tips;
};