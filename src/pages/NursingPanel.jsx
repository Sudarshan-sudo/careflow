import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import DepartmentActionList from "../components/department/DepartmentActionList";
import { HeartPulse } from "lucide-react";

export default function NursingPanel() {
  return (
    <DepartmentActionList
      department="Nursing"
      departmentRole="Nurse"
      actionTypes={["Care Instruction"]}
      statusOptions={["Pending", "Administered", "Monitoring", "Completed"]}
      icon={HeartPulse}
      iconColor="text-emerald-600"
      iconBg="bg-emerald-100"
      title="Nursing Station"
      subtitle="Administer care instructions and record vitals"
    />
  );
}