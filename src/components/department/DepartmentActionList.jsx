import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "../shared/StatusBadge";
import ActionUpdateDialog from "./ActionUpdateDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Clock, User, FileText } from "lucide-react";
import moment from "moment";

export default function DepartmentActionList({
  department,
  departmentRole,
  actionTypes,
  statusOptions,
  icon: DeptIcon,
  iconColor,
  iconBg,
  title,
  subtitle,
}) {
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAction, setSelectedAction] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: actions = [], isLoading } = useQuery({
    queryKey: [`${department}-actions`],
    queryFn: () => base44.entities.ClinicalAction.filter({ assigned_department: department }, "-created_date", 100),
    refetchInterval: 5000,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients-lookup"],
    queryFn: () => base44.entities.Patient.list("-created_date", 200),
  });

  const patientMap = {};
  patients.forEach(p => { patientMap[p.id] = p; });

  const filtered = statusFilter === "all"
    ? actions
    : actions.filter(a => a.status === statusFilter);

  const statusCounts = {
    all: actions.length,
    Pending: actions.filter(a => a.status === "Pending").length,
  };
  statusOptions.forEach(s => {
    if (s !== "Pending") statusCounts[s] = actions.filter(a => a.status === s).length;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <DeptIcon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-slate-100 h-10 flex-wrap">
          {Object.entries(statusCounts).map(([key, count]) => (
            <TabsTrigger key={key} value={key} className="text-xs data-[state=active]:bg-white">
              {key === "all" ? "All" : key} ({count})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No actions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(action => {
            const patient = patientMap[action.patient_id];
            return (
              <div key={action.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-slate-800">{action.title}</p>
                      <StatusBadge status={action.status} size="sm" />
                      {action.priority === "Urgent" && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">URGENT</span>
                      )}
                      {action.priority === "High" && (
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">HIGH</span>
                      )}
                    </div>
                    {patient && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <User className="w-3 h-3" />
                        <span className="font-medium">{patient.full_name}</span>
                        <span className="text-slate-300">·</span>
                        <span>{patient.patient_id}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{moment(action.created_date).format("MMM DD, YYYY • h:mm A")}</span>
                      {action.ordered_by && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span>by {action.ordered_by}</span>
                        </>
                      )}
                    </div>
                    {action.description && (
                      <p className="text-sm text-slate-600 mt-2">{action.description}</p>
                    )}
                    {action.medications?.length > 0 && (
                      <div className="mt-2 bg-slate-50 rounded-lg p-2.5 space-y-1">
                        {action.medications.map((med, i) => (
                          <p key={i} className="text-xs text-slate-600">
                            <span className="font-medium">{med.name}</span> – {med.dosage}, {med.frequency}{med.duration ? `, ${med.duration}` : ""}
                          </p>
                        ))}
                      </div>
                    )}
                    {action.test_type && (
                      <p className="text-xs text-purple-600 mt-1.5 bg-purple-50 inline-block px-2 py-0.5 rounded-md">Test: {action.test_type}</p>
                    )}
                    {action.test_result && (
                      <div className="mt-2 bg-purple-50 rounded-lg p-2.5 text-xs text-purple-700">
                        <p className="font-medium">Result:</p>
                        <p>{action.test_result}</p>
                      </div>
                    )}
                    {action.department_notes && (
                      <div className="mt-2 bg-blue-50 rounded-lg p-2.5 text-xs text-blue-700">
                        <p className="font-medium">Notes:</p>
                        <p>{action.department_notes}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSelectedAction(action); setDialogOpen(true); }}
                    className="flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Update
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ActionUpdateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={selectedAction}
        statusOptions={statusOptions}
        departmentRole={departmentRole}
        user={user}
      />
    </div>
  );
}