export const Navbar = ({ page, setPage }: any) => {
  return (
    <div style={{
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  background: "#1e1e2f",
  display: "flex",
  justifyContent: "space-around",
  padding: "12px 0",
  zIndex: 9999 // 🔥 добавь это
}}>

      <button onClick={()=>setPage("home")}
        style={{ color: page==="home" ? "#00ffae" : "#aaa" }}>
        🏠
      </button>

      <button onClick={()=>setPage("chat")}
        style={{ color: page==="chat" ? "#00ffae" : "#aaa" }}>
        💬
      </button>

      <button onClick={()=>setPage("goals")}
        style={{ color: page==="goals" ? "#00ffae" : "#aaa" }}>
        🎯
      </button>

      <button onClick={()=>setPage("debts")}
        style={{ color: page==="debts" ? "#00ffae" : "#aaa" }}>
        💸
      </button>

    </div>
  );
};