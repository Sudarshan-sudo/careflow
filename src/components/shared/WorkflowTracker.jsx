import React from "react";
import { Stethoscope, FlaskConical, Pill, HeartPulse, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "Doctor", label: "Doctor", icon: Stethoscope },
  { key: "Diagnostics", label: "Diagnostics", icon: FlaskConical },
  { key: "Pharmacy", label: "Pharmacy", icon: Pill },
  { key: "Nursing", label: "Nursing", icon: HeartPulse },
  { key: "Completed", label: "Complete", icon: CheckCircle2 },
];

function getStep(action) {
  if (action.status === "Completed" || action.status === "Administered") return 4;
  if (action.assigned_department === "Nursing" && action.status !== "Pending") return 3;
  if (action.assigned_department === "Pharmacy" && action.status !== "Pending") return 2;
  if (action.assigned_department === "Diagnostics" && action.status !== "Pending") return 1;
  return 0;
}

export default function WorkflowTracker({ action }) {
  const currentStep = getStep(action);

  return (
    <div className="flex items-center gap-1 w-full">
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep;
        const isComplete = idx < currentStep;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                isComplete ? "bg-emerald-500 text-white" :
                isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-200" :
                "bg-slate-100 text-slate-400"
              )}>
                <step.icon className="w-3.5 h-3.5" />
              </div>
              <span className={cn(
                "text-[9px] font-medium tracking-wide",
                isComplete ? "text-emerald-600" :
                isActive ? "text-blue-600" :
                "text-slate-400"
              )}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 rounded-full -mt-4",
                idx < currentStep ? "bg-emerald-400" : "bg-slate-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}