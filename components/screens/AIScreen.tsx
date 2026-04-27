"use client";

import { analyzeFinance } from "@/services/ai";

export const AIScreen = ({ transactions }: any) => {
  const data = analyzeFinance(transactions);

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        maxWidth: "400px",
        margin: "0 auto"
      }}
    >
      <h2>🤖 AI Анализ</h2>

      <div style={box}>
        <div>📈 Доход: {data.income}</div>
        <div>📉 Расход: {data.expense}</div>
        <div>💰 Баланс: {data.balance}</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>📊 Рекомендации</h3>

        {data.advice.map((a: string, i: number) => (
          <div key={i} style={advice}>
            {a}
          </div>
        ))}
      </div>
    </div>
  );
};

const box = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "10px"
};

const advice = {
  background: "#0f172a",
  padding: "10px",
  borderRadius: "10px",
  marginTop: "10px"
};