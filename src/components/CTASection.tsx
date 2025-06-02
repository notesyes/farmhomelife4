import Link from "next/link";

interface CTASectionProps {
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ className = "" }) => {
  return (
    <section
      className={`py-16 md:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to transform your egg business?
        </h2>
        <p className="text-xl text-emerald-100 mb-8">
          Join thousands of egg farmers who are using our platform to streamline
          their operations
        </p>
        <Link href="/signup">
          <button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600">
            Get Started for Free
          </button>
        </Link>
      </div>
    </section>
  );
};

CTASection.displayName = "CTASection";

export default CTASection;
