"use client";

import { useState, useEffect } from "react";
import { loadTransactions, saveTransactions } from "@/utils/storage";

export const useFinance = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  // 📥 загрузка
  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  // 📤 сохранение
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // ➕ добавить
  const addTransaction = (tx: any) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  // ❌ удалить
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ✏️ обновить
  const updateTransaction = (updated: any) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };
};