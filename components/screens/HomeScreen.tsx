"use client";

import { useState, useMemo } from "react";

import {
  calculateBalance,
  getDayStats,
  getCategoryStats
} from "@/utils/finance";

import { TransactionList } from "@/components/transactions/TransactionList";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { calculateDebtForecast } from "@/utils/forecast";
import { buildDebtPlan } from "@/utils/finance";
import { buildSmartStrategy } from "@/utils/finance";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export const HomeScreen = ({
  aiAdvice,
  loadingAI,
  transactions,
  addTransaction,
  deleteTransaction,
  updateTransaction
}: any) => {

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  console.log("HOME SCREEN TX:", safeTransactions);
  const forecast = calculateDebtForecast(transactions);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const plan = buildDebtPlan(transactions);
  const [visibleCount, setVisibleCount] = useState(50);
  const [expanded, setExpanded] = useState(false);
  const strategy = buildSmartStrategy(transactions);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<any | null>(null);

  const [planMode, setPlanMode] = useState<
  "minimum" |
  "balanced" |
  "aggressive"
>("balanced");

const [extraIncome, setExtraIncome] =
  useState("");

const selectedPlan =



  planMode === "minimum"

    ? {
        payment: plan.minimumPayment,

        months: Math.ceil(
          plan.totalDebt /
          plan.minimumPayment
        )
      }

    : planMode === "aggressive"

    ? {
        payment: plan.aggressivePayment,

        months: Math.ceil(
          plan.totalDebt /
          plan.aggressivePayment
        )
      }

    : {
        payment: plan.balancedPayment,

        months: Math.ceil(
          plan.totalDebt /
          plan.balancedPayment
        )
      };

      const improvedMonths = Math.ceil(

  plan.totalDebt /

  (
    selectedPlan.payment +
    Number(extraIncome || 0)
  )

);

const savedMonths =

  selectedPlan.months -
  improvedMonths;

  const filteredTransactions = safeTransactions.filter(
  (t: any) => {

    // ❌ скрываем долги
    if (t.type === "debt") {
      return false;
    }

    // ❌ скрываем погашение долгов
    if (t.type === "debt_payment") {
      return false;
    }

    // 🔍 поиск
    if (
      search &&
      !t.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false;
    }

    // 📂 фильтр
    if (
      filterType !== "all" &&
      t.type !== filterType
    ) {
      return false;
    }

    return true;
  }
);

  const balanceUZS = calculateBalance(safeTransactions, "UZS");
  const balanceUSD = calculateBalance(safeTransactions, "USD");

  const dayStats = getDayStats(safeTransactions);
  const categoryStats = getCategoryStats(safeTransactions);

  const totalExpense = Object.values(categoryStats).reduce(
    (a: any, b: any) => a + b,
    0
  );

  const dailyData = Object.values(
    safeTransactions.reduce((acc: any, item: any) => {
      if (item.type === "expense") {
        const date = new Date(item.date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit"
        });

        if (!acc[date]) acc[date] = { date, value: 0 };

        acc[date].value += Number(item.amount);
      }

      return acc;
    }, {})
  );

  const sortedCategories = Object.entries(categoryStats)
    .sort((a: any, b: any) => b[1] - a[1]);

  const top3 = sortedCategories.slice(0, 3);

  const smartAdvice = () => {
  const tips: string[] = [];

  if (dayStats.expense > dayStats.income) {
    tips.push("⚠️ Ты тратишь больше чем зарабатываешь");
  }

  if (top3.length > 0 && top3[0][0] === "Еда") {
    tips.push("🍔 Основные расходы на еду — попробуй сократить");
  }

  if (top3.length > 0 && top3[0][0] === "Транспорт") {
    tips.push("🚗 Много уходит на транспорт — оптимизируй поездки");
  }

  if (forecast?.months) {
    tips.push(`📉 Закроешь долг примерно за ${selectedPlan.months} мес.`);
  }

  if (tips.length === 0) {
    tips.push("✅ Финансы под контролем");
  }

  return tips;
};

  return (
    <div style={container}>
      <div style={balanceBox}>
        <div style={{ opacity: 0.7 }}>Общий баланс</div>
        <div style={big}>{balanceUZS.toLocaleString()} сум</div>
        <div style={{ opacity: 0.6 }}>
          {balanceUSD.toLocaleString()} $
        </div>
      </div>

      <div style={grid}>
        <div style={card}>📈 {dayStats.income}</div>
        <div style={card}>📉 {dayStats.expense}</div>
        <div style={card}>💰 {dayStats.balance}</div>
      </div>

      <input
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      <div style={filterRow}>
        {["all", "income", "expense"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "10px",
              border: "none",
              background:
                filterType === type
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : "#1e293b",
              color: "white"
            }}
          >
            {type === "all" && "Все"}
            {type === "income" && "Доход"}
            {type === "expense" && "Расход"}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>📊 Категории</h3>

        <div style={categoryRow}>
          {Object.entries(categoryStats).map(([name, value]: any, i) => {
            const percent = totalExpense
              ? Math.round((value / totalExpense) * 100)
              : 0;

            return (
              <div key={i} style={categoryCard}>
                <div>{getCategoryIcon(name)}</div>
                <div style={{ fontSize: "12px" }}>{name}</div>
                <div style={{ fontSize: "12px", opacity: 0.6 }}>
                  {percent}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

          <TransactionList
  transactions={filteredTransactions}
  expanded={expanded}
  setExpanded={setExpanded}
  onDelete={deleteTransaction}
        onEdit={(tx: any) => {
          setEditTx(tx);
          setIsModalOpen(true);
        }}
      />

      <div style={{ marginTop: "25px" }}>
        <h3>📈 Динамика расходов</h3>

        <div style={chartBox}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <XAxis dataKey="date" stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: "25px" }}>

  <div style={analysisCard}>

    {/* HEADER */}
    <div style={analysisHeader}>
      <div style={analysisTitle}>
        🧠 Smart AI Анализ
      </div>

      <div style={analysisBadge}>
        AI
      </div>
    </div>

    {/* SCORE */}
    <div style={scoreBox}>
      <div>
        <div style={scoreLabel}>
          Финансовое здоровье
        </div>

        <div style={scoreValue}>
          74%
        </div>
      </div>

      <div style={scoreEmoji}>
        📈
      </div>
    </div>

    {/* PLAN */}
    <div style={section}>
      <div style={sectionTitle}>
        💰 План погашения
      </div>

      <div style={{
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginBottom: "12px"
}}>

  <button
    onClick={() => setPlanMode("minimum")}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "none",
      background:
        planMode === "minimum"
          ? "#22c55e"
          : "#1e293b",
      color: "white"
    }}
  >
    💸 Минимальный
  </button>

  <button
    onClick={() => setPlanMode("balanced")}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "none",
      background:
        planMode === "balanced"
          ? "#22c55e"
          : "#1e293b",
      color: "white"
    }}
  >
    ⚖️ Сбалансированный
  </button>

  <button
    onClick={() => setPlanMode("aggressive")}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "none",
      background:
        planMode === "aggressive"
          ? "#22c55e"
          : "#1e293b",
      color: "white"
    }}
  >
    🚀 Агрессивный 
  </button>

</div>

<div style={sectionText}>

  Платёж:
  <br />

  <b>
    {selectedPlan.payment?.toLocaleString()} сум
  </b>

  <br />
  <br />

  Срок:
  <br />

  <b>
    ~ {selectedPlan.months} мес.
  </b>

</div>

      {plan.months && (
        <div style={greenText}>
          Платёжный план активен
        </div>
      )}
    </div>

    {/* STRATEGY */}
    <div style={section}>
      <div style={sectionTitle}>
        🚀 Как быстрее закрыть долги
      </div>

      <div style={tipCard}>

  💼 Доп. доход
  +{Number(extraIncome || 0).toLocaleString()}

  сократит срок на {

    Math.max(savedMonths,)

  } мес.

</div>
    </div>

<input
  type="number"
  placeholder="Доп. доход в месяц"

  value={extraIncome}

  onChange={(e) =>
  setExtraIncome(
    e.target.value
  )
}

  style={{
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#1e293b",
    color: "white"
  }}
/>
  
  </div>
  
</div>

      

      <button
        style={fab}
        onClick={() => {
          setEditTx(null);
          setIsModalOpen(true);
        }}
      >
        +
      </button>

      {isModalOpen && (
        <AddTransactionModal
          onAdd={addTransaction}
          onUpdate={updateTransaction}
          editTx={editTx}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

/* ✅ ВСЕ СТИЛИ С ТИПАМИ */

const container: React.CSSProperties = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "20px",
  paddingBottom: "100px",
  color: "white",
  minHeight: "100vh",
  background: "#020617",
  position: "relative"
};

const balanceBox: React.CSSProperties = {
  background: "linear-gradient(135deg,#0f172a,#22c55e)",
  padding: "20px",
  borderRadius: "20px",
  marginBottom: "15px"
};

const big: React.CSSProperties = { fontSize: "26px", fontWeight: "bold" };

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "10px"
};

const card: React.CSSProperties = {
  background: "#1e293b",
  padding: "10px",
  borderRadius: "10px"
};

const input: React.CSSProperties = {
  width: "100%",
  marginTop: "15px",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white"
};

const filterRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "10px"
};

const categoryRow: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  overflowX: "auto"
};

const categoryCard: React.CSSProperties = {
  minWidth: "80px",
  background: "#1e293b",
  padding: "10px",
  borderRadius: "10px",
  textAlign: "center"
};

const chartBox: React.CSSProperties = {
  background: "#0f172a",
  padding: "15px",
  borderRadius: "16px"
};

const adviceBox: React.CSSProperties = {
  background: "#1e293b",
  padding: "12px",
  borderRadius: "12px",
  marginTop: "10px"
};

const topRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "5px"
};

const fab: React.CSSProperties = {
  position: "fixed",

  left: "50%",
  transform: "translateX(140px)",

  bottom: "90px",

  width: "55px",
  height: "55px",

  borderRadius: "35%",
  background: "linear-gradient(135deg, #16a34a, #15803d)",

  color: "#2f2828",
  fontSize: "45px",
  border: "none",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxShadow: "0 8px 20px rgba(22,163,74,0.5)",
  cursor: "pointer",

  zIndex: 1000
};

const forecastBox: React.CSSProperties = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  marginTop: "10px"
};

const forecastText: React.CSSProperties = {
  marginTop: "8px",
  fontSize: "14px",
  opacity: 0.8
};

const forecastMonths: React.CSSProperties = {
  marginTop: "10px",
  fontSize: "13px",
  color: "#22c55e",
  fontWeight: "600"
};

const aiBox: React.CSSProperties = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  marginTop: "10px",
  whiteSpace: "pre-line"
};

const analysisCard: React.CSSProperties = {
  background: "linear-gradient(135deg,#0f172a,#111827)",
  borderRadius: "24px",
  padding: "18px",
  border: "1px solid rgba(255,255,255,0.05)"
};

const analysisHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const analysisTitle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700"
};

const analysisBadge: React.CSSProperties = {
  background: "#22c55e",
  color: "black",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700"
};

const scoreBox: React.CSSProperties = {
  marginTop: "20px",
  background: "#111827",
  padding: "18px",
  borderRadius: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const scoreLabel: React.CSSProperties = {
  opacity: 0.7,
  fontSize: "13px"
};

const scoreValue: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "800",
  marginTop: "5px"
};

const scoreEmoji: React.CSSProperties = {
  fontSize: "42px"
};

const section: React.CSSProperties = {
  marginTop: "20px"
};

const sectionTitle: React.CSSProperties = {
  fontWeight: "700",
  marginBottom: "10px"
};

const sectionText: React.CSSProperties = {
  background: "#1e293b",
  padding: "14px",
  borderRadius: "14px",
  lineHeight: "1.5"
};

const greenText: React.CSSProperties = {
  marginTop: "8px",
  color: "#22c55e",
  fontSize: "13px",
  fontWeight: "600"
};

const tipCard: React.CSSProperties = {
  marginTop: "10px",
  background: "#132a1c",
  color: "#86efac",
  padding: "14px",
  borderRadius: "14px",
  lineHeight: "1.4"
};

const adviceCard: React.CSSProperties = {
  marginTop: "10px",
  background: "#1e293b",
  padding: "14px",
  borderRadius: "14px",
  lineHeight: "1.4"
};

const getCategoryIcon = (name: string) => {
  const map: any = {
    "Еда": "🍔",
    "Транспорт": "🚗",
    "Развлечения": "🎮",
    "Здоровье": "🏥",
    "Покупки": "🛍",
    "Другое": "📦"
  };

  return map[name] || "📊";

  
};