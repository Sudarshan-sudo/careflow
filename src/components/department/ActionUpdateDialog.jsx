import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function ActionUpdateDialog({ open, onOpenChange, action, statusOptions, departmentRole, user }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(action?.status || "");
  const [notes, setNotes] = useState(action?.department_notes || "");
  const [testResult, setTestResult] = useState(action?.test_result || "");

  const updateMutation = useMutation({
    mutationFn: async () => {
      const updateData = {
        status,
        department_notes: notes,
        updated_by: user?.email,
        updated_by_role: departmentRole,
      };
      if (departmentRole === "Diagnostics" && testResult) {
        updateData.test_result = testResult;
      }
      await base44.entities.ClinicalAction.update(action.id, updateData);

      await base44.entities.TimelineEvent.create({
        patient_id: action.patient_id,
        action_id: action.id,
        event_type: testResult ? "Result Uploaded" : "Status Update",
        title: `${action.action_type} → ${status}`,
        description: notes || `Status updated to ${status} by ${departmentRole}`,
        performed_by: user?.email,
        performed_by_role: departmentRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      onOpenChange(false);
    },
  });

  if (!action) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update: {action.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {statusOptions.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {departmentRole === "Diagnostics" && (
            <div className="space-y-1.5">
              <Label>Test Result</Label>
              <Textarea
                value={testResult}
                onChange={e => setTestResult(e.target.value)}
                placeholder="Enter test results..."
                rows={4}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add department notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}