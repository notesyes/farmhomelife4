import { DashboardStats } from "@/types";
import StatCard from "./StatCard";

interface DashboardPreviewProps {
  className?: string;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  className = "",
}) => {
  const dashboardData: DashboardStats = {
    totalProduction: {
      value: 1248,
      label: "Total Production",
      unit: "eggs",
    },
    monthlySales: {
      value: 345.6,
      label: "Monthly Sales",
      unit: "$",
    },
    customers: {
      value: 24,
      label: "Customers",
    },
    inventory: {
      value: 86,
      label: "Inventory",
      unit: "eggs",
    },
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border border-emerald-200 ${className}`}
    >
      {/* Dashboard Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Egg Tracker Dashboard
        </h3>
        <p className="text-sm text-gray-600">
          Visualize your egg production and sales data
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          value={dashboardData.totalProduction.value}
          label={dashboardData.totalProduction.label}
          unit={dashboardData.totalProduction.unit}
        />
        <StatCard
          value={`$${dashboardData.monthlySales.value.toFixed(2)}`}
          label={dashboardData.monthlySales.label}
        />
        <StatCard
          value={dashboardData.customers.value}
          label={dashboardData.customers.label}
        />
        <StatCard
          value={dashboardData.inventory.value}
          label={dashboardData.inventory.label}
          unit={dashboardData.inventory.unit}
        />
      </div>
    </div>
  );
};

DashboardPreview.displayName = "DashboardPreview";

export default DashboardPreview;
