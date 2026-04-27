"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#eab308", "#a855f7"];

export const CategoryChart = ({ data }: any) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  if (chartData.length === 0) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>📊 Расходы по категориям</h3>

      <PieChart width={300} height={250}>
        <Pie
          data={chartData}
          dataKey="value"
          outerRadius={80}
          label
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};