"use client";

import { useState } from "react";
import { registerUser, loginUser } from "@/services/auth";

export const AuthScreen = ({ onAuth }: any) => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      let user;

      if (isLogin) {
        user = await loginUser(email, password);
      } else {
        user = await registerUser(email, password);
        alert("Мы отправили письмо на почту 📧");
        return;
      }

      onAuth(user);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>

      <h1 style={title}>💸 Finance AI</h1>

      <div style={tabs}>
        <button
          style={isLogin ? activeTab : tab}
          onClick={() => setIsLogin(true)}
        >
          Вход
        </button>
        <button
  style={btn}
  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.95)";
    e.currentTarget.style.opacity = "0.8";
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.opacity = "1";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.opacity = "1";
  }}
>
  Зарегистрироваться
</button>
      </div>

      <div style={card}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        {error && <div style={errorText}>{error}</div>}

        <button onClick={handleSubmit} style={btn}>
          {loading
            ? "Загрузка..."
            : isLogin
            ? "Войти"
            : "Зарегистрироваться"}
        </button>
      </div>

    </div>
  );
};

/* ===== СТИЛИ ===== */

const container: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "20px",
  background: "#020617",
  color: "white"
};

const title: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px"
};

const tabs: React.CSSProperties = {
  display: "flex",
  marginBottom: "15px"
};

const tab: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  background: "#1e293b",
  border: "none",
  color: "white"
};

const activeTab: React.CSSProperties = {
  ...tab,
  background: "#22c55e",
  color: "black"
};

const card: React.CSSProperties = {
  background: "#0f172a",
  padding: "20px",
  borderRadius: "15px"
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white"
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#22c55e",
  color: "black",
  fontWeight: "600",
  transition: "0.2s",
  cursor: "pointer"
};

const errorText: React.CSSProperties = {
  color: "#ef4444",
  marginTop: "10px"
};