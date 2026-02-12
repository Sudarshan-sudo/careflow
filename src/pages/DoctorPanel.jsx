import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PatientSearch from "../components/shared/PatientSearch";
import StatusBadge from "../components/shared/StatusBadge";
import CreateActionDialog from "../components/doctor/CreateActionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Stethoscope, FileText, FlaskConical, Pill, HeartPulse } from "lucide-react";
import moment from "moment";

const ACTION_ICONS = {
  Prescription: Pill,
  "Diagnostic Test": FlaskConical,
  Referral: FileText,
  "Care Instruction": HeartPulse,
};

export default function DoctorPanel() {
  const [user, setUser] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: actions = [] } = useQuery({
    queryKey: ["doctor-actions", selectedPatient?.id],
    queryFn: () => base44.entities.ClinicalAction.filter({ patient_id: selectedPatient.id }, "-created_date", 50),
    enabled: !!selectedPatient,
    refetchInterval: 5000,
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center shadow-md">
          <Stethoscope className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Panel</h1>
          <p className="text-sm text-slate-400">Create prescriptions, orders, and referrals</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Select Patient</label>
          <PatientSearch onSelect={setSelectedPatient} placeholder="Search patient to manage..." />
        </div>
        {selectedPatient && (
          <div className="flex items-end">
            <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg h-11">
              <Plus className="w-5 h-5 mr-2" /> New Clinical Action
            </Button>
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 shadow-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {selectedPatient.full_name?.[0]}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{selectedPatient.full_name}</p>
              <p className="text-xs text-slate-400">{selectedPatient.patient_id} · {selectedPatient.diagnosis}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={selectedPatient.status} />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-700 mb-3">Actions ({actions.length})</h3>
          {actions.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No actions yet. Create one above.</p>
          ) : (
            <div className="space-y-2">
              {actions.map(action => {
                const Icon = ACTION_ICONS[action.action_type] || FileText;
                return (
                  <div key={action.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{action.title}</p>
                      <p className="text-xs text-slate-400">{action.action_type} · {action.assigned_department} · {moment(action.created_date).fromNow()}</p>
                    </div>
                    <StatusBadge status={action.status} size="sm" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedPatient && (
        <CreateActionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          patient={selectedPatient}
          user={user}
        />
      )}
    </div>
  );
}