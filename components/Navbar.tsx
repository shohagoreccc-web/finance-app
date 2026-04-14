export const Navbar = ({ page, setPage }: any) => {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      margin: "0 auto",
      width: "100%",
      maxWidth: "400px",
      display: "flex",
      justifyContent: "space-around",
      padding: "12px 0",
      background: "#1e1e2f",
      borderTop: "1px solid #333",
      borderRadius: "16px 16px 0 0",
      boxShadow: "0 -5px 20px rgba(0,0,0,0.5)",
      zIndex: 1000
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