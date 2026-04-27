"use client";

export const BottomNav = ({ page, setPage }: any) => {
  const items = [
    { key: "home", icon: HomeIcon, label: "Главная" },
    { key: "chat", icon: ChatIcon, label: "AI" },
    { key: "debts", icon: EyeIcon, label: "Долги" },
    { key: "goals", icon: TargetIcon, label: "Цели" },
    { key: "profile", icon: UserIcon, label: "Профиль" }
  ];

  return (
    <div style={nav}>
      {items.map((item) => {
        const active = page === item.key;
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            onClick={() => setPage(item.key)}
            style={itemStyle}
          >
            <Icon active={active} />
            <div
              style={{
                fontSize: "11px",
                marginTop: "2px",
                color: active ? "#22c55e" : "#64748b",
                fontWeight: active ? "600" : "400"
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ✅ СТИЛИ С ТИПАМИ */

const nav: React.CSSProperties = {
  position: "fixed",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",

  width: "calc(100% - 20px)",
  maxWidth: "420px",

  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",

  padding: "10px 0",

  background: "rgba(2,6,23,0.9)",
  backdropFilter: "blur(20px)",

  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.05)",

  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",

  zIndex: 9999
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  flex: 1
};

const iconStyle = (active: boolean): React.CSSProperties => ({
  width: "22px",
  height: "22px",
  stroke: active ? "#22c55e" : "#64748b",
  strokeWidth: 2,
  fill: "none",
  transition: "0.2s",
  filter: active ? "drop-shadow(0 0 6px rgba(34,197,94,0.6))" : "none"
});

/* ===== SVG ИКОНКИ ===== */

const HomeIcon = ({ active }: any) => (
  <svg viewBox="0 0 24 24" style={iconStyle(active)}>
    <path d="M3 10L12 3L21 10V21H3V10Z" />
  </svg>
);

const ChatIcon = ({ active }: any) => (
  <svg viewBox="0 0 24 24" style={iconStyle(active)}>
    <path d="M4 4H20V16H6L4 18V4Z" />
  </svg>
);

const EyeIcon = ({ active }: any) => (
  <svg viewBox="0 0 24 24" style={iconStyle(active)}>
    <path d="M2 12C5 6 19 6 22 12C19 18 5 18 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const TargetIcon = ({ active }: any) => (
  <svg viewBox="0 0 24 24" style={iconStyle(active)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const UserIcon = ({ active }: any) => (
  <svg viewBox="0 0 24 24" style={iconStyle(active)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" />
  </svg>
);