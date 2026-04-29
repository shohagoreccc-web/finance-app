"use client";

import { useState } from "react";
import { saveUserProfile } from "../../services/user";

export const OnboardingScreen = ({ user, onFinish }: any) => {
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [debt, setDebt] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // 🔥 защита
    if (!user?.uid) {
      alert("Ошибка пользователя");
      return;
    }

    if (!name || !income) {
      alert("Заполни имя и доход");
      return;
    }

    setLoading(true);

    try {
      await saveUserProfile(user.uid, {
        name,
        income: Number(income) || 0,
        debt: Number(debt) || 0,
        goal
      });

      onFinish();
    } catch (e: any) {
      console.error(e);
      alert("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2>Расскажи о себе</h2>

      <input
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <input
        placeholder="Доход"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        style={input}
      />

      <input
        placeholder="Долги"
        value={debt}
        onChange={(e) => setDebt(e.target.value)}
        style={input}
      />

      <input
        placeholder="Цель"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={input}
      />

      <button onClick={handleSave} style={btn} disabled={loading}>
        {loading ? "⏳ Сохраняем..." : "Продолжить"}
      </button>
    </div>
  );
};

/* ===== СТИЛИ ===== */

const container: React.CSSProperties = {
  padding: "20px",
  color: "white"
};

const input: React.CSSProperties = {
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white"
};

const btn: React.CSSProperties = {
  marginTop: "20px",
  padding: "12px",
  width: "100%",
  background: "#22c55e",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "0.2s"
};