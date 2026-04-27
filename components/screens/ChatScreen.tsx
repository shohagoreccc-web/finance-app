"use client";

import { useEffect, useRef } from "react";

export const ChatScreen = ({
  messages,
  input,
  setInput,
  sendMessage
}: any) => {

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔥 автоскролл вниз
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      padding: "20px",
      color: "white",
      maxWidth: "400px",
      margin: "0 auto",
      paddingBottom: "100px"
    }}>

      <h2>💬 Финансовый AI</h2>

      {/* 💬 сообщения */}
      <div style={{
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        {messages.map((m: any, i: number) => (
          <div
            key={i}
            style={{
              background: m.role === "user" ? "#22c55e" : "#1e293b",
              color: m.role === "user" ? "#000" : "#fff",
              padding: "10px 14px",
              borderRadius: "14px",
              maxWidth: "80%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
            }}
          >
            {m.text}
          </div>
        ))}

        {/* 👇 якорь для автоскролла */}
        <div ref={bottomRef} />
      </div>

        <button
  onClick={() => sendMessage("Проанализируй мои финансы")}
  style={{
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    background: "#3b82f6",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold"
  }}
>
  📊 Проанализировать финансы
</button>

      {/* ✏️ input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Напиши сообщение..."
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "12px",
          borderRadius: "12px",
          border: "none",
          background: "#1e293b",
          color: "white",
          outline: "none"
        }}
      />

      {/* 🚀 кнопка */}
      <button
        onClick={sendMessage}
        style={{
          marginTop: "10px",
          padding: "12px",
          width: "100%",
          background: "#22c55e",
          border: "none",
          borderRadius: "12px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Отправить
      </button>

    </div>
  );
};