import { FeatureCardProps } from "@/types";

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  className = "",
}) => {
  return (
    <div
      className={`relative bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ${className}`}
    >
      {/* BETA Badge for Food Tracking */}
      {feature.isBeta && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded transform rotate-12 shadow-md">
          BETA
        </div>
      )}

      {/* Feature Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl" role="img" aria-label={feature.title}>
            {feature.icon}
          </span>
        </div>
      </div>

      {/* Feature Title */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {feature.title}
      </h3>

      {/* Feature Description */}
      <p className="text-gray-600 mb-4 text-sm">{feature.description}</p>

      {/* Feature List */}
      <ul className="space-y-2">
        {feature.features.map((item, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <span className="text-emerald-600 mr-2 mt-0.5" aria-hidden="true">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;
