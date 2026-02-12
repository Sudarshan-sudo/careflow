import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  "Pending": { color: "bg-gradient-to-r from-red-50 to-rose-100 text-red-700 border-red-300", dot: "bg-red-500" },
  "Accepted": { color: "bg-gradient-to-r from-blue-50 to-cyan-100 text-blue-700 border-blue-300", dot: "bg-blue-500" },
  "In Progress": { color: "bg-gradient-to-r from-yellow-50 to-amber-100 text-yellow-800 border-yellow-300", dot: "bg-yellow-500" },
  "Processing": { color: "bg-gradient-to-r from-orange-50 to-amber-100 text-orange-700 border-orange-300", dot: "bg-orange-500" },
  "Dispensed": { color: "bg-gradient-to-r from-teal-50 to-cyan-100 text-teal-700 border-teal-300", dot: "bg-teal-500" },
  "Administered": { color: "bg-gradient-to-r from-indigo-50 to-violet-100 text-indigo-700 border-indigo-300", dot: "bg-indigo-500" },
  "Monitoring": { color: "bg-gradient-to-r from-purple-50 to-fuchsia-100 text-purple-700 border-purple-300", dot: "bg-purple-500" },
  "Completed": { color: "bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500" },
  "Cancelled": { color: "bg-gradient-to-r from-slate-50 to-gray-100 text-slate-500 border-slate-300", dot: "bg-slate-400" },
  // Patient statuses
  "Admitted": { color: "bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-800 border-blue-300", dot: "bg-blue-500" },
  "Under Diagnosis": { color: "bg-gradient-to-r from-yellow-50 to-orange-100 text-yellow-800 border-yellow-300", dot: "bg-yellow-500" },
  "Treatment Ongoing": { color: "bg-gradient-to-r from-orange-50 to-red-100 text-orange-800 border-orange-300", dot: "bg-orange-500" },
  "Discharged": { color: "bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-500" },
};

export default function StatusBadge({ status, size = "default" }) {
  const config = STATUS_CONFIG[status] || { color: "bg-slate-50 text-slate-600 border-slate-200", dot: "bg-slate-400" };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold border-2 gap-1.5 inline-flex items-center shadow-sm",
        config.color,
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
    >
      <span className={cn("rounded-full flex-shrink-0 animate-pulse", config.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {status}
    </Badge>
  );
}