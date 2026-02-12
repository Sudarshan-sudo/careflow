import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function ActionStatusSummary({ actions }) {
  const completed = actions.filter(a => a.status === "Completed" || a.status === "Dispensed" || a.status === "Administered").length;
  const inProgress = actions.filter(a => ["In Progress", "Processing", "Monitoring", "Accepted"].includes(a.status)).length;
  const pending = actions.filter(a => a.status === "Pending").length;

  const items = [
    { label: "Completed", count: completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Progress", count: inProgress, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Pending", count: pending, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(item => (
        <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
          <item.icon className={`w-5 h-5 mx-auto ${item.color}`} />
          <p className={`text-2xl font-bold mt-1 ${item.color}`}>{item.count}</p>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}