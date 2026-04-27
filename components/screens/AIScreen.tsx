"use client";

import { useState } from "react";
import { askAI } from "@/services/ai";

export const AIScreen = ({ transactions }: any) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);

    const res = await askAI(
      transactions,
      "Проанализируй мои финансы и дай рекомендации"
    );

    setAnswer(res);
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        width: "100%"
      }}
    >
      <h2>🤖 AI Анализ</h2>

      {/* КНОПКА */}
      <button
        onClick={handleAnalyze}
        style={{
          marginTop: "15px",
          padding: "12px",
          width: "100%",
          background: "#22c55e",
          border: "none",
          borderRadius: "10px",
          color: "black",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        {loading ? "⏳ Анализ..." : "Получить анализ"}
      </button>

      {/* ОТВЕТ AI */}
      {answer && (
        <div
          style={{
            marginTop: "20px",
            background: "#0f172a",
            padding: "15px",
            borderRadius: "10px",
            lineHeight: "1.5"
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
};