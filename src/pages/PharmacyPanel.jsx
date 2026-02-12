import React from "react";
import DepartmentActionList from "../components/department/DepartmentActionList";
import { Pill } from "lucide-react";

export default function PharmacyPanel() {
  return (
    <DepartmentActionList
      department="Pharmacy"
      departmentRole="Pharmacy"
      actionTypes={["Prescription"]}
      statusOptions={["Pending", "Processing", "Dispensed"]}
      icon={Pill}
      iconColor="text-amber-600"
      iconBg="bg-amber-100"
      title="Pharmacy"
      subtitle="Process and dispense medications"
    />
  );
}