import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  ShieldCheck, Plus, Users, Loader2, Settings, UserPlus
} from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-created_date", 200),
  });

  const [form, setForm] = useState({
    full_name: "", patient_id: "", age: "", gender: "Male", blood_group: "O+",
    diagnosis: "", status: "Admitted", room_number: "", attending_doctor: "",
    admission_date: new Date().toISOString().split("T")[0], notes: ""
  });

  const createPatient = useMutation({
    mutationFn: (data) => base44.entities.Patient.create({ ...data, age: Number(data.age) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setDialogOpen(false);
      setForm({
        full_name: "", patient_id: "", age: "", gender: "Male", blood_group: "O+",
        diagnosis: "", status: "Admitted", room_number: "", attending_doctor: "",
        admission_date: new Date().toISOString().split("T")[0], notes: ""
      });
    },
  });

  const [dept, setDept] = useState("Doctor");

  const updateRole = async () => {
    await base44.auth.updateMe({ department: dept });
    setUser({ ...user, department: dept });
    setRoleDialogOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center shadow-md">
          <ShieldCheck className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-400">Manage patients and demo settings</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDialogOpen(true)}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Add Patient</p>
              <p className="text-xs text-slate-400">Register a new patient</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setRoleDialogOpen(true)}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Switch Role</p>
              <p className="text-xs text-slate-400">Current: {user?.department || "Admin"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">All Patients ({patients.length})</h2>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {patients.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                {p.full_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{p.full_name}</p>
                <p className="text-xs text-slate-400">{p.patient_id} · {p.age}y {p.gender} · Room {p.room_number || "N/A"}</p>
              </div>
              <StatusBadge status={p.status} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Patient ID</Label>
              <Input value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} placeholder="P-10001" />
            </div>
            <div className="space-y-1.5">
              <Label>Age</Label>
              <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Blood Group</Label>
              <Select value={form.blood_group} onValueChange={v => setForm({ ...form, blood_group: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Diagnosis</Label>
              <Input value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Room Number</Label>
              <Input value={form.room_number} onChange={e => setForm({ ...form, room_number: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Attending Doctor</Label>
              <Input value={form.attending_doctor} onChange={e => setForm({ ...form, attending_doctor: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Admission Date</Label>
              <Input type="date" value={form.admission_date} onChange={e => setForm({ ...form, admission_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admitted">Admitted</SelectItem>
                  <SelectItem value="Under Diagnosis">Under Diagnosis</SelectItem>
                  <SelectItem value="Treatment Ongoing">Treatment Ongoing</SelectItem>
                  <SelectItem value="Discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => createPatient.mutate(form)} disabled={!form.full_name || !form.patient_id || createPatient.isPending}>
              {createPatient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Register Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Switch Your Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Department / Role</Label>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Nurse">Nurse</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateRole}>Switch Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}