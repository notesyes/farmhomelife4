import TestimonialCard from "./TestimonialCard";
import { testimonialsData } from "@/data";

interface TestimonialsSectionProps {
  className?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  className = "",
}) => {
  return (
    <section
      id="testimonials"
      className={`py-16 md:py-24 bg-gray-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-emerald-600">
            Hear from egg farmers who have transformed their business with our
            platform
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
