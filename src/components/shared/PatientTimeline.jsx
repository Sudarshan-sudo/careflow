import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "./StatusBadge";
import {
  Stethoscope, FlaskConical, Pill, HeartPulse, FileText,
  Activity, Clock, ChevronDown, AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

const EVENT_ICONS = {
  "Action Created": FileText,
  "Status Update": Activity,
  "Result Uploaded": FlaskConical,
  "Note Added": FileText,
  "Vitals Recorded": HeartPulse,
  "Patient Status Changed": AlertCircle,
};

const ROLE_COLORS = {
  Doctor: "bg-blue-100 text-blue-600",
  Nurse: "bg-emerald-100 text-emerald-600",
  Pharmacy: "bg-amber-100 text-amber-600",
  Diagnostics: "bg-purple-100 text-purple-600",
  Admin: "bg-slate-100 text-slate-600",
};

export default function PatientTimeline({ patientId, limit = 20 }) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["timeline", patientId],
    queryFn: () => base44.entities.TimelineEvent.filter({ patient_id: patientId }, "-created_date", limit),
    enabled: !!patientId,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Clock className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm font-medium">No timeline events yet</p>
        <p className="text-xs mt-1">Actions will appear here in real time</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200" />

      <div className="space-y-1">
        {events.map((event, idx) => {
          const Icon = EVENT_ICONS[event.event_type] || Activity;
          const roleColor = ROLE_COLORS[event.performed_by_role] || ROLE_COLORS.Admin;

          return (
            <div key={event.id} className="relative flex gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors group">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${roleColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-slate-800 leading-tight">{event.title}</p>
                {event.description && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{event.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                    {event.performed_by_role}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[10px] text-slate-400">
                    {moment(event.created_date).format("MMM DD, YYYY • h:mm A")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}