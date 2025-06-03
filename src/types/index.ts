// TypeScript interfaces for the Egg Production Management System

export interface DashboardStats {
  totalProduction: {
    value: number;
    label: string;
    unit: string;
  };
  monthlySales: {
    value: number;
    label: string;
    unit: string;
  };
  customers: {
    value: number;
    label: string;
  };
  inventory: {
    value: number;
    label: string;
    unit: string;
  };
}

export interface ProductionStatus {
  fresh: number;
  washed: number;
  packed: number;
  sold: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

export interface SalesSummary {
  totalRevenue: number;
  pendingOrders: number;
}

export interface SalesPerformance {
  weeklyTotal: number;
  monthlyTotal: number;
  percentageChange: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  customer: string;
  quantity: number;
  total: number;
}

export interface FeatureCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  isBeta?: boolean;
}

export interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  author: {
    name: string;
    company: string;
    farmSize: string;
  };
}

export interface StatCardProps {
  value: number | string;
  label: string;
  unit?: string;
  className?: string;
}

export interface FeatureCardProps {
  feature: FeatureCard;
  className?: string;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export interface IncubationRecord {
  id: string;
  date: string;
  eggCount: number;
  startDate: string;
  expectedHatchDate: string;
  status: 'incubating' | 'hatched' | 'failed';
  notes: string;
}
