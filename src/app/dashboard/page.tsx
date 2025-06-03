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
type SpeciesType = "chicken" | "duck" | "quail" | "goose" | "turkey";

type EggBatch = {
  id: string;
  name: string;
  startDate: string;
  expectedHatchDate: string;
  eggCount: number;
  speciesType: SpeciesType;
  speciesVariety: string;
  notes: string;
  status: "incubating" | "hatched" | "failed";
  temperature: number;
  humidity: number;
  lastTurned: string;
  lastCandled: string;
};

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
  
  // State for inventory, sales, and incubation data
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>([]);
  const [salesRecords, setSalesRecords] = useState<Sale[]>([]);
  const [incubationBatches, setIncubationBatches] = useState<EggBatch[]>([]);
  
  // Load inventory, sales, and incubation data from localStorage
  useEffect(() => {
    // Load inventory records
    try {
      const savedInventory = localStorage.getItem('inventoryRecords');
      if (savedInventory) {
        setInventoryRecords(JSON.parse(savedInventory));
      } else {
        // Default data if nothing is saved
        const defaultInventory = [
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
        ];
        setInventoryRecords(defaultInventory);
        localStorage.setItem('inventoryRecords', JSON.stringify(defaultInventory));
      }
      
      // Load sales records
      const savedSales = localStorage.getItem('salesRecords');
      if (savedSales) {
        setSalesRecords(JSON.parse(savedSales));
      } else {
        // Default data if nothing is saved
        const defaultSales = [
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
        ];
        setSalesRecords(defaultSales);
        localStorage.setItem('salesRecords', JSON.stringify(defaultSales));
      }
      
      // Load incubation batches
      const savedIncubation = localStorage.getItem('incubationBatches');
      if (savedIncubation) {
        setIncubationBatches(JSON.parse(savedIncubation));
      } else {
        // We don't set default incubation data, as it's managed on the incubation page
        // This just ensures we have the state initialized
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);
  
  // Set up event listeners for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'inventoryRecords' && e.newValue) {
        setInventoryRecords(JSON.parse(e.newValue));
      } else if (e.key === 'salesRecords' && e.newValue) {
        setSalesRecords(JSON.parse(e.newValue));
      } else if (e.key === 'incubationBatches' && e.newValue) {
        setIncubationBatches(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Stats for dashboard
  const [dashboardStats, setDashboardStats] = useState({
    dailyProduction: 0,
    eggsRejected: 0,
    eggsIncubated: 0,
    dailyRevenue: 0,
    feedUsed: 0,
    productionTrend: "+0.0%",
    rejectionTrend: "-0.0%",
    incubationTrend: "+0.0%",
    revenueTrend: "+0.0%",
    feedTrend: "-0.0%"
  });
  
  // Calculate dashboard stats based on inventory, sales, and incubation data
  useEffect(() => {
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate total eggs collected (all time and today)
    const todaysInventory = inventoryRecords.filter(record => record.date === today);
    const totalEggsCollectedToday = todaysInventory.reduce((sum, record) => sum + record.eggCount, 0);
    
    // Calculate total eggs collected (all time)
    const totalEggsCollectedAllTime = inventoryRecords.reduce((sum, record) => sum + record.eggCount, 0);
    
    // Calculate eggs sold (all time and today)
    const todaysSales = salesRecords.filter(sale => sale.date === today);
    // We only need all-time sold eggs for inventory calculation
    const eggsInDozensSoldAllTime = salesRecords.reduce((sum, sale) => sum + (sale.dozens * 12), 0);
    
    // Calculate broken eggs (rejected)
    const eggsBrokenToday = todaysInventory.reduce((sum, record) => sum + record.broken, 0);
    const eggsBrokenAllTime = inventoryRecords.reduce((sum, record) => sum + record.broken, 0);
    
    // Calculate total eggs marked for incubation in inventory history (for reference)
    // We'll use the actively incubating eggs for actual calculations
    
    // Calculate eggs that are actively incubating (only count eggs with 'incubating' status)
    const activelyIncubatingEggs = incubationBatches
      .filter(batch => batch.status === 'incubating')
      .reduce((sum, batch) => sum + batch.eggCount, 0);
    
    // For today's incubation stats, we'll count new eggs added to incubation today
    const eggsIncubatedToday = todaysInventory.reduce((sum, record) => sum + record.incubated, 0);
    
    // Calculate available eggs (total collected minus sold, broken, and actively incubating)
    const availableEggs = totalEggsCollectedAllTime - eggsInDozensSoldAllTime - eggsBrokenAllTime - activelyIncubatingEggs;
    
    // Calculate daily revenue
    const dailyRevenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Calculate feed used (mock calculation - 0.25 lbs per chicken, assuming 12 chickens)
    const feedUsed = 3.0;  // This would be calculated from actual feed data
    
    // Calculate trends by comparing with previous day
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Calculate yesterday's stats
    const yesterdayInventory = inventoryRecords.filter(record => record.date === yesterdayStr);
    const yesterdayEggsCollected = yesterdayInventory.reduce((sum, record) => sum + record.eggCount, 0);
    
    const yesterdaySales = salesRecords.filter(sale => sale.date === yesterdayStr);
    const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    const yesterdayBroken = yesterdayInventory.reduce((sum, record) => sum + record.broken, 0);
    // Calculate yesterday's incubation data
    const yesterdayIncubated = yesterdayInventory.reduce((sum, record) => sum + record.incubated, 0);
    
    // We already have yesterday's date calculated above
    
    // We can't easily get yesterday's active incubations from localStorage
    // So we'll use the trend from inventory records
    
    // Calculate trends
    const productionTrend = yesterdayEggsCollected > 0 
      ? `${((totalEggsCollectedToday - yesterdayEggsCollected) / yesterdayEggsCollected * 100).toFixed(1)}%` 
      : "+0.0%";
      
    const rejectionTrend = yesterdayBroken > 0 
      ? `${((eggsBrokenToday - yesterdayBroken) / yesterdayBroken * 100).toFixed(1)}%` 
      : "-0.0%";
      
    const incubationTrend = yesterdayIncubated > 0 
      ? `${((eggsIncubatedToday - yesterdayIncubated) / yesterdayIncubated * 100).toFixed(1)}%` 
      : "+0.0%";
      
    const revenueTrend = yesterdayRevenue > 0 
      ? `${((dailyRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)}%` 
      : "+0.0%";
      
    const feedTrend = "-0.8%"; // Mock data for now
    
    setDashboardStats({
      dailyProduction: availableEggs,  // Available eggs (all time collected minus sold, broken, and incubated)
      eggsRejected: eggsBrokenToday,
      eggsIncubated: eggsIncubatedToday,
      dailyRevenue,
      feedUsed,
      productionTrend: productionTrend.startsWith("-") ? productionTrend : "+" + productionTrend,
      rejectionTrend: rejectionTrend.startsWith("-") ? rejectionTrend : "+" + rejectionTrend,
      incubationTrend: incubationTrend.startsWith("-") ? incubationTrend : "+" + incubationTrend,
      revenueTrend: revenueTrend.startsWith("-") ? revenueTrend : "+" + revenueTrend,
      feedTrend
    });
  }, [inventoryRecords, salesRecords, incubationBatches]);
  
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
                description="Total available eggs in inventory"
                onClick={() => router.push('/dashboard/inventory')}
              />
              <DashboardStatCard 
                value={dashboardStats.eggsRejected}
                label="Broken Eggs"
                trend={dashboardStats.rejectionTrend}
                color="red"
                description="Damaged or unusable eggs"
                onClick={() => router.push('/dashboard/inventory')}
              />
              <DashboardStatCard 
                value={incubationBatches
                  .filter(batch => batch.status === 'incubating')
                  .reduce((sum, batch) => sum + batch.eggCount, 0)}
                label="Incubating Eggs"
                trend={dashboardStats.incubationTrend}
                color="purple"
                description="Eggs currently in incubators"
                onClick={() => router.push('/dashboard/incubation')}
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
