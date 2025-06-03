interface DashboardStatCardProps {
  value: number;
  label: string;
  unit?: string;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "egg" | "broken-egg";
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
    egg: "bg-amber-100 text-amber-600",
    "broken-egg": "bg-red-100 text-red-600",
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
              {typeof value === "number" 
                ? (value === 0 || value < 0.01) 
                  ? "0" 
                  : Math.floor(value).toLocaleString()
                : "0"}
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
              <path d="M12 3C8.5 3 5 7.58 5 11.5c0 3.91 3.1 7.5 7 7.5s7-3.59 7-7.5C19 7.58 15.5 3 12 3zm-1 11.5c-1.41 0-2-1.02-2-2.25 0-.53.14-1.01.36-1.37.15-.24.42-.4.74-.4.32 0 .59.16.74.4.22.36.36.84.36 1.37 0 1.23-.59 2.25-2 2.25z" />
            </svg>
          )}
          {color === "green" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          )}
          {color === "purple" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          )}
          {color === "orange" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17h18v2H3v-2zm0-7h18v5H3v-5zm0-4h18v2H3V6z" />
            </svg>
          )}
          {color === "red" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C8.5 3 5 7.58 5 11.5c0 3.91 3.1 7.5 7 7.5s7-3.59 7-7.5C19 7.58 15.5 3 12 3zm-1 11.5c-1.41 0-2-1.02-2-2.25 0-.53.14-1.01.36-1.37.15-.24.42-.4.74-.4.32 0 .59.16.74.4.22.36.36.84.36 1.37 0 1.23-.59 2.25-2 2.25z" />
            </svg>
          )}
          {color === "egg" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C8.5 3 5 7.58 5 11.5c0 3.91 3.1 7.5 7 7.5s7-3.59 7-7.5C19 7.58 15.5 3 12 3zm-1 11.5c-1.41 0-2-1.02-2-2.25 0-.53.14-1.01.36-1.37.15-.24.42-.4.74-.4.32 0 .59.16.74.4.22.36.36.84.36 1.37 0 1.23-.59 2.25-2 2.25z" />
            </svg>
          )}
          {color === "broken-egg" && (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C8.5 3 5 7.58 5 11.5c0 3.91 3.1 7.5 7 7.5s7-3.59 7-7.5C19 7.58 15.5 3 12 3zm-1 11.5c-1.41 0-2-1.02-2-2.25 0-.53.14-1.01.36-1.37.15-.24.42-.4.74-.4.32 0 .59.16.74.4.22.36.36.84.36 1.37 0 1.23-.59 2.25-2 2.25z" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
