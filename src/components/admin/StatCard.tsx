interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  trend?: { value: number; label: string };
  icon: React.ReactNode;
  accent?: "violet" | "blue" | "emerald" | "amber";
}

const ACCENT = {
  violet: {
    gradient: "from-violet-500 to-indigo-500",
    shadow: "shadow-violet-200",
    ring: "ring-violet-100",
  },
  blue: {
    gradient: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-200",
    ring: "ring-blue-100",
  },
  emerald: {
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-200",
    ring: "ring-emerald-100",
  },
  amber: {
    gradient: "from-amber-500 to-orange-400",
    shadow: "shadow-amber-200",
    ring: "ring-amber-100",
  },
};

export default function StatCard({
  title,
  value,
  sub,
  trend,
  icon,
  accent = "violet",
}: StatCardProps) {
  const cfg = ACCENT[accent];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-soft-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-lg ${cfg.shadow} ring-4 ${cfg.ring}`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              trend.value >= 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            <svg
              className={`w-3 h-3 ${trend.value < 0 ? "rotate-180" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            </svg>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-[28px] font-black text-slate-900 tracking-tight leading-none">
        {value}
      </p>
      <p className="text-sm font-semibold text-slate-500 mt-2">{title}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
