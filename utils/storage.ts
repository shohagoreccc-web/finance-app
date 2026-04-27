// 🔐 ключи
const TX_KEY = "sm_transactions";

// 📥 загрузка
export const loadTransactions = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// 📤 сохранение
export const saveTransactions = (transactions: any[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.log("save error", e);
  }
};