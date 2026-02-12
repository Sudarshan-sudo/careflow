import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "@/api/base44Client";
import {
  Activity, Users, Stethoscope, FlaskConical, Pill, HeartPulse,
  ShieldCheck, ChevronLeft, ChevronRight, LogOut, Menu, X, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/shared/LoadingScreen";
import RoleSelection from "@/components/shared/RoleSelection";

const NAV_ITEMS = [
  { name: "Dashboard", page: "Dashboard", icon: Activity, roles: ["Doctor", "Nurse", "Pharmacy", "Diagnostics", "Admin"] },
  { name: "Patients", page: "Patients", icon: Users, roles: ["Doctor", "Nurse", "Pharmacy", "Diagnostics", "Admin"] },
  { name: "Doctor Panel", page: "DoctorPanel", icon: Stethoscope, roles: ["Doctor", "Admin"] },
  { name: "Diagnostics", page: "DiagnosticsPanel", icon: FlaskConical, roles: ["Diagnostics", "Admin"] },
  { name: "Pharmacy", page: "PharmacyPanel", icon: Pill, roles: ["Pharmacy", "Admin"] },
  { name: "Nursing", page: "NursingPanel", icon: HeartPulse, roles: ["Nurse", "Admin"] },
  { name: "Admin", page: "AdminPanel", icon: ShieldCheck, roles: ["Admin"] },
];

const ROLE_COLORS = {
  Doctor: "from-cyan-500 via-blue-600 to-indigo-700",
  Nurse: "from-emerald-500 via-teal-600 to-green-700",
  Pharmacy: "from-orange-500 via-amber-600 to-yellow-600",
  Diagnostics: "from-purple-500 via-violet-600 to-fuchsia-700",
  Admin: "from-slate-600 via-gray-700 to-slate-800",
};

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  useEffect(() => {
    base44.auth.me().then((userData) => {
      setUser(userData);
      if (!userData.department) {
        setNeedsRoleSelection(true);
      }
    }).catch(() => {}).finally(() => {
      setTimeout(() => setLoading(false), 1500);
    });
  }, []);

  const handleRoleSelected = () => {
    setNeedsRoleSelection(false);
    window.location.reload();
  };

  const department = user?.department || "Admin";
  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(department));
  const gradientClass = ROLE_COLORS[department] || ROLE_COLORS.Admin;

  if (loading) return <LoadingScreen />;
  if (needsRoleSelection) return <RoleSelection user={user} onRoleSelected={handleRoleSelected} />;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 overflow-hidden">
      <style>{`
        :root {
          --sidebar-width: ${collapsed ? '72px' : '260px'};
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-full flex flex-col
        bg-gradient-to-b ${gradientClass} text-white
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-white/20 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold tracking-tight truncate text-white drop-shadow-md">CareFlow</h1>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Clinical Hub</p>
            </div>
          )}
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="mx-4 mt-4 mb-2 px-3 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Active Role</p>
            <p className="text-sm font-bold text-white">{department}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {visibleNav.map(item => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-white/20 text-white shadow-lg shadow-black/10'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!collapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {!collapsed && user && (
            <div className="px-3 py-2">
              <p className="text-xs text-white/50 truncate">{user.email}</p>
              <p className="text-sm font-medium truncate">{user.full_name || 'Staff'}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => base44.auth.logout()}
            className={`w-full text-white/70 hover:text-white hover:bg-white/10 ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2 text-sm">Sign Out</span>}
          </Button>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md items-center justify-center text-slate-600 hover:text-slate-900 transition"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${department === 'Doctor' ? 'bg-cyan-500 shadow-cyan-300' : department === 'Nurse' ? 'bg-emerald-500 shadow-emerald-300' : department === 'Pharmacy' ? 'bg-amber-500 shadow-amber-300' : department === 'Diagnostics' ? 'bg-purple-500 shadow-purple-300' : 'bg-slate-500 shadow-slate-300'}`} />
            <span className="font-bold text-slate-800">{department}</span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}