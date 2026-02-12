import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PatientCard from "../components/shared/PatientCard";
import PatientSearch from "../components/shared/PatientSearch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Patients() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-created_date", 200),
  });

  const filtered = statusFilter === "all"
    ? patients
    : patients.filter(p => p.status === statusFilter);

  const statusCounts = {
    all: patients.length,
    Admitted: patients.filter(p => p.status === "Admitted").length,
    "Under Diagnosis": patients.filter(p => p.status === "Under Diagnosis").length,
    "Treatment Ongoing": patients.filter(p => p.status === "Treatment Ongoing").length,
    Discharged: patients.filter(p => p.status === "Discharged").length,
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-400 mt-0.5">{patients.length} total patients</p>
        </div>
        <div className="w-full md:w-80">
          <PatientSearch />
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-slate-100 h-10">
          {Object.entries(statusCounts).map(([key, count]) => (
            <TabsTrigger key={key} value={key} className="text-xs data-[state=active]:bg-white">
              {key === "all" ? "All" : key} ({count})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No patients found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
    </div>
  );
}