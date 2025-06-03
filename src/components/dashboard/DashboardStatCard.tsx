interface DashboardStatCardProps {
  value: number;
  label: string;
  unit?: string;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  description?: string;
  className?: string;
  onClick?: () => void;
  linkTo?: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  value,
  label,
  unit,
  trend,
  color = "blue",
  description,
  className = "",
  onClick,
  linkTo,
}) => {
  // Color mapping for the card icon background
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  // Trend color
  const trendColor = trend?.startsWith("+") 
    ? "text-green-600" 
    : trend?.startsWith("-") 
      ? "text-red-600" 
      : "text-gray-600";

  // Determine if card is clickable
  const isClickable = onClick || linkTo;
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 ${className} ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow duration-200 hover:translate-y-[-2px]' : ''}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View ${label} details` : undefined}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline">
            <h2 className="text-3xl font-bold text-gray-800">
              {unit === "$" && unit}
              {typeof value === "number" && value % 1 === 0 
                ? value.toLocaleString() 
                : value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {unit && unit !== "$" && <span className="ml-1 text-sm font-medium text-gray-500">{unit}</span>}
            </h2>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trendColor}`}>
                {trend}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorMap[color]}`}>
          {/* Icon based on the card type */}
          {color === "blue" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          )}
          {color === "green" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
          {color === "purple" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          )}
          {color === "orange" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
          {color === "red" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
