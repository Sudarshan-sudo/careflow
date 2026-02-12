import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "../components/shared/StatusBadge";
import PatientTimeline from "../components/shared/PatientTimeline";
import ActionStatusSummary from "../components/shared/ActionStatusSummary";
import WorkflowTracker from "../components/shared/WorkflowTracker";
import {
  ArrowLeft, User, Calendar, Droplets, Bed, Stethoscope,
  FileText, FlaskConical, Pill, HeartPulse, Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

const ACTION_ICONS = {
  Prescription: Pill,
  "Diagnostic Test": FlaskConical,
  Referral: FileText,
  "Care Instruction": HeartPulse,
};

export default function PatientDetail() {
  const params = new URLSearchParams(window.location.search);
  const patientId = params.get("id");

  const { data: patients = [], isLoading: pLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => base44.entities.Patient.filter({ id: patientId }),
    enabled: !!patientId,
  });
  const patient = patients[0];

  const { data: actions = [], isLoading: aLoading } = useQuery({
    queryKey: ["patient-actions", patientId],
    queryFn: () => base44.entities.ClinicalAction.filter({ patient_id: patientId }, "-created_date", 100),
    enabled: !!patientId,
    refetchInterval: 5000,
  });

  if (pLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-lg font-medium">Patient not found</p>
        <Link to={createPageUrl("Patients")} className="text-blue-500 text-sm mt-2 inline-block">← Back to patients</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Back */}
      <Link to={createPageUrl("Patients")} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 rounded-2xl border-2 border-indigo-200 shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-xl">
            {patient.full_name?.[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{patient.full_name}</h1>
              <StatusBadge status={patient.status} />
            </div>
            <p className="text-sm text-slate-400 font-mono mt-1">{patient.patient_id}</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <InfoPill icon={User} text={`${patient.age}y · ${patient.gender}`} />
              <InfoPill icon={Droplets} text={patient.blood_group || "N/A"} />
              {patient.room_number && <InfoPill icon={Bed} text={`Room ${patient.room_number}`} />}
              {patient.attending_doctor && <InfoPill icon={Stethoscope} text={patient.attending_doctor} />}
              {patient.admission_date && <InfoPill icon={Calendar} text={moment(patient.admission_date).format("MMM D, YYYY")} />}
            </div>
          </div>
        </div>
        {patient.diagnosis && (
          <div className="mt-4 px-4 py-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">Primary Diagnosis</p>
            <p className="text-sm text-slate-800 font-medium mt-0.5">{patient.diagnosis}</p>
          </div>
        )}
      </div>

      {/* Status Summary */}
      <ActionStatusSummary actions={actions} />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Care Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              <div className="p-3">
                <PatientTimeline patientId={patientId} limit={50} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Clinical Actions</h2>
          {actions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No clinical actions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map(action => {
                const Icon = ACTION_ICONS[action.action_type] || FileText;
                return (
                  <div key={action.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-800 text-sm">{action.title}</p>
                          <StatusBadge status={action.status} size="sm" />
                          {action.priority === "Urgent" && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">URGENT</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {action.action_type} · {action.assigned_department} · {moment(action.created_date).fromNow()}
                        </p>
                      </div>
                    </div>
                    {action.description && (
                      <p className="text-sm text-slate-600 mb-3 pl-12">{action.description}</p>
                    )}
                    {action.medications?.length > 0 && (
                      <div className="pl-12 mb-3">
                        <div className="bg-slate-50 rounded-lg p-3 space-y-1.5">
                          {action.medications.map((med, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                              <Pill className="w-3 h-3 text-amber-500" />
                              <span className="font-medium">{med.name}</span>
                              <span className="text-slate-400">– {med.dosage}, {med.frequency}{med.duration ? `, ${med.duration}` : ""}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {action.test_result && (
                      <div className="pl-12 mb-3 px-3 py-2 bg-purple-50 rounded-lg text-xs text-purple-700">
                        <p className="font-medium">Test Result:</p>
                        <p className="mt-0.5">{action.test_result}</p>
                      </div>
                    )}
                    {action.department_notes && (
                      <div className="pl-12 mb-3 px-3 py-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                        <p className="font-medium">Department Notes:</p>
                        <p className="mt-0.5">{action.department_notes}</p>
                      </div>
                    )}
                    <div className="pl-12">
                      <WorkflowTracker action={action} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <Icon className="w-3.5 h-3.5" />
      <span>{text}</span>
    </div>
  );
}