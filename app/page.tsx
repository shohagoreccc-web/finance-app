"use client";

import { EditTransactionModal } from "@/components/modals/EditTransactionModal"; 
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { ChatScreen } from "@/components/screens/ChatScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { GoalsScreen } from "@/components/screens/GoalsScreen";
import { AuthScreen } from "@/components/screens/AuthScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { Toast } from "@/components/ui/toast";
import { BottomNav } from "@/components/ui/BottomNav";
import { DebtsScreen } from "@/components/screens/DebtsScreen";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { collection, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { auth } from "../lib/firebase";
import { serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useGoals } from "@/hooks/useGoals";
import { useFinance } from "@/hooks/useFinance";
import { askAI } from "@/services/ai";

import { addTransactionService } from "@/services/transactions";
import { deleteTransactionService } from "@/services/transactions";
import { getDebts } from "@/utils/calculations";
import { filterByPeriod, getStats } from "@/lib/stats";
import { useMemo } from "react";
import { updateTransactionService } from "@/services/transactions";
import { calculateBalance, getDayStats } from "@/utils/finance";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut
} from "firebase/auth";





export default function Home() {
  const [pressed, setPressed] = useState(false);
  const [page, setPage] = useState("home");
  const {
  transactions,
  addTransaction,
  deleteTransaction,
  updateTransaction
} = useFinance();

  const COLORS = ["#00ffae", "#ff4d6d", "#ffd166", "#4dabf7"];

  const { user, loading } = useAuth();
  useEffect(() => {
  if (!user) return;

  const checkProfile = async () => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
  };

  checkProfile();
}, [user]);
  // ✅ ПОТОМ расчёты (ВАЖНО!)
  const dayStats = getStats(filterByPeriod(transactions, "day"));
  const weekStats = getStats(filterByPeriod(transactions, "week"));
  const monthStats = getStats(filterByPeriod(transactions, "month"));
  const yearStats = getStats(filterByPeriod(transactions, "year"));
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const sendMessage = async (customText?: string) => {
  const textToSend = customText || input;
  if (!textToSend) return;

  const userMsg = { role: "user", text: textToSend };

  const newMessages = [...messages, userMsg];

  setMessages(newMessages);
  setInput("");

  const res = await askAI(transactions, textToSend, newMessages);

  const aiMsg = { role: "assistant", text: res };

  setMessages([...newMessages, aiMsg]);
};
  const [chartCurrency, setChartCurrency] = useState("UZS");
  const [visibleCount, setVisibleCount] = useState(4);

  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  useEffect(() => {
  if (!transactions || transactions.length === 0) return;

  const runAI = async () => {
    setLoadingAI(true);

    const answer = await askAI(
      transactions,
      "Проанализируй мои финансы и дай советы",
      messages
    );

    setAiAdvice(answer);
    setLoadingAI(false);
  };

  runAI();
}, [transactions]);

  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [filterType, setFilterType] = useState("all");

  const { goals } = useGoals(user);

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  const [search, setSearch] = useState("");
  const [goalCurrency, setGoalCurrency] = useState("USD");

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [editTx, setEditTx] = useState<any>(null);
  const [toast, setToast] = useState<any>(null);
  async function handleUpdateTransaction() {
  if (!editTx) return;

  await updateTransactionService(editTx);
  setEditTx(null);
}

  const categoryIcons: any = {
    food: "🍔",
    transport: "🚗",
    entertainment: "🎮",
    other: "📦",
    investment: "📈",
    business: "💼",
    health: "🏥"
  };

async function deleteGoal(id: string) {
  if (!confirm("Удалить цель?")) return;

  await deleteDoc(doc(db, "goals", id));
}
  const stats = useMemo(() => {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    if (t.type === "income") income += Number(t.amount);
    if (t.type === "expense") expense += Number(t.amount);
  }

  return {
    income,
    expense,
    balance: income - expense
  };
}, [transactions]);

const balanceUZS = calculateBalance(transactions, "UZS");
const balanceUSD = calculateBalance(transactions, "USD");

  const getAIAdvice = async () => {
  setLoadingAI(true);

  try {
    const { totalDebt, totalLoan } = getDebts(transactions);

    const debts: any = {
  totalDebt,
  totalLoan
};

    const answer = await askAI(
  transactions,
  "Дай совет по финансам",
  messages
);

    setAiAdvice(answer);
  } catch (e) {
    console.error(e);
    setAiAdvice("Ошибка AI");
  }

  setLoadingAI(false);
};

  const totalExpense = transactions
  .filter(t => t.type === "expense")
  .reduce((s, t) => s + t.amount, 0);

const chartData = Object.values(
  transactions.reduce((acc: any, item: any) => {
    if (item.type === "expense" && item.currency === chartCurrency) {
      if (!acc[item.category]) {
        acc[item.category] = {
          name: item.category,
          value: 0,
        };
      }
      acc[item.category].value += item.amount;
    }
    return acc;
  }, {})
).map((item: any) =>  ({
  ...item,
  percent: totalExpense
    ? ((item.value / totalExpense) * 100).toFixed(1)
    : 0,
}));
const top3 = [...chartData]
  .sort((a:any, b:any) => b.value - a.value)
  .slice(0, 3);

const smartAdvice = () => {
  if (stats.expense > stats.income) {
    return "⚠️ Ты тратишь больше чем зарабатываешь";
  }

  if (top3.length > 0 && top3[0].name === "food") {
    return "🍔 Основные расходы на еду — попробуй сократить";
  }

  if (top3.length > 0 && top3[0].name === "transport") {
    return "🚗 Много уходит на транспорт — оптимизируй поездки";
  }

  return "✅ Финансы под контролем";
};

const dailyData = Object.values(
  transactions.reduce((acc: any, item: any) => {
    if (item.type === "expense") {

      const rawDate = item.date?.seconds
        ? new Date(item.date.seconds * 1000)
        : new Date(item.date);

      const date = rawDate.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit"
      });

      if (!acc[date]) {
        acc[date] = { date, value: 0 };
      }

      acc[date].value += item.amount;
    }

    return acc;
  }, {})
);

const dailyCompare = Object.values(
  transactions.reduce((acc: any, item: any) => {

    const rawDate = item.date?.seconds
      ? new Date(item.date.seconds * 1000)
      : new Date(item.date);

    const date = rawDate.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit"
    });

    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }

    if (item.type === "income") {
      acc[date].income += item.amount;
    }

    if (item.type === "expense") {
      acc[date].expense += item.amount;
    }

    return acc;
  }, {})
);

  const { totalDebt, totalLoan } = getDebts(transactions);

  // ✅ сначала loading
if (loading) {
  return (
    <div style={{
      color: "white",
      textAlign: "center",
      marginTop: "100px"
    }}>
      ⏳ Загрузка...
    </div>
  );
}

// ✅ потом проверка пользователя
if (!user) {
  return (
   <div style={{
  width: "100%",
  maxWidth: page === "home" ? "400px" : "100%", // 🔥 ВОТ КЛЮЧ
  margin: "0 auto",
  padding: "20px",
  paddingBottom: "90px",
  borderRadius: "20px",
  position: "relative",

  background: `
    radial-gradient(circle at 20% 20%, rgba(0,255,174,0.15), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(77,171,247,0.15), transparent 40%),
    linear-gradient(180deg,#0f0f1a,#1a1a2e)
  `,

  backdropFilter: "blur(20px)",
  color:"white",
  fontFamily:"sans-serif",
  minHeight:"100vh"
}}>
      <h2>Вход</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={{width:"100%",marginTop:"10px",padding:"10px"}}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        style={{width:"100%",marginTop:"10px",padding:"10px"}}
      />

      <button
  onMouseDown={() => setPressed(true)}
  onMouseUp={() => setPressed(false)}
  onMouseLeave={() => setPressed(false)}

  onClick={async () => {
    if (!email || !email.includes("@")) {
      alert("Введи норм email");
      return;
    }

    if (password.length < 6) {
      alert("Пароль минимум 6 символов");
      return;
    }

    setAuthLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAuthLoading(false);
    }
  }}

  disabled={authLoading}

  style={{
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    background: authLoading ? "#555" : "#00ffae",
    border: "none",
    borderRadius: "10px",
    transition: "0.1s",
    transform: pressed ? "scale(0.95)" : "scale(1)"
  }}
>
  {authLoading ? "⏳ Входим..." : "Войти"}
</button>

      <button
        onClick={async () => {
          if (!email || !email.includes("@")) {
            alert("Введи норм email");
            return;
          }

          if (password.length < 6) {
            alert("Пароль минимум 6 символов");
            return;
          }

          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (e: any) {
            alert(e.message);
          }
        }}
        style={{
          width:"100%",
          marginTop:"10px",
          padding:"12px",
          background:"#4dabf7",
          border:"none",
          borderRadius:"10px"
        }}
      >
        Регистрация
      </button>
    </div>
  );
}
// ⏳ ждём проверку профиля
if (user && hasProfile === null) {
  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      Загрузка профиля...
    </div>
  );
}

// ❗ если нет анкеты → показываем онбординг
if (user && hasProfile === false) {
  return (
    <OnboardingScreen
      user={user}
      onFinish={() => setHasProfile(true)}
    />
  );
}
// ⏳ Ждём проверку профиля
if (user && hasProfile === null) {
  return <div style={{color:"white", textAlign:"center"}}>Загрузка профиля...</div>;
}

// ❗ НЕТ АНКЕТЫ → показываем онбординг
if (user && hasProfile === false) {
  return (
    <OnboardingScreen
      user={user}
      onFinish={() => setHasProfile(true)}
    />
  );
}
const addGoal = async () => {
  if (!goalName || !goalAmount) return;

  await addDoc(collection(db, "goals"), {
    userId: user.uid,
    name: goalName,
    amount: Number(goalAmount),
    currency: goalCurrency,
    createdAt: new Date()
  });

  setGoalName("");
  setGoalAmount("");
};
const appWrapper = {
  minHeight: "100vh",
  background: "#0f0f1a",
  display: "flex",
  justifyContent: "center"
};

const container = {
  width: "100%",
  maxWidth: "420px", // 🔥 фикс ширины как в моб приложениях
  margin: "0 auto",
  padding: "16px",
  paddingBottom: "100px"
};

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalCard = {
  background: "#1a1a2e",
  padding: "20px",
  borderRadius: "15px",
  color: "white"
};

const closeBtn = {
  marginTop: "10px",
  padding: "10px",
  width: "100%"
};
  return (
  <div style={appWrapper}>

    <div style={container}>

      {/* HOME */}
      {page === "home" && (
        <HomeScreen
          transactions={transactions}
          addTransaction={addTransaction}
          deleteTransaction={deleteTransaction}
          updateTransaction={updateTransaction}
          aiAdvice={aiAdvice}
          loadingAI={loadingAI}
        />
      )}

      {/* CHAT */}
      {page === "chat" && (
        <ChatScreen
  messages={messages}
  input={input}
  setInput={setInput}
  sendMessage={sendMessage}
/>
      )}

      {/* GOALS */}
      {page === "goals" && (
        <GoalsScreen
          goals={goals}
          goalName={goalName}
          setGoalName={setGoalName}
          goalAmount={goalAmount}
          setGoalAmount={setGoalAmount}
          goalCurrency={goalCurrency}
          setGoalCurrency={setGoalCurrency}
          addGoal={addGoal}
          transactions={transactions}
          user={user}
          deleteGoal={deleteGoal}
        />
      )}

      {/* DEBTS */}
      {page === "debts" && (
        <DebtsScreen transactions={transactions} />
      )}

      {/* PROFILE */}
      {page === "profile" && (
        <ProfileScreen
          user={user}
          transactions={transactions}
          onLogout={async () => {
            await signOut(auth);
          }}
        />
      )}

    </div>

    {/* МОДАЛКИ */}
    <EditTransactionModal
      editTx={editTx}
      setEditTx={setEditTx}
      updateTransaction={updateTransaction}
    />

    {isModalOpen && (
      <AddTransactionModal
        onClose={() => setIsModalOpen(false)}
        onAdd={async (data: any) => {
          await addTransactionService(user, {
            amount: data.amount,
            type: data.type,
            title: data.title,
            category: data.category,
            currency: (data.currency || "UZS").toUpperCase()
          });
        }}
      />
    )}

    {/* ПРОСМОТР ТРАНЗАКЦИИ */}
    {selectedTx && (
      <div style={overlay}>
        <div style={modalCard}>
          <h3>Транзакция</h3>

          <p><b>Описание:</b> {selectedTx.title || "—"}</p>
          <p>Категория: {selectedTx.category}</p>
          <p>Тип: {selectedTx.type}</p>

          <p>
            Сумма:
            {selectedTx.currency === "USD" ? "$" : ""}
            {selectedTx.amount}
            {selectedTx.currency === "UZS" ? " сум" : ""}
          </p>

          <p>
            Дата:
            {selectedTx.date?.seconds
              ? new Date(selectedTx.date.seconds * 1000).toLocaleString()
              : new Date(selectedTx.date).toLocaleString()}
          </p>

          <button onClick={() => setSelectedTx(null)} style={closeBtn}>
            Закрыть
          </button>
        </div>
      </div>
    )}

    {/* НОВОЕ МЕНЮ */}
    <BottomNav page={page} setPage={setPage} />

  </div>
  );
}