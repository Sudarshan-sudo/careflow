import React from "react";
import DepartmentActionList from "../components/department/DepartmentActionList";
import { FlaskConical } from "lucide-react";

export default function DiagnosticsPanel() {
  return (
    <DepartmentActionList
      department="Diagnostics"
      departmentRole="Diagnostics"
      actionTypes={["Diagnostic Test"]}
      statusOptions={["Pending", "Accepted", "In Progress", "Completed"]}
      icon={FlaskConical}
      iconColor="text-purple-600"
      iconBg="bg-purple-100"
      title="Diagnostics Unit"
      subtitle="Manage lab and imaging test requests"
    />
  );
}