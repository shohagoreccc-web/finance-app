"use client";

import { useState } from "react";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { db } from "../lib/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { auth } from "../lib/firebase";
import { serverTimestamp } from "firebase/firestore";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { useGoals } from "@/hooks/useGoals";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { fetchAIAdvice } from "@/services/ai";
import { Navbar } from "@/components/Navbar";
import { getDebts } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut
} from "firebase/auth";
import { Toast } from "@/components/ui/toast";




export default function Home() {
  
  const [page, setPage] = useState("home");
  const COLORS = ["#00ffae", "#ff4d6d", "#ffd166", "#4dabf7"];
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [currency, setCurrency] = useState("UZS");
  const { user, loading } = useAuth();
  console.log("USER:", user);
  console.log("LOADING:", loading);
  const { transactions } = useTransactions(user);
  console.log("transactions:", transactions);
  const safeTransactions = transactions || [];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [chartCurrency, setChartCurrency] = useState("UZS");
  const [visibleCount, setVisibleCount] = useState(4);
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
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
  const categoryIcons: any = {
  food: "🍔",
  transport: "🚗",
  entertainment: "🎮",
  other: "📦",
  investment: "📈",
  business: "💼",
  health: "🏥"
  
};

  
async function addTransaction() {
  if (!amount || Number(amount) <= 0) {
    alert("Введите норм сумму");
    return;
  }

  if (!user) return;

  setLoadingBtn(true);

  try {
    const newTx = {
      userId: user.uid,
      type,
      amount: Number(amount),
      category,
      currency,
      date: new Date(),
      createdAt: serverTimestamp(),
      
    };

    // ✅ сначала сохраняем в Firebase
    await addDoc(collection(db, "transactions"), newTx);


    setAmount("");
    
  } catch (e) {
    setToast({ message: "Ошибка при добавлении", type: "error" });
setTimeout(() => setToast(null), 2000);
  }

  setLoadingBtn(false);
}

async function deleteGoal(id: string) {
  if (!confirm("Удалить цель?")) return;

  await deleteDoc(doc(db, "goals", id));
}
async function updateTransaction() {
  if (!editTx) return;

  try {
    await updateDoc(doc(db, "transactions", editTx.id), {
      amount: Number(editTx.amount),
      category: editTx.category,
      type: editTx.type,
    });

    setEditTx(null); // закрываем окно
  } catch (e) {
    alert("Ошибка обновления");
  }
}
 async function deleteTransaction(t: any) {
  try {
    await deleteDoc(doc(db, "transactions", t.id));
  } catch (e) {
    alert("Ошибка удаления");
  }
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

if (loading) console.log("loading...");
if (!user) console.log("no user");

  const balanceUZS = safeTransactions
  .filter(t => t.currency === "UZS")
  .reduce((sum, t) => {
  if (t.type === "income") return sum + t.amount;
  if (t.type === "expense") return sum - t.amount;
  return sum; // 💣 игнорим goal, debt и т.д.
}, 0);

const balanceUSD = safeTransactions
  .filter(t => t.currency === "USD")
  .reduce((sum, t) => {
  if (t.type === "income") return sum + t.amount;
  if (t.type === "expense") return sum - t.amount;
  return sum; // 💣 игнорим goal, debt и т.д.
}, 0);


  const getAIAdvice = async () => {
  setLoadingAI(true);

  try {
    const { totalDebt, totalLoan } = getDebts(transactions);

    const debts: any = {
  totalDebt,
  totalLoan
};

    const answer = await fetchAIAdvice(
      "Проанализируй мои финансы",
      transactions,
      debts,
      goals
    );

    setAiAdvice(answer);
  } catch (e) {
    console.error(e);
    setAiAdvice("Ошибка AI");
  }

  setLoadingAI(false);
};

  const sendMessage = async () => {
  if (!input) return;

  const userMessage = { role: "user", content: input };
  setMessages(prev => [...prev, userMessage]);

  setInput("");

  try {
    const { totalDebt, totalLoan } = getDebts(transactions);

    const debts: any = {
      totalDebt,
      totalLoan
    };

    const answer = await fetchAIAdvice(
      input,
      transactions,
      debts,
      goals
    );

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: answer }
    ]);

  } catch (e) {
    console.error("AI error", e);
  }
};

  const totalExpense = safeTransactions
  .filter(t => t.type === "expense")
  .reduce((s, t) => s + t.amount, 0);

const chartData = Object.values(
  safeTransactions.reduce((acc: any, item: any) => {
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
  safeTransactions.reduce((acc: any, item: any) => {
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
  safeTransactions.reduce((acc: any, item: any) => {

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
      maxWidth:"400px",
      margin:"100px auto",
      padding:"20px",
      background:"#1e1e2f",
      borderRadius:"16px",
      color:"white",
      textAlign:"center"
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
          width:"100%",
          marginTop:"10px",
          padding:"12px",
          background: authLoading ? "#555" : "#00ffae",
          border:"none",
          borderRadius:"10px"
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

  return (
    <>
  <div style={{
    maxWidth:"400px",
    margin:"40px auto",
    padding:"20px",
    paddingBottom:"80px",
    borderRadius:"20px",
    position:"relative",

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
    

  
      {/* HOME */}
      {page === "debts" && (
      <Button
  onClick={async () => {
    await signOut(auth);
  }}
>
  Выйти
</Button>
)}
      {page==="home" && (
        <>
        <div>
  👤 {user ? user.email : "не авторизован"}
</div>
          <div
  style={{
    background: "linear-gradient(135deg,#1dd1a1,#10ac84)",
    padding: "20px",
    borderRadius: "22px",
    color: "#000",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    position: "relative",
    overflow: "hidden",
    transition: "0.3s"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.02)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>

  {/* 🔥 световой эффект */}
  <div
    style={{
      position: "absolute",
      top: "-60px",
      right: "-60px",
      width: "180px",
      height: "180px",
      background: "rgba(255,255,255,0.25)",
      borderRadius: "50%",
      filter: "blur(50px)"
    }}
  />

  <h3 style={{ opacity: 0.7, marginBottom: "5px" }}>Баланс</h3>

  <div
    style={{
      fontSize: "30px",
      fontWeight: "bold",
      marginTop: "5px"
    }}
  >
    💰 {balanceUZS} сум
  </div>

  <div
    style={{
      fontSize: "18px",
      opacity: 0.8,
      marginBottom: "10px"
    }}
  >
    💵 ${balanceUSD}
  </div>

  {/* кнопка */}
  <Button onClick={getAIAdvice} loading={loadingAI}>
    🤖 Получить совет
  </Button>

  {loadingAI && <p style={{ marginTop: "8px" }}>🤖 Думаю...</p>}
  {aiAdvice && (
    <p style={{ marginTop: "8px", fontSize: "14px" }}>
      {aiAdvice}
    </p>
  )}

</div>

          <div style={{marginTop:"10px"}}>
            {stats.balance < 0 ? "⚠️ Ты в минусе" : "✅ Всё ок"}
          </div>

            <TransactionForm
  type={type}
  setType={setType}
  category={category}
  setCategory={setCategory}
  currency={currency}
  setCurrency={setCurrency}
  amount={amount}
  setAmount={setAmount}
  addTransaction={addTransaction}
  loadingBtn={loadingBtn}
/>
          <div style={{marginTop:"10px"}}>
            <input
  placeholder="Поиск..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
  style={{
    width:"100%",
    padding:"10px",
    borderRadius:"10px",
    border:"none",
    marginBottom:"10px"
  }}
/>
            <TransactionList
  transactions={transactions}
  filterType={filterType}
  search={search}
  visibleCount={visibleCount}
  setVisibleCount={setVisibleCount}
  setSelectedTx={setSelectedTx}
  setEditTx={setEditTx}
  deleteTransaction={deleteTransaction}
  categoryIcons={categoryIcons}
  setFilterType={setFilterType}
/>
  {visibleCount > 4 && (
  <Button
    variant="secondary"
    onClick={() => setVisibleCount(4)}
    style={{ padding: "8px", fontSize: "13px" }}
  >
    Свернуть
  </Button>
)}
          </div>
          <div style={{
  marginTop:"15px",
  background:"#1e1e2f",
  padding:"15px",
  borderRadius:"16px"
}}>
  <h4 style={{marginBottom:"10px"}}>📊 Аналитика</h4>
  <div style={{
  background:"#2a2a3d",
  padding:"10px",
  borderRadius:"10px",
  marginBottom:"10px"
}}>
  💡 {smartAdvice()}
</div>

<div style={{marginBottom:"10px"}}>
  <b>🔥 Топ расходы:</b>

  {top3.map((c:any, i:number)=>(
    <div key={i} style={{
      display:"flex",
      justifyContent:"space-between",
      marginTop:"5px"
    }}>
      <span>{i+1}. {c.name}</span>
      <span>{c.percent}%</span>
    </div>
  ))}
</div>
<div style={{
  display: "flex",
  gap: "10px",
  marginBottom: "10px"
}}>
  <button
    onClick={()=>setChartCurrency("UZS")}
    style={{
      padding:"5px 10px",
      borderRadius:"8px",
      border:"none",
      background: chartCurrency === "UZS" ? "#00ffae" : "#2a2a3d",
      color: chartCurrency === "UZS" ? "#000" : "#fff",
      cursor:"pointer"
    }}
  >
    UZS
  </button>

  <button
    onClick={()=>setChartCurrency("USD")}
    style={{
      padding:"5px 10px",
      borderRadius:"8px",
      border:"none",
      background: chartCurrency === "USD" ? "#00ffae" : "#2a2a3d",
      color: chartCurrency === "USD" ? "#000" : "#fff",
      cursor:"pointer"
    }}
  >
    USD
  </button>
</div>

  <div style={{display:"flex", justifyContent:"center"}}>
  <PieChart width={340} height={300}>
    <Pie
  data={chartData}
  dataKey="value"
  nameKey="name"
>
  {chartData.map((entry, index) => (
    <Cell key={index} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie>
    <Tooltip
  formatter={(value, name) => [`${value} сум`, name]}
/>
  </PieChart>
    </div>
</div>
        </>
      )}

      {/* CHAT */}
      {page==="chat" && (
        <>
          <h2>💬 Финансовый AI</h2>

          {messages.map((m,i)=>(
            <div key={i} style={{marginTop:"5px"}}>
              {m.content}
            </div>
          ))}

          <input value={input} onChange={(e)=>setInput(e.target.value)} style={{width:"100%",marginTop:"10px"}}/>
          <Button onClick={sendMessage}>
  Отправить
</Button>
        </>
      )}

      {/* ANALYTICS */}
      
      {/* GOALS */}
      {page==="goals" && (
  <>
    <h2>🎯 Мои цели</h2>

    <div style={{
      background:"#1e1e2f",
      padding:"15px",
      borderRadius:"15px",
      marginTop:"10px"
    }}>
      <input
        placeholder="Моя цель"
        value={goalName}
        onChange={(e)=>setGoalName(e.target.value)}
        style={{width:"100%",marginBottom:"5px"}}
      />

      <input
        placeholder="Сумма цели"
        value={goalAmount}
        onChange={(e)=>setGoalAmount(e.target.value)}
        style={{width:"100%",marginBottom:"5px"}}
      />
<select
  value={goalCurrency}
  onChange={(e)=>setGoalCurrency(e.target.value)}
  style={{
    width: "100%",
    marginBottom: "5px",
    padding: "10px",
    borderRadius: "8px",
    background: "#2a2a3d",
    color: "#fff",
    border: "none"
  }}
>
  <option value="USD" style={{color:"#000"}}>USD</option>
  <option value="UZS" style={{color:"#000"}}>UZS</option>
</select>

      <Button onClick={addGoal}>
  ➕ Добавить цель
</Button>
{toast && <Toast message={toast.message} type={toast.type} />}
    </div>

    {goals.map((g, i) => {

  const saved = safeTransactions
    .filter(t => t.type === "goal" && t.goalId === g.id)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const remaining = Math.max(g.amount - saved, 0);
  const percent = Math.min((saved / g.amount) * 100, 100);

  const handleAddToGoal = async (g: any) => {
    const value = prompt("Сколько добавить?");
    if (!value) return;

    const amount = Number(value);

    if (isNaN(amount) || amount <= 0) {
      setToast({ message: "Введите корректную сумму", type: "error" });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    try {
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "goal",
        amount: amount,
        category: "goal",
        goalName: g.name,
        goalId: g.id, // 🔥 ВАЖНО
        currency: g.currency,
        date: new Date(),
        createdAt: serverTimestamp()
      });
    } catch (e) {
      alert("Ошибка при пополнении");
    }
  };

  return (
    <div key={i} style={{
      background:"#1e1e2f",
      padding:"15px",
      borderRadius:"15px",
      marginTop:"10px"
    }}>

      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}>
        <div style={{fontWeight:"bold"}}>
          {g.name}
        </div>

        <button
          onClick={() => deleteGoal(g.id)}
          style={{
            background:"none",
            border:"none",
            color:"#ff4d6d",
            fontSize:"16px",
            cursor:"pointer"
          }}
        >
          ❌
        </button>
      </div>

      <button
        onClick={() => {
          const newName = prompt("Новое название", g.name);
          const newAmount = prompt("Новая сумма", g.amount);

          if (!newName || !newAmount) return;
        }}
        style={{
          background:"none",
          border:"none",
          color:"#4dabf7",
          fontSize:"14px",
          cursor:"pointer"
        }}
      >
        ✏️
      </button>

      {/* 🔥 ВОТ ГЛАВНОЕ */}
      <div style={{ fontSize:"12px", opacity:0.6 }}>
        Осталось: {remaining} из {g.amount} {g.currency === "USD" ? "$" : "сум"}
      </div>

      <div style={{
        height:"8px",
        background:"#333",
        borderRadius:"10px",
        marginTop:"5px"
      }}>
        <div style={{
          width:`${percent}%`,
          height:"100%",
          background:"#00ffae",
          borderRadius:"10px"
        }}/>
      </div>

      <Button onClick={() => handleAddToGoal(g)}>
        ➕ Пополнить
      </Button>

    </div>
  );
})}
</>
)}
      {/* DEBTS */}
      {page==="debts" && (
        <>
          <div>Ты должен: {totalDebt}</div>
          <div>Тебе должны: {totalLoan}</div>
        </>
      )}
      {selectedTx && (
  <div style={{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.6)",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    zIndex:2000
  }}>
    <div style={{
      background:"#1e1e2f",
      padding:"20px",
      borderRadius:"16px",
      width:"90%",
      maxWidth:"350px"
    }}>
      
      <h3>Транзакция</h3>

      <p>Категория: {selectedTx.category}</p>
      <p>Тип: {selectedTx.type}</p>
      <p>
        Сумма: 
        {selectedTx.currency === "USD" ? "$" : ""}
        {selectedTx.amount}
        {selectedTx.currency === "UZS" ? " сум" : ""}
      </p>

      <p>
  Дата: {
    selectedTx.date?.seconds
      ? new Date(selectedTx.date.seconds * 1000).toLocaleString()
      : new Date(selectedTx.date).toLocaleString()
  }
</p>

      <button
        onClick={()=>setSelectedTx(null)}
        style={{
          marginTop:"10px",
          width:"100%",
          padding:"10px",
          borderRadius:"10px",
          background:"#00ffae",
          border:"none"
        }}
      >
        Закрыть
      </button>
    </div>
  </div>
)}
      {/* NAV */}
<EditTransactionModal
  editTx={editTx}
  setEditTx={setEditTx}
  updateTransaction={updateTransaction}
/>

{user && (
  <Navbar page={page} setPage={setPage} />
)}

</div>
  </>
);
}