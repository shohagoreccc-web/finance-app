"use client";

import { useState, useMemo } from "react";

import {
  calculateBalance,
  getDayStats,
  getCategoryStats
} from "@/utils/finance";

import { TransactionList } from "@/components/transactions/TransactionList";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export const HomeScreen = ({
  transactions,
  addTransaction,
  deleteTransaction,
  updateTransaction
}: any) => {

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [visibleCount, setVisibleCount] = useState(6);
  const [expanded, setExpanded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<any | null>(null);

  const filteredTransactions = useMemo(() => {
    return safeTransactions.filter((t: any) => {
      if (t.type === "debt") return false;
      if (filterType !== "all" && t.type !== filterType) return false;
      if (search && !t.title?.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [safeTransactions, search, filterType]);

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
    if (dayStats.expense > dayStats.income) {
      return "⚠️ Ты тратишь больше чем зарабатываешь";
    }

    if (top3.length > 0 && top3[0][0] === "Еда") {
      return "🍔 Основные расходы на еду — попробуй сократить";
    }

    if (top3.length > 0 && top3[0][0] === "Транспорт") {
      return "🚗 Много уходит на транспорт — оптимизируй поездки";
    }

    return "✅ Финансы под контролем";
  };

  return (
    <div style={container}>
      <div style={balanceBox}>
        <div style={{ opacity: 0.7 }}>Общий баланс</div>
        <div style={big}>{balanceUZS.toLocaleString()} сум</div>
        <div style={{ opacity: 0.6 }}>
          ${balanceUSD.toLocaleString()}
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

      <div style={{ marginTop: "20px" }}>
        <h3>🧠 Анализ</h3>

        <div style={adviceBox}>
          {smartAdvice()}
        </div>

        <div style={{ marginTop: "10px" }}>
          {top3.map((c: any, i: number) => (
            <div key={i} style={topRow}>
              <span>{c[0]}</span>
              <span>{c[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <TransactionList
        transactions={filteredTransactions}
        visibleCount={visibleCount}
        setVisibleCount={setVisibleCount}
        expanded={expanded}
        setExpanded={setExpanded}
        onDelete={deleteTransaction}
        onEdit={(tx: any) => {
          setEditTx(tx);
          setIsModalOpen(true);
        }}
      />

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
  background: "#020617"
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
  bottom: "80px",
  right: "20px",
  width: "65px",
  height: "65px",
  borderRadius: "50%",
  background: "#7c3aed",
  color: "#fff",
  fontSize: "32px",
  border: "none"
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