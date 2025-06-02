import { StatCardProps } from "@/types";

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  unit,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="text-2xl font-bold text-gray-800 mb-1">
        {typeof value === "number" && value.toLocaleString()}
        {typeof value === "string" && value}
        {unit && (
          <span className="text-sm font-normal text-gray-600 ml-1">{unit}</span>
        )}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

StatCard.displayName = "StatCard";

export default StatCard;
