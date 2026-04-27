"use client";

import { useState } from "react";

export const TransactionList = ({
  transactions,
  visibleCount,
  setVisibleCount,
  expanded,
  setExpanded,
  onDelete,
  onEdit
}: any) => {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      onDelete(id);
      setRemovingId(null);
    }, 250);
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {transactions.slice(0, visibleCount).map((t: any) => (
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
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
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
              <button onClick={() => onEdit(t)} style={btnSecondary}>✏️</button>
              <button onClick={() => handleDelete(t.id)} style={btnDanger}>🗑</button>
            </div>
          </div>
        </div>
      ))}

      {transactions.length > 6 && (
        <button
          onClick={() => {
            if (expanded) {
              setVisibleCount(6);
              setExpanded(false);
            } else {
              setVisibleCount(transactions.length);
              setExpanded(true);
            }
          }}
          style={btnMore}
        >
          {expanded ? "Свернуть" : "Показать ещё"}
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