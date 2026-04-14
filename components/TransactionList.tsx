export const TransactionList = ({
  transactions,
  filterType,
  setFilterType,
  search,
  visibleCount,
  setVisibleCount,
  setSelectedTx,
  setEditTx,
  deleteTransaction,
  categoryIcons
}: any) => {

  const safeTransactions = transactions || [];

  return (
    <div style={{ marginTop: "10px" }}>

      {/* 🔥 ФИЛЬТР */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        {["all", "income", "expense"].map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: filterType === f ? "#00ffae" : "#2a2a3d",
              color: filterType === f ? "#000" : "#fff"
            }}
          >
            {f === "all" ? "Все" : f === "income" ? "Доход" : "Расход"}
          </button>
        ))}
      </div>

      {/* 🔥 СПИСОК */}
      {safeTransactions
        .filter((t: any) => 
          t.type !== "goal" &&
          (filterType === "all" || t.type === filterType) &&
          t.category.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, visibleCount)
        .map((t: any, index: number)=> (   // 💣 добавили index
          <div
            key={t.id}
            onClick={() => setSelectedTx(t)}
            style={{
              cursor: "pointer",
              background: "#1e1e2f",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",

              // 🔥 АНИМАЦИЯ
              opacity: 0,
              transform: "translateY(10px)",
              animation: "fadeInUp 0.3s ease forwards",
              animationDelay: `${index * 0.05}s`
            }}

            // 🔥 hover эффект
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >

            {/* Левая часть */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div>{categoryIcons[t.category] || "📦"}</div>
              <div>{t.category}</div>
            </div>

            {/* ✏️ РЕДАКТИРОВАТЬ */}
            <button
              onClick={(e)=>{
                e.stopPropagation();
                setEditTx(t);
              }}
              style={{
                background:"none",
                border:"none",
                color:"#4dabf7",
                cursor:"pointer",
                marginRight:"5px"
              }}
            >
              ✏️
            </button>

            {/* Сумма */}
            <div style={{
              fontWeight: "bold",
              color: t.type === "expense" ? "#ff4d6d" : "#00ffae"
            }}>
              {t.type === "expense" ? "-" : "+"}
              {t.currency === "USD" ? "$" : ""}
              {t.amount}
              {t.currency === "UZS" ? " сум" : ""}
            </div>

            {/* ❌ УДАЛИТЬ */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Удалить транзакцию?")) {
                  deleteTransaction(t);
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: "#ff4d6d",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              ❌
            </button>

          </div>
        ))}

      {/* 🔥 ПОКАЗАТЬ ЕЩЁ */}
      {safeTransactions.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((prev: number) => prev + 4)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            borderRadius: "10px",
            background: "#2a2a3d",
            color: "#fff",
            border: "none"
          }}
        >
          Показать ещё
        </button>
      )}
    </div>
  );
};