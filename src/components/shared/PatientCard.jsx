import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import StatusBadge from "./StatusBadge";
import { User, Calendar, Droplets, Bed } from "lucide-react";

export default function PatientCard({ patient, compact = false }) {
  if (!patient) return null;

  return (
    <Link
      to={createPageUrl(`PatientDetail?id=${patient.id}`)}
      className="block group"
    >
      <div className={`
        bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 
        hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50
        transition-all duration-300 
        ${compact ? 'p-3' : 'p-5'}
      `}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
              {patient.full_name?.[0] || "P"}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {patient.full_name}
              </p>
              <p className="text-xs text-slate-400 font-mono">{patient.patient_id}</p>
            </div>
          </div>
          <StatusBadge status={patient.status} size="sm" />
        </div>

        {!compact && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <User className="w-3.5 h-3.5" />
              <span>{patient.age}y · {patient.gender}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Droplets className="w-3.5 h-3.5" />
              <span>{patient.blood_group || "N/A"}</span>
            </div>
            {patient.room_number && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Bed className="w-3.5 h-3.5" />
                <span>Room {patient.room_number}</span>
              </div>
            )}
            {patient.admission_date && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(patient.admission_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {!compact && patient.diagnosis && (
          <div className="mt-3 px-3 py-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Diagnosis</p>
            <p className="text-sm text-slate-800 font-medium truncate">{patient.diagnosis}</p>
          </div>
        )}
      </div>
    </Link>
  );
}