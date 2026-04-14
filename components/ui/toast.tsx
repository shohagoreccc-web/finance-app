export const Toast = ({ message, type }: any) => {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background:
        type === "error"
          ? "#ff4d6d"
          : "linear-gradient(135deg,#00ffae,#00c896)",
      color: "#000",
      padding: "12px 20px",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      zIndex: 9999,
      fontWeight: "600"
    }}>
      {message}
    </div>
  );
};