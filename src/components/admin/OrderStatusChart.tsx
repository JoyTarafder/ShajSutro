"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrderStatusChartProps {
  data: { _id: string; count: number }[];
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending:   { color: "#f59e0b", label: "Pending" },
  confirmed: { color: "#7c3aed", label: "Confirmed" },
  shipped:   { color: "#3b82f6", label: "Shipped" },
  delivered: { color: "#10b981", label: "Delivered" },
  cancelled: { color: "#ef4444", label: "Cancelled" },
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-soft-md px-3.5 py-2.5">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: payload[0].payload.color }} />
          <p className="text-xs font-semibold capitalize text-slate-700">{payload[0].name}</p>
        </div>
        <p className="text-sm font-black text-slate-900">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
};

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data.map((d) => ({
    name: STATUS_CONFIG[d._id]?.label ?? d._id,
    value: d.count,
    color: STATUS_CONFIG[d._id]?.color ?? "#6b7280",
    status: d._id,
  }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No order data yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900">{total}</span>
          <span className="text-[11px] font-semibold text-slate-400 -mt-0.5">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {chartData.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-[11px] font-medium text-slate-500 capitalize truncate">
              {item.name}
            </span>
            <span className="text-[11px] font-bold text-slate-700 ml-auto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
