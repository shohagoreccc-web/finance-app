"use client";

export const ProfileScreen = ({
  user,
  transactions,
  onLogout
}: any) => {

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const totalIncome = safeTransactions
    .filter((t: any) => t.type === "income")
    .reduce((s: number, t: any) => s + Number(t.amount), 0);

  const totalExpense = safeTransactions
    .filter((t: any) => t.type === "expense")
    .reduce((s: number, t: any) => s + Number(t.amount), 0);

  return (
    <div style={container}>

      {/* 👤 ПРОФИЛЬ */}
      <div style={profileCard}>
        <div style={avatar}>
          {user?.email?.[0]?.toUpperCase() || "U"}
        </div>

        <div style={name}>
          {user?.displayName || "Пользователь"}
        </div>

        <div style={email}>
          {user?.email || "Нет email"}
        </div>
      </div>

      {/* 📊 СТАТИСТИКА */}
      <div style={statsBox}>
        <div style={stat}>
          <div>Доход</div>
          <b style={{ color: "#22c55e" }}>
            {totalIncome.toLocaleString()}
          </b>
        </div>

        <div style={stat}>
          <div>Расход</div>
          <b style={{ color: "#ef4444" }}>
            {totalExpense.toLocaleString()}
          </b>
        </div>
      </div>

      {/* ⚙️ ДЕЙСТВИЯ */}
      <div style={{ marginTop: "20px" }}>
        <button style={btn}>Настройки</button>
        <button style={btn}>Поддержка</button>

        <button style={logout} onClick={onLogout}>
          Выйти из аккаунта
        </button>
      </div>

    </div>
  );
};

/* ===== СТИЛИ (ИСПРАВЛЕНЫ) ===== */

const container: React.CSSProperties = {
  padding: "20px",
  color: "white"
};

const profileCard: React.CSSProperties = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "16px",
  textAlign: "center"
};

const avatar: React.CSSProperties = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "#22c55e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "26px",
  margin: "0 auto"
};

const name: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: "600"
};

const email: React.CSSProperties = {
  fontSize: "12px",
  opacity: 0.6
};

const statsBox: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginTop: "15px"
};

const stat: React.CSSProperties = {
  flex: 1,
  background: "#1e293b",
  padding: "12px",
  borderRadius: "12px",
  textAlign: "center"
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#334155",
  color: "white"
};

const logout: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "none",
  background: "#ef4444",
  color: "white"
};