export const Button = ({
  children,
  onClick,
  loading = false,
  variant = "primary",
  style = {},
}: any) => {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "16px",
        border: "none",
        background: loading
          ? "#2a2a3d"
          : isPrimary
          ? "linear-gradient(135deg,#00ffae,#00c896)"
          : "#2a2a3d",
        color: isPrimary ? "#000" : "#fff",
        fontWeight: "600",
        fontSize: "15px",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow:
          !loading && isPrimary
            ? "0 10px 30px rgba(0,255,174,0.35)"
            : "none",
        transition: "all 0.2s ease",
        ...style,
      }}
      onMouseDown={(e) => {
        if (!loading) e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        if (!loading) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {loading ? "⏳ Загрузка..." : children}
    </button>
  );
};