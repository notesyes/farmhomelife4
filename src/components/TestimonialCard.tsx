import { TestimonialCardProps } from "@/types";

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  className = "",
}) => {
  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  return (
    <div
      className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      {/* Star Rating */}
      <div
        className="flex items-center mb-4"
        role="img"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {renderStars(testimonial.rating)}
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 mb-6 italic">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author Information */}
      <div className="border-t border-gray-100 pt-4">
        <div className="font-semibold text-gray-800 mb-1">
          {testimonial.author.name}
        </div>
        <div className="text-sm text-gray-600">
          {testimonial.author.company}
        </div>
        <div className="text-sm text-emerald-600 font-medium">
          {testimonial.author.farmSize}
        </div>
      </div>
    </div>
  );
};

TestimonialCard.displayName = "TestimonialCard";

export default TestimonialCard;
