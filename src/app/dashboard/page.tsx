import { Metadata } from "next";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProductionStatusCard from "@/components/dashboard/ProductionStatusCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import SalesSummaryCard from "@/components/dashboard/SalesSummaryCard";
import SalesPerformanceCard from "@/components/dashboard/SalesPerformanceCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

export const metadata: Metadata = {
  title: "Dashboard | Farm Home Life",
  description: "View and manage your farm production data",
};

export default function DashboardPage() {
  // Mock data for dashboard
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Egg Production Dashboard</h1>
                <p className="text-sm text-gray-600">Last updated: {currentDate}</p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                + Export Report
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DashboardStatCard 
                value={342}
                label="Daily Production"
                unit="eggs"
                trend="+5.2%"
                color="blue"
                description="Today's egg collection"
              />
              <DashboardStatCard 
                value={8}
                label="Eggs Rejected"
                trend="-1.3%"
                color="green"
                description="Quality control passed"
              />
              <DashboardStatCard 
                value={86.50}
                label="Daily Revenue"
                unit="$"
                trend="+10.4%"
                color="purple"
                description="Based on today's sales"
              />
              <DashboardStatCard 
                value={3.2}
                label="Feed Used"
                unit="lbs"
                trend="-0.8%"
                color="orange"
                description="Per chicken average"
              />
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Production Status */}
              <div className="lg:col-span-3">
                <ProductionStatusCard />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <QuickActionsCard />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Summary */}
              <div className="lg:col-span-1">
                <SalesSummaryCard />
              </div>

              {/* Sales Performance */}
              <div className="lg:col-span-1">
                <SalesPerformanceCard />
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <RecentActivityCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
