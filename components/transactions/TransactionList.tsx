"use client";

import { useState } from "react";

export const TransactionList = ({
  transactions,
  expanded,
  setExpanded,
  onDelete,
  onEdit
}: any) => {

  const [removingId, setRemovingId] = useState<string | null>(null);

  // 🔥 правильное отображение
  const displayed = expanded
    ? transactions
    : transactions.slice(0, 4);

  const handleDelete = async (id: string) => {
    setRemovingId(id);

    try {
      console.log("🗑 DELETE:", id);

      await onDelete(id); // 🔥 ВАЖНО await

    } catch (e) {
      console.error("DELETE ERROR:", e);
    }

    setTimeout(() => {
      setRemovingId(null);
    }, 200);
  };

  return (
    <div style={{ marginTop: "15px" }}>

      {displayed.map((t: any) => (
        <div
          key={t.id}
          style={{
            background: "linear-gradient(135deg,#0f172a,#1e293b)",
            padding: "14px",
            borderRadius: "16px",
            marginBottom: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: removingId === t.id ? 0 : 1,
            transform: removingId === t.id ? "scale(0.95)" : "scale(1)",
            transition: "all 0.25s ease",
            cursor: "pointer"
          }}
        >

          {/* ЛЕВАЯ ЧАСТЬ */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              {t.type === "income" ? "💰" : "💸"}
            </div>

            <div>
              <div style={{ fontWeight: 600 }}>
                {t.title || "Без названия"}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.6 }}>
                {t.category || "Другое"}
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              color: t.type === "income" ? "#22c55e" : "#ef4444",
              fontWeight: "bold"
            }}>
              {t.type === "income" ? "+" : "-"}
              {Number(t.amount).toLocaleString()}{" "}
              {t.currency === "USD" ? "$" : "сум"}
            </div>

            <div style={{
              display: "flex",
              gap: 6,
              marginTop: 6,
              justifyContent: "flex-end"
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(t);
                }}
                style={btnSecondary}
              >
                ✏️
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(t.id);
                }}
                style={btnDanger}
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* 🔥 КНОПКА */}
      {transactions.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={btnMore}
        >
          {expanded ? "Скрыть" : "Показать ещё"}
        </button>
      )}

    </div>
  );
};

const btnMore = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#22c55e",
  color: "white"
};

const btnSecondary = {
  padding: "6px 8px",
  borderRadius: "8px",
  border: "none",
  background: "#334155",
  color: "white"
};

const btnDanger = {
  padding: "6px 8px",
  borderRadius: "8px",
  border: "none",
  background: "#ef4444",
  color: "white"
};