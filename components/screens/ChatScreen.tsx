"use client";

import { askAI } from "@/services/ai";

export const ChatScreen = ({
  messages,
  input,
  setInput,
  sendMessage
}: any) => {

  const renderAI = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, i) => {
      if (line.includes("АНАЛИЗ")) {
        return <div key={i} style={title}>📊 {line}</div>;
      }

      if (line.includes("ОШИБКИ")) {
        return <div key={i} style={title}>❌ {line}</div>;
      }

      if (line.includes("СОВЕТЫ")) {
        return <div key={i} style={title}>💡 {line}</div>;
      }

      return <div key={i} style={textStyle}>{line}</div>;
    });
  };

  return (
    <div style={container}>

      {/* ЧАТ */}
      <div style={chatBox}>
        {messages.map((m: any, i: number) => (
          <div
            key={i}
            style={{
              ...bubble,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user"
                  ? "#22c55e"
                  : "#1e293b",
              color: m.role === "user" ? "#000" : "#fff"
            }}
          >
            {m.role === "assistant"
              ? renderAI(m.text)
              : m.text}
          </div>
        ))}
      </div>

      {/* ВВОД */}
      <div style={inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спроси AI..."
          style={inputStyle}
        />

        <button onClick={() => sendMessage()} style={btn}>
          ➤
        </button>
      </div>

    </div>
  );
};

/* ===== СТИЛИ ===== */

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "10px"
};

const chatBox: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  overflowY: "auto",
  paddingBottom: "10px"
};

const bubble: React.CSSProperties = {
  padding: "10px",
  borderRadius: "12px",
  maxWidth: "80%",
  fontSize: "14px",
  lineHeight: "1.4"
};

const inputBox: React.CSSProperties = {
  display: "flex",
  gap: "8px"
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white"
};

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#22c55e",
  color: "black",
  fontWeight: "600"
};

const title: React.CSSProperties = {
  fontWeight: "700",
  marginTop: "6px",
  color: "#22c55e"
};

const textStyle: React.CSSProperties = {
  marginTop: "3px",
  opacity: 0.9
};