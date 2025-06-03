import { FeatureCard, Testimonial } from "@/types";

export const featuresData: FeatureCard[] = [
  {
    id: "production-tracking",
    title: "Production Tracking",
    icon: "📊",
    description:
      "Monitor your daily egg production with detailed analytics and trends.",
    features: [
      "Record daily egg counts",
      "Track broken and misshapen eggs",
      "Monitor inventory levels",
      "Generate production reports",
    ],
  },
  {
    id: "food-tracking",
    title: "Food Tracking",
    icon: "🌾",
    description:
      "Keep track of feed consumption and costs to optimize your operations.",
    features: [
      "Manage feed inventory",
      "Track monthly consumption",
      "Monitor feed costs",
      "Calculate feed efficiency",
    ],
    isBeta: true,
  },
  {
    id: "customer-management",
    title: "Customer Management",
    icon: "👥",
    description:
      "Build and maintain relationships with your customers effectively.",
    features: [
      "Store customer contact information",
      "Track purchase history",
      "Analyze customer buying patterns",
      "Manage customer communications",
    ],
  },
  {
    id: "sales-management",
    title: "Sales Management",
    icon: "💰",
    description: "Streamline your sales process and maximize revenue.",
    features: [
      "Record sales transactions",
      "Track revenue and profits",
      "Manage pricing and discounts",
      "Generate sales reports",
    ],
  },
  {
    id: "reporting-analytics",
    title: "Reporting & Analytics",
    icon: "📈",
    description:
      "Get insights into your farm's performance with comprehensive analytics.",
    features: [
      "Generate production reports",
      "Analyze sales trends",
      "Export data for external analysis",
      "Track key performance metrics",
    ],
  },
  {
    id: "incubation-management",
    title: "Incubation Management",
    icon: "🥚",
    description: "Manage your incubation process from start to finish.",
    features: [
      "Track incubation cycles",
      "Monitor temperature and humidity",
      "Calculate hatch rates",
      "Schedule turning reminders",
    ],
  },
];

export const testimonialsData: Testimonial[] = [
  {
    id: "sarah-johnson",
    rating: 5,
    quote:
      "This app has completely transformed how I manage my egg production. I used to track everything in spreadsheets, but now it's all in one place and so much easier to use.",
    author: {
      name: "Sarah Johnson",
      company: "Small Farm Owner",
      farmSize: "200 hens",
    },
  },
  {
    id: "michael-rodriguez",
    rating: 5,
    quote:
      "The customer management feature has helped me build better relationships with my regular buyers. I can track their preferences and purchase history easily.",
    author: {
      name: "Michael Rodriguez",
      company: "Family Farm",
      farmSize: "500 hens",
    },
  },
  {
    id: "emily-chen",
    rating: 5,
    quote:
      "The reporting features have given me insights I never had before. I can see trends in production and sales that help me make better business decisions.",
    author: {
      name: "Emily Chen",
      company: "Organic Egg Farm",
      farmSize: "50 hens",
    },
  },
];
