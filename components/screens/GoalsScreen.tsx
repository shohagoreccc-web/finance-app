"use client";

export const GoalsScreen = ({
  goals,
  goalName,
  setGoalName,
  goalAmount,
  setGoalAmount,
  goalCurrency,
  setGoalCurrency,
  addGoal,
  addToGoal,
  safeTransactions,
  deleteGoal
}: any) => {

  // 🔥 защита от краша
  const safeTx = Array.isArray(safeTransactions) ? safeTransactions : [];
  const safeGoals = Array.isArray(goals) ? goals : [];

  return (
    <div style={container}>
      <h2 style={title}>🎯 Финансовые цели</h2>

      {/* ФОРМА */}
      <div style={card}>
        <input
          placeholder="Название цели"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Сумма"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          style={input}
        />

        <select
          value={goalCurrency}
          onChange={(e) => setGoalCurrency(e.target.value)}
          style={select}
        >
          <option value="USD">USD</option>
          <option value="UZS">UZS</option>
        </select>

        <button onClick={addGoal} style={btn}>
           Добавить цель
        </button>
      </div>

      {/* ЕСЛИ НЕТ ЦЕЛЕЙ */}
      {safeGoals.length === 0 && (
        <div style={empty}>Пока нет целей</div>
      )}

      {/* СПИСОК */}
      {safeGoals.map((g: any, i: number) => {

        const saved = safeTx
          .filter((t: any) => t.type === "goal" && t.goalId === g.id)
          .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

        const percent = Math.min((saved / g.amount) * 100, 100);
        const remaining = Math.max(g.amount - saved, 0);

        return (
          <div key={i} style={goalCard}>
            
            {/* ВЕРХ */}
            <div style={goalTop}>
              <div>
                <div style={goalNameText}>{g.name}</div>

                <div style={goalAmountText}>
                  {saved} / {g.amount} {g.currency}
                </div>

                <div style={remainingText}>
                  Осталось: {remaining} {g.currency}
                </div>
              </div>

              <button
                onClick={() => deleteGoal(g.id)}
                style={deleteBtn}
              >
                ✕
              </button>
            </div>

            {/* ПРОГРЕСС */}
            <div style={progressBg}>
              <div
                style={{
                  ...progressFill,
                  width: `${percent}%`
                }}
              />
            </div>

            <div style={percentText}>
              {Math.round(percent)}%
            </div>

            {/* 🔥 ПОПОЛНИТЬ */}
            <button
  onClick={() => addToGoal(g)}
  style={addMoneyBtn}

  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // 🔥 важно
>
  Пополнить
</button>

          </div>
        );
      })}
    </div>
  );
};

/* ===== СТИЛИ ===== */

const container: React.CSSProperties = {
  padding: "20px",
  color: "white"
};

const title: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700"
};

const card: React.CSSProperties = {
  background: "#0f172a",
  padding: "15px",
  borderRadius: "16px",
  marginTop: "15px"
};

const input: React.CSSProperties = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white"
};

const select: React.CSSProperties = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "10px",
  background: "#1e293b",
  color: "white",
  border: "none"
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #16a34a, #15803d)",
  color: "black",
  fontWeight: "600",
  cursor: "pointer"
};

const empty: React.CSSProperties = {
  marginTop: "20px",
  opacity: 0.6
};

const goalCard: React.CSSProperties = {
  background: "#020617",
  padding: "15px",
  borderRadius: "16px",
  marginTop: "15px"
};

const goalTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const goalNameText: React.CSSProperties = {
  fontWeight: "600"
};

const goalAmountText: React.CSSProperties = {
  fontSize: "12px",
  opacity: 0.6
};

const remainingText: React.CSSProperties = {
  fontSize: "12px",
  color: "#22c55e",
  marginTop: "3px"
};

const deleteBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#ef4444",
  fontSize: "18px",
  cursor: "pointer"
};

const progressBg: React.CSSProperties = {
  height: "6px",
  background: "#1e293b",
  borderRadius: "10px",
  marginTop: "10px",
  overflow: "hidden"
};

const progressFill: React.CSSProperties = {
  height: "100%",
  background: "#22c55e",
  borderRadius: "10px",
  transition: "0.3s"
};

const percentText: React.CSSProperties = {
  fontSize: "12px",
  marginTop: "5px",
  opacity: 0.7
};

const addMoneyBtn: React.CSSProperties = {
  marginTop: "10px",
  width: "100%",
  padding: "10px",

  background: "linear-gradient(135deg, #16a34a, #15803d)",
  color: "black",

  border: "none",
  borderRadius: "16px",

  fontWeight: "600",
  cursor: "pointer",

  boxShadow: "0 4px 12px rgba(22,163,74,0.4)",

  transition: "0.15s" // 🔥 ВОТ СЮДА
};