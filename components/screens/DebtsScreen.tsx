"use client";

import { useState } from "react";

export const DebtsScreen = ({
  debts,
  transactions,
  debtName,
  setDebtName,
  debtAmount,
  setDebtAmount,
  addDebt,
  payDebt,
  deleteDebt
}: any) => {

  console.log("🔥 NEW DEBTS SCREEN");
  const [currency, setCurrency] = useState("UZS");
  const safeDebts = Array.isArray(debts) ? debts : [];
  
  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  const total = safeDebts.reduce(
    (sum: number, d: any) =>
      sum + Number(d.amount || 0),
    0
  );

  return (
    <div style={container}>

      <h2 style={title}>💸 Долги</h2>

      {/* ➕ ДОБАВИТЬ */}
      <div style={formBox}>

        <input
          placeholder="Название долга"
          value={debtName}
          onChange={(e) => setDebtName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Сумма"
          type="number"
          value={debtAmount}
          onChange={(e) => setDebtAmount(e.target.value)}
          style={input}
        />
          <select
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  style={input}
>
  <option value="UZS">UZS</option>
  <option value="USD">USD</option>
  <option value="RUB">RUB</option>
</select>
        <button
  onClick={() =>
    addDebt(currency)
  }
  style={addBtn}
>
  ➕ Добавить долг
</button>

      </div>

      {/* 💰 ОБЩИЙ ДОЛГ */}
      <div style={totalBox}>
        Общий долг: {total.toLocaleString()}
      </div>

      {/* 📋 СПИСОК */}
      <div style={{ marginTop: 15 }}>

        {safeDebts.length === 0 && (
          <div style={empty}>
            У тебя пока нет долгов 👍
          </div>
        )}

        {safeDebts.map((d: any) => {

          const paid = safeTransactions
            .filter(
              (t: any) =>
                t.type === "debt_payment" &&
                t.debtId === d.id
            )
            .reduce(
              (sum: number, t: any) =>
                sum + Number(t.amount || 0),
              0
            );

          const remaining = Math.max(
            Number(d.amount || 0) - paid,
            0
          );

          const percent = Math.min(
            (paid / Number(d.amount || 1)) * 100,
            100
          );

          return (
            <div
              key={d.id}
              style={card}
            >

              {/* HEADER */}
              <div style={topRow}>

                <div>
                  <div style={debtNameStyle}>
                    {d.title || d.name || "Без названия"}
                  </div>

                  <div style={smallText}>
                    Осталось: {remaining.toLocaleString()}
{" "}
{d.currency === "USD"
  ? "$"
  : "сум"}
                  </div>
                </div>

                <div style={amount}>
                  -{Number(d.amount || 0).toLocaleString()}
{" "}
{d.currency === "USD"
  ? "$"
  : "сум"}
                </div>

              </div>

              {/* PROGRESS */}
              <div style={progressBg}>
                <div
                  style={{
                    ...progressFill,
                    width: `${percent}%`
                  }}
                />
              </div>

              <div style={smallText}>
                Погашено: {Math.round(percent)}%
              </div>

              {/* 💰 BUTTON */}
              <button
                onClick={() => payDebt(d)}
                style={payBtn}
              >
                💰 Погасить
              </button>

              {/* 🗑 BUTTON */}
              <button
                onClick={() => {

                  const ok = confirm(
                    "Удалить долг?"
                  );

                  if (!ok) return;

                  deleteDebt(d.id);

                }}
                style={deleteBtn}
              >
                🗑 Удалить долг
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
};

/* ===== STYLES ===== */

const container: React.CSSProperties = {
  padding: "20px",
  color: "white"
};

const title: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700"
};

const formBox: React.CSSProperties = {
  background: "#0f172a",
  padding: "15px",
  borderRadius: "16px",
  marginTop: "15px"
};

const input: React.CSSProperties = {
  width: "100%",
  marginTop: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white"
};

const addBtn: React.CSSProperties = {
  width: "100%",
  marginTop: "12px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#22c55e",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer"
};

const totalBox: React.CSSProperties = {
  marginTop: "15px",
  background: "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  fontWeight: "600"
};

const empty: React.CSSProperties = {
  marginTop: "20px",
  opacity: 0.7
};

const card: React.CSSProperties = {
  background: "#0f172a",
  padding: "15px",
  borderRadius: "16px",
  marginTop: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const topRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const debtNameStyle: React.CSSProperties = {
  fontWeight: "700",
  fontSize: "16px"
};

const amount: React.CSSProperties = {
  color: "#ef4444",
  fontWeight: "700"
};

const smallText: React.CSSProperties = {
  fontSize: "12px",
  opacity: 0.7
};

const progressBg: React.CSSProperties = {
  height: "8px",
  background: "#1e293b",
  borderRadius: "10px",
  overflow: "hidden"
};

const progressFill: React.CSSProperties = {
  height: "100%",
  background: "#22c55e",
  borderRadius: "10px"
};

const payBtn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer"
};

const deleteBtn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer"
};