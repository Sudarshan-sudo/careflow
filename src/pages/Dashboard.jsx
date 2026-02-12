import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import PatientSearch from "../components/shared/PatientSearch";
import StatusBadge from "../components/shared/StatusBadge";
import {
  Users, Activity, AlertCircle, CheckCircle2, Clock,
  TrendingUp, ArrowRight, Stethoscope, FlaskConical, Pill, HeartPulse
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: patients = [], isLoading: pLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-created_date", 100),
  });

  const { data: actions = [], isLoading: aLoading } = useQuery({
    queryKey: ["actions-all"],
    queryFn: () => base44.entities.ClinicalAction.list("-created_date", 100),
  });

  const { data: recentEvents = [] } = useQuery({
    queryKey: ["recent-events"],
    queryFn: () => base44.entities.TimelineEvent.list("-created_date", 10),
  });

  const department = user?.department || "Admin";

  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      lightBg: "bg-gradient-to-br from-blue-50 to-indigo-100",
    },
    {
      label: "Pending Actions",
      value: actions.filter(a => a.status === "Pending").length,
      icon: AlertCircle,
      color: "from-red-400 via-rose-500 to-pink-600",
      lightBg: "bg-gradient-to-br from-red-50 to-rose-100",
    },
    {
      label: "In Progress",
      value: actions.filter(a => ["In Progress", "Processing", "Monitoring", "Accepted"].includes(a.status)).length,
      icon: Clock,
      color: "from-amber-400 via-orange-500 to-red-500",
      lightBg: "bg-gradient-to-br from-amber-50 to-orange-100",
    },
    {
      label: "Completed Today",
      value: actions.filter(a =>
        (a.status === "Completed" || a.status === "Dispensed" || a.status === "Administered") &&
        moment(a.updated_date).isSame(moment(), "day")
      ).length,
      icon: CheckCircle2,
      color: "from-emerald-400 via-teal-500 to-green-600",
      lightBg: "bg-gradient-to-br from-emerald-50 to-teal-100",
    },
  ];

  const pendingByDept = {
    Doctor: actions.filter(a => a.assigned_department === "Doctor" && a.status === "Pending").length,
    Diagnostics: actions.filter(a => a.assigned_department === "Diagnostics" && a.status === "Pending").length,
    Pharmacy: actions.filter(a => a.assigned_department === "Pharmacy" && a.status === "Pending").length,
    Nursing: actions.filter(a => a.assigned_department === "Nursing" && a.status === "Pending").length,
  };

  const deptConfig = [
    { key: "Doctor", icon: Stethoscope, page: "DoctorPanel", color: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-blue-100" },
    { key: "Diagnostics", icon: FlaskConical, page: "DiagnosticsPanel", color: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-fuchsia-100" },
    { key: "Pharmacy", icon: Pill, page: "PharmacyPanel", color: "text-amber-600", bg: "bg-gradient-to-br from-amber-50 to-orange-100" },
    { key: "Nursing", icon: HeartPulse, page: "NursingPanel", color: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-teal-100" },
  ];

  const isLoading = pLoading || aLoading;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400 font-medium">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            {user?.full_name || "Staff"} <span className="text-slate-300 font-normal">/ {department}</span>
          </h1>
        </div>
        <div className="w-full md:w-80">
          <PatientSearch />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-indigo-300 transition-all overflow-hidden">
            <CardContent className="p-5 relative">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${stat.lightBg} -translate-y-8 translate-x-8 opacity-40`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg relative z-10`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stat.value}</p>
              )}
              <p className="text-xs text-slate-600 font-semibold mt-1 uppercase tracking-wide">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Queue */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Department Queues</h2>
          <div className="space-y-3">
            {deptConfig.map(d => (
              <Link key={d.key} to={createPageUrl(d.page)}>
                <div className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:shadow-xl hover:border-indigo-300 transition-all flex items-center gap-4 group">
                  <div className={`w-12 h-12 rounded-xl ${d.bg} flex items-center justify-center shadow-md`}>
                    <d.icon className={`w-6 h-6 ${d.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{d.key}</p>
                    <p className="text-xs text-slate-500 font-medium">{pendingByDept[d.key]} pending actions</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg divide-y divide-slate-100 overflow-hidden">
            {recentEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              recentEvents.map(event => {
                const roleColors = {
                  Doctor: "bg-blue-100 text-blue-600",
                  Nurse: "bg-emerald-100 text-emerald-600",
                  Pharmacy: "bg-amber-100 text-amber-600",
                  Diagnostics: "bg-purple-100 text-purple-600",
                  Admin: "bg-slate-100 text-slate-600",
                };
                const rc = roleColors[event.performed_by_role] || roleColors.Admin;
                return (
                  <div key={event.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${rc} flex items-center justify-center flex-shrink-0`}>
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{event.title}</p>
                      <p className="text-xs text-slate-400">{event.performed_by_role} · {moment(event.created_date).format("MMM DD, YYYY • h:mm A")}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}