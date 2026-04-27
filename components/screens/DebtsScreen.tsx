"use client";

export const DebtsScreen = ({ transactions }: any) => {
  const debts = (transactions || []).filter(
    (t: any) => t.type === "debt"
  );

  const total = debts.reduce(
    (s: number, t: any) => s + Number(t.amount),
    0
  );

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>💸 Долги</h2>

      <div style={{
        background: "#1e293b",
        padding: "15px",
        borderRadius: "12px",
        marginTop: "10px"
      }}>
        Общий долг: {total.toLocaleString()}
      </div>

      <div style={{ marginTop: "15px" }}>
        {debts.map((t: any) => (
          <div key={t.id} style={card}>
            <div>{t.title}</div>
            <div style={{ color: "#ef4444" }}>
              -{t.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const card = {
  background: "#0f172a",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between"
};