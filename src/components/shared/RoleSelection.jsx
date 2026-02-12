import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Activity, Stethoscope, FlaskConical, Pill, HeartPulse, ShieldCheck } from "lucide-react";

const ROLES = [
  { 
    value: "Doctor", 
    icon: Stethoscope, 
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
    description: "Create prescriptions, order tests, manage patient care"
  },
  { 
    value: "Nurse", 
    icon: HeartPulse, 
    gradient: "from-emerald-500 via-teal-600 to-green-700",
    description: "Monitor vitals, administer care, update patient status"
  },
  { 
    value: "Pharmacy", 
    icon: Pill, 
    gradient: "from-orange-500 via-amber-600 to-yellow-600",
    description: "Dispense medications, manage prescriptions"
  },
  { 
    value: "Diagnostics", 
    icon: FlaskConical, 
    gradient: "from-purple-500 via-violet-600 to-fuchsia-700",
    description: "Process tests, upload results, manage lab workflow"
  },
  { 
    value: "Admin", 
    icon: ShieldCheck, 
    gradient: "from-slate-600 via-gray-700 to-slate-800",
    description: "Full system access, manage patients and users"
  },
];

export default function RoleSelection({ user, onRoleSelected }) {
  const [saving, setSaving] = useState(false);

  const handleSelectRole = async (role) => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ department: role });
      onRoleSelected();
    } catch (error) {
      console.error("Failed to set role:", error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white shadow-2xl flex items-center justify-center">
            <Activity className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to CareFlow</h1>
          <p className="text-white/80 text-lg">Select your role to continue</p>
          {user?.email && (
            <p className="text-white/60 text-sm mt-2">Logged in as {user.email}</p>
          )}
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.value}
                onClick={() => handleSelectRole(role.value)}
                disabled={saving}
                className={`
                  group relative bg-white rounded-2xl p-6 text-left
                  hover:shadow-2xl hover:scale-105 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  border-2 border-transparent hover:border-white/50
                `}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{role.value}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{role.description}</p>
                
                {/* Hover effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              </button>
            );
          })}
        </div>

        <p className="text-center text-white/50 text-xs mt-8">
          You can change your role anytime from the Admin Panel
        </p>
      </div>
    </div>
  );
}