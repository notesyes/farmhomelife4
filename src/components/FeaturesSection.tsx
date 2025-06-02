import FeatureCard from "./FeatureCard";
import { featuresData } from "@/data";

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  className = "",
}) => {
  return (
    <section id="features" className={`py-16 md:py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features for Egg Farmers
          </h2>
          <p className="text-xl text-emerald-600 mb-2">
            Everything you need to manage your egg production business in one
            place
          </p>
          <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
            NEW FEATURES
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
