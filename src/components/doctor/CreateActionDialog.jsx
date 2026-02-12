import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";

const DEPT_MAP = {
  Prescription: "Pharmacy",
  "Diagnostic Test": "Diagnostics",
  Referral: "Doctor",
  "Care Instruction": "Nursing",
};

export default function CreateActionDialog({ open, onOpenChange, patient, user }) {
  const queryClient = useQueryClient();
  const [actionType, setActionType] = useState("Prescription");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [testType, setTestType] = useState("");
  const [referralTo, setReferralTo] = useState("");
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const action = await base44.entities.ClinicalAction.create(data);
      await base44.entities.TimelineEvent.create({
        patient_id: patient.id,
        action_id: action.id,
        event_type: "Action Created",
        title: `${data.action_type}: ${data.title}`,
        description: `Ordered by ${user?.full_name || "Doctor"} — assigned to ${data.assigned_department}`,
        performed_by: user?.email,
        performed_by_role: "Doctor",
      });
      return action;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-actions"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      queryClient.invalidateQueries({ queryKey: ["actions-all"] });
      resetForm();
      onOpenChange(false);
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setTestType("");
    setReferralTo("");
    setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleSubmit = () => {
    const data = {
      patient_id: patient.id,
      action_type: actionType,
      title,
      description,
      priority,
      status: "Pending",
      assigned_department: DEPT_MAP[actionType],
      ordered_by: user?.email,
    };
    if (actionType === "Prescription") data.medications = medications.filter(m => m.name);
    if (actionType === "Diagnostic Test") data.test_type = testType;
    if (actionType === "Referral") data.referral_to = referralTo;
    createMutation.mutate(data);
  };

  const addMed = () => setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  const removeMed = (i) => setMedications(medications.filter((_, idx) => idx !== i));
  const updateMed = (i, field, val) => {
    const updated = [...medications];
    updated[i][field] = val;
    setMedications(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Clinical Action for {patient?.full_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Action Type</Label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Diagnostic Test">Diagnostic Test</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Care Instruction">Care Instruction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Blood Panel, Amoxicillin Course..." />
          </div>

          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Description / Instructions</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Additional details..." rows={3} />
          </div>

          {actionType === "Prescription" && (
            <div className="space-y-3">
              <Label>Medications</Label>
              {medications.map((med, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl relative">
                  <Input placeholder="Drug name" value={med.name} onChange={e => updateMed(i, "name", e.target.value)} />
                  <Input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={e => updateMed(i, "dosage", e.target.value)} />
                  <Input placeholder="Frequency (e.g. 3x/day)" value={med.frequency} onChange={e => updateMed(i, "frequency", e.target.value)} />
                  <div className="flex gap-2">
                    <Input placeholder="Duration" value={med.duration} onChange={e => updateMed(i, "duration", e.target.value)} />
                    {medications.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeMed(i)} className="flex-shrink-0 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addMed} className="w-full">
                <Plus className="w-4 h-4 mr-1" /> Add Medication
              </Button>
            </div>
          )}

          {actionType === "Diagnostic Test" && (
            <div className="space-y-1.5">
              <Label>Test Type</Label>
              <Input value={testType} onChange={e => setTestType(e.target.value)} placeholder="e.g. CBC, MRI Brain, X-Ray Chest..." />
            </div>
          )}

          {actionType === "Referral" && (
            <div className="space-y-1.5">
              <Label>Refer To</Label>
              <Input value={referralTo} onChange={e => setReferralTo(e.target.value)} placeholder="e.g. Cardiology, Orthopedics..." />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || createMutation.isPending}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg"
          >
            {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}