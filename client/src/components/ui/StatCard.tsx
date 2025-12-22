import { ReactNode } from "react";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={clsx(
      "bg-white rounded-2xl p-6 border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-muted-foreground font-medium text-sm">{title}</div>
        <div className="p-2 bg-primary/5 rounded-xl text-primary">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-display font-bold text-foreground tracking-tight">
          {value}
        </div>
        {trend && (
          <div className={clsx(
            "text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
