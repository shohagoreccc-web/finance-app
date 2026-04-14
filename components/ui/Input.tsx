export const Input = ({
  value,
  onChange,
  placeholder
}: any) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #2a2a3d",
        background: "#1a1a2e",
        color: "#fff",
        marginTop: "8px",
        outline: "none",
        transition: "0.2s"
      }}
      onFocus={(e) => {
        e.target.style.border = "1px solid #00ffae";
        e.target.style.boxShadow = "0 0 0 2px rgba(0,255,174,0.2)";
      }}
      onBlur={(e) => {
        e.target.style.border = "1px solid #2a2a3d";
        e.target.style.boxShadow = "none";
      }}
    />
  );
};