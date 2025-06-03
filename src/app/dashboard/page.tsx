"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProductionStatusCard from "@/components/dashboard/ProductionStatusCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import SalesSummaryCard from "@/components/dashboard/SalesSummaryCard";
import SalesPerformanceCard from "@/components/dashboard/SalesPerformanceCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

// Types for inventory and sales data
type InventoryRecord = {
  id: string;
  date: string;
  eggCount: number;
  pickupTime: string;
  pickupMethod: string;
  incubated: number;
  broken: number;
  weather: string;
  notes: string;
};

type Sale = {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  eggProductionId: string;
  eggProductionName: string;
  dozens: number;
  pricePerDozen: number;
  total: number;
  pickupMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  notes: string;
};

export default function DashboardPage() {
  const router = useRouter();
  
  // State for export loading
  const [isExporting, setIsExporting] = useState(false);
  
  // State for inventory and sales data
  const [inventoryRecords] = useState<InventoryRecord[]>([
    {
      id: "rec1",
      date: new Date().toISOString().split("T")[0],
      eggCount: 50,
      pickupTime: "15:37",
      pickupMethod: "Evening Collection",
      incubated: 25,
      broken: 5,
      weather: "cloudy",
      notes: "Mixed sizes, some soft shells"
    }
  ]);
  
  const [salesRecords] = useState<Sale[]>([
    { 
      id: "1", 
      date: new Date().toISOString().split('T')[0], 
      customerId: "4", 
      customerName: "michael", 
      eggProductionId: "1",
      eggProductionName: "Free Range Eggs",
      dozens: 1.5, 
      pricePerDozen: 6.00, 
      total: 9.00,
      pickupMethod: "Pickup in Person",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      notes: ""
    }
  ]);
  
  // Stats for dashboard
  const [dashboardStats, setDashboardStats] = useState({
    dailyProduction: 0,
    eggsRejected: 0,
    dailyRevenue: 0,
    feedUsed: 0,
    productionTrend: "",
    rejectionTrend: "",
    revenueTrend: "",
    feedTrend: ""
  });
  
  // Calculate dashboard stats based on inventory and sales data
  useEffect(() => {
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate total eggs collected today
    const todaysInventory = inventoryRecords.filter(record => record.date === today);
    const totalEggsCollected = todaysInventory.reduce((sum, record) => sum + record.eggCount, 0);
    
    // Calculate eggs sold today (convert dozens to individual eggs)
    const todaysSales = salesRecords.filter(sale => sale.date === today);
    const eggsInDozensSold = todaysSales.reduce((sum, sale) => sum + (sale.dozens * 12), 0);
    
    // Calculate eggs rejected (broken + incubated)
    const eggsRejected = todaysInventory.reduce((sum, record) => sum + record.broken + record.incubated, 0);
    
    // Calculate daily revenue
    const dailyRevenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Calculate feed used (mock calculation - 0.25 lbs per chicken, assuming 12 chickens)
    const feedUsed = 3.0;  // This would be calculated from actual feed data
    
    // Calculate trends (mock data for now)
    // In a real app, you would compare with previous day/week
    const productionTrend = "+5.2%";
    const rejectionTrend = "-1.3%";
    const revenueTrend = "+10.4%";
    const feedTrend = "-0.8%";
    
    setDashboardStats({
      dailyProduction: totalEggsCollected - eggsInDozensSold,  // Eggs collected minus eggs sold
      eggsRejected,
      dailyRevenue,
      feedUsed,
      productionTrend,
      rejectionTrend,
      revenueTrend,
      feedTrend
    });
  }, [inventoryRecords, salesRecords]);
  
  // Format current date for display
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Function to handle report export
  const handleExportReport = () => {
    setIsExporting(true);
    
    // Simulate report generation
    setTimeout(() => {
      // Create report data
      const reportData = {
        date: currentDate,
        dailyProduction: 342,
        eggsRejected: 8,
        dailyRevenue: 86.50,
        feedUsed: 3.2,
        productionStatus: {
          fresh: 120,
          washed: 95,
          packed: 85,
          sold: 42
        },
        salesSummary: {
          totalSales: 1250.75,
          averageOrder: 28.42,
          topCustomers: ["Johnson Farm", "Local Market", "Green Grocers"]
        }
      };
      
      // Convert to CSV string
      const csvContent = [
        "Farm Home Life - Production Report",
        `Generated on: ${currentDate}`,
        "",
        "DAILY METRICS",
        `Daily Production,${dashboardStats.dailyProduction} eggs`,
        `Eggs Rejected,${dashboardStats.eggsRejected}`,
        `Daily Revenue,$${dashboardStats.dailyRevenue}`,
        `Feed Used,${dashboardStats.feedUsed} lbs`,
        "",
        "PRODUCTION STATUS",
        `Fresh,${reportData.productionStatus.fresh}`,
        `Washed,${reportData.productionStatus.washed}`,
        `Packed,${reportData.productionStatus.packed}`,
        `Sold,${reportData.productionStatus.sold}`,
        "",
        "SALES SUMMARY",
        `Total Sales,$${reportData.salesSummary.totalSales}`,
        `Average Order,$${reportData.salesSummary.averageOrder}`,
        "Top Customers," + reportData.salesSummary.topCustomers.join("; ")
      ].join("\n");
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `farm-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download and cleanup
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1500);
  };

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
              <button 
                onClick={handleExportReport}
                disabled={isExporting}
                className={`${isExporting ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center`}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  '+ Export Report'
                )}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DashboardStatCard 
                value={dashboardStats.dailyProduction}
                label="Daily Production"
                unit="eggs"
                trend={dashboardStats.productionTrend}
                color="blue"
                description="Available eggs after sales"
                onClick={() => router.push('/dashboard/inventory')}
              />
              <DashboardStatCard 
                value={dashboardStats.eggsRejected}
                label="Eggs Rejected"
                trend={dashboardStats.rejectionTrend}
                color="green"
                description="Broken or incubated eggs"
                onClick={() => router.push('/dashboard/inventory')}
              />
              <DashboardStatCard 
                value={dashboardStats.dailyRevenue}
                label="Daily Revenue"
                unit="$"
                trend={dashboardStats.revenueTrend}
                color="purple"
                description="Based on today's sales"
              />
              <DashboardStatCard 
                value={dashboardStats.feedUsed}
                label="Feed Used"
                unit="lbs"
                trend={dashboardStats.feedTrend}
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
