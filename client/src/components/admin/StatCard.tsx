import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  subtitle?: string;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm text-slate-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 text-sky-600">
          {icon}
        </div>

      </div>

      {trend && (
        <div className="mt-5 text-sm text-green-600 font-medium">
          {trend}
        </div>
      )}

    </div>
  );
}