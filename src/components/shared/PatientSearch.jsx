import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import StatusBadge from "./StatusBadge";

export default function PatientSearch({ onSelect, placeholder = "Search patients by name or ID..." }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: patients = [] } = useQuery({
    queryKey: ["patients-search"],
    queryFn: () => base44.entities.Patient.list("-created_date", 200),
  });

  const filtered = query.length > 0
    ? patients.filter(p =>
        p.full_name?.toLowerCase().includes(query.toLowerCase()) ||
        p.patient_id?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (patient) => {
    setQuery("");
    setOpen(false);
    if (onSelect) {
      onSelect(patient);
    } else {
      navigate(createPageUrl(`PatientDetail?id=${patient.id}`));
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm"
        />
      </div>

      {open && filtered.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-72 overflow-y-auto">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs flex-shrink-0">
                  {p.full_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.full_name}</p>
                  <p className="text-xs text-slate-400">{p.patient_id} · {p.age}y {p.gender}</p>
                </div>
                <StatusBadge status={p.status} size="sm" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}