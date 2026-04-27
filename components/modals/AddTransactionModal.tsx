"use client";

import { useEffect, useState } from "react";
import { incomeCategories, expenseCategories } from "@/utils/categories";

type Tx = {
  id?: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  currency: "UZS" | "USD";
  category?: string;
  date?: string;
};

export const AddTransactionModal = ({
  onAdd,
  onUpdate,
  onClose,
  editTx
}: any) => {

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [currency, setCurrency] = useState<"UZS" | "USD">("UZS");
  const [category, setCategory] = useState("Другое");

  useEffect(() => {
    if (editTx) {
      setTitle(editTx.title || "");
      setAmount(String(editTx.amount ?? ""));
      setType(editTx.type || "expense");
      setCurrency(editTx.currency || "UZS");
      setCategory(editTx.category || "Другое");
    }
  }, [editTx]);

  const submit = () => {
    if (!title || !amount || !category) return;

    const tx: Tx = {
      id: editTx?.id || Date.now().toString(),
      title,
      amount: Number(amount),
      type,
      currency,
      category,
      date: editTx?.date || new Date().toISOString()
    };

    if (editTx && onUpdate) {
      onUpdate(tx);
    } else {
      onAdd(tx);
    }

    onClose();
  };

  return (
    <div style={overlay}>
      <div style={card}>
        <h3 style={{ marginBottom: 10 }}>
          {editTx ? "✏️ Редактировать" : "➕ Добавить операцию"}
        </h3>

        <input
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <input
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          style={input}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            style={select}
          >
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
            <option value="debt">Долг</option>
          </select>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            style={select}
          >
            <option value="UZS">UZS</option>
            <option value="USD">USD</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={select}
          >
            {(type === "income" ? incomeCategories : expenseCategories).map((c) => (
              <option key={c.name} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button onClick={onClose} style={btnCancel}>
            Отмена
          </button>
          <button onClick={submit} style={btnOk}>
            {editTx ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50
};

const card = {
  width: "90%",
  maxWidth: "400px",
  background: "#0f172a",
  borderRadius: "16px",
  padding: "16px",
  color: "white"
};

const input = {
  width: "100%",
  marginTop: 8,
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white"
};

const select = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.05)",
  background: "#0f172a",
  color: "white"

};

const btnOk = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg,#22c55e,#16a34a)",
  color: "white"
};

const btnCancel = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg,#334155,#1e293b)",
  color: "white"
};