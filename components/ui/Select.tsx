export const Select = ({
  value,
  onChange,
  options
}: any) => {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #2a2a3d",
        background: "#1a1a2e",
        color: "#fff",
        marginTop: "8px",
        outline: "none",
        cursor: "pointer"
      }}
    >
      {options.map((o:any, i:number)=>(
        <option key={i} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};