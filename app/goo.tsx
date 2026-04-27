{page==="home" && (
        
        <>
       <div className="grid grid-cols-2 gap-3 mt-4">

  <div className="bg-green-500 p-4 text-white rounded-xl">
  <h3>💰 Доход</h3>
  <p>
    Сегодня: {dayStats.income.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
  <p>
    Неделя: {weekStats.income.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
  <p>
    Месяц: {monthStats.income.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
  <p>
    Год: {yearStats.income.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
</div>

 <div className="bg-red-500 p-4 text-white rounded-xl">
  <h3>💸 Расход</h3>
  <p>
    Сегодня: {dayStats.expense.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
  <p>
    Неделя: {weekStats.expense.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
  <p>
    Месяц: {monthStats.expense.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
  <p>
    Год: {yearStats.expense.toLocaleString()} {currency === "USD" ? "$" : "сум"}
  </p>
</div>

</div>
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
  transactions={safeTransactions}
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