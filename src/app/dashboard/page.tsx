"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import SalesSummaryCard from "@/components/dashboard/SalesSummaryCard";
import SalesPerformanceCard from "@/components/dashboard/SalesPerformanceCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

// Types for inventory, sales, and feed data
type SpeciesType = "chicken" | "duck" | "quail" | "goose" | "turkey";
type FeedType = "chicken" | "duck" | "quail" | "goose" | "turkey" | "other";

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

type FeedPurchase = {
  id: string;
  date: string;
  feedType: FeedType;
  brand: string;
  quantity: number; // in pounds
  cost: number; // total cost
  notes: string;
};

type FeedUsage = {
  id: string;
  date: string;
  feedType: FeedType;
  quantity: number; // in pounds
  notes: string;
};

export default function DashboardPage() {
  const router = useRouter();
  
  // State for export loading
  const [isExporting, setIsExporting] = useState(false);
  
  // State for inventory, sales, incubation, and feed data
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>([]);
  const [salesRecords, setSalesRecords] = useState<Sale[]>([]);
  const [incubationBatches, setIncubationBatches] = useState<EggBatch[]>([]);
  const [feedPurchases, setFeedPurchases] = useState<FeedPurchase[]>([]);
  const [feedUsage, setFeedUsage] = useState<FeedUsage[]>([]);
  
  // Load inventory, sales, and incubation data from localStorage
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    try {
      // Load inventory records
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
            pickupDate: new Date().toISOString().split('T')[0],
            pickupTime: "14:00",
            notes: "Regular customer"
          }
        ];
        setSalesRecords(defaultSales);
        localStorage.setItem('salesRecords', JSON.stringify(defaultSales));
      }
      
      // Load incubation batches
      const savedBatches = localStorage.getItem('incubationBatches');
      if (savedBatches) {
        setIncubationBatches(JSON.parse(savedBatches));
      } else {
        // Default data if nothing is saved
        const defaultBatches = [
          {
            id: "batch1",
            name: "Spring Batch 1",
            startDate: "2025-05-01",
            expectedHatchDate: "2025-05-22",
            eggCount: 12,
            speciesType: "chicken" as SpeciesType,
            speciesVariety: "Rhode Island Red",
            notes: "First batch of the season",
            status: "incubating" as "incubating" | "hatched" | "failed",
            temperature: 99.5,
            humidity: 55,
            lastTurned: new Date().toISOString(),
            lastCandled: new Date().toISOString()
          }
        ];
        setIncubationBatches(defaultBatches);
        localStorage.setItem('incubationBatches', JSON.stringify(defaultBatches));
      }
      
      // Load feed purchases
      const savedFeedPurchases = localStorage.getItem('feedPurchases');
      if (savedFeedPurchases) {
        setFeedPurchases(JSON.parse(savedFeedPurchases));
      } else {
        // Default feed purchase data
        const defaultFeedPurchases: FeedPurchase[] = [
          {
            id: "p1",
            date: "2025-05-01",
            feedType: "chicken" as FeedType,
            brand: "Farm Supply Co.",
            quantity: 50,
            cost: 35.99,
            notes: "Monthly bulk purchase"
          },
          {
            id: "p2",
            date: "2025-05-15",
            feedType: "duck" as FeedType,
            brand: "Waterfowl Nutrition",
            quantity: 25,
            cost: 22.50,
            notes: "Special blend for ducklings"
          }
        ];
        setFeedPurchases(defaultFeedPurchases);
        localStorage.setItem('feedPurchases', JSON.stringify(defaultFeedPurchases));
      }
      
      // Load feed usage
      const savedFeedUsage = localStorage.getItem('feedUsage');
      if (savedFeedUsage) {
        setFeedUsage(JSON.parse(savedFeedUsage));
      } else {
        // Default feed usage data
        const defaultFeedUsage: FeedUsage[] = [
          {
            id: "u1",
            date: "2025-05-20",
            feedType: "chicken" as FeedType,
            quantity: 5,
            notes: "Weekly refill of feeders"
          },
          {
            id: "u2",
            date: "2025-05-27",
            feedType: "chicken" as FeedType,
            quantity: 4.5,
            notes: "Weekly refill of feeders"
          },
          {
            id: "u3",
            date: "2025-05-30",
            feedType: "duck" as FeedType,
            quantity: 3,
            notes: "Refilled duck feeders"
          }
        ];
        setFeedUsage(defaultFeedUsage);
        localStorage.setItem('feedUsage', JSON.stringify(defaultFeedUsage));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
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
  
  // State for dashboard stats
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
    feedTrend: "-0.0%",
    totalFeedPurchased: 0,
    totalFeedUsed: 0,
    totalFeedCost: 0
  });
  
  // Calculate dashboard stats based on inventory, sales, and incubation data
  useEffect(() => {
    const updatedStats = {
      dailyProduction: inventoryRecords.length > 0 ? inventoryRecords[0].eggCount : 0,
      eggsRejected: inventoryRecords.length > 0 ? inventoryRecords[0].broken : 0,
      eggsIncubated: inventoryRecords.length > 0 ? inventoryRecords[0].incubated : 0,
      dailyRevenue: salesRecords.reduce((sum: number, sale: Sale) => {
        // Check if the sale date is today
        const saleDate = new Date(sale.date);
        const today = new Date();
        if (saleDate.toDateString() === today.toDateString()) {
          return sum + sale.total;
        }
        return sum;
      }, 0),
      feedUsed: 2.5, // Pounds per chicken
      
      // Trends (formatted as strings with + or - prefix)
      productionTrend: "+5.2%",
      rejectionTrend: "-2.1%",
      incubationTrend: "+3.7%",
      revenueTrend: "+8.3%",
      feedTrend: "-1.2%",
      
      // Feed statistics
      totalFeedPurchased: feedPurchases.reduce((sum: number, purchase: FeedPurchase) => sum + purchase.quantity, 0),
      totalFeedUsed: feedUsage.reduce((sum: number, usage: FeedUsage) => sum + usage.quantity, 0),
      totalFeedCost: feedPurchases.reduce((sum: number, purchase: FeedPurchase) => sum + purchase.cost, 0)
    };
    
    setDashboardStats(updatedStats);
  }, [inventoryRecords, salesRecords, incubationBatches, feedPurchases, feedUsage]);
  
  // Calculate feed remaining (derived from dashboard stats)
  const feedRemaining = dashboardStats.totalFeedPurchased - dashboardStats.totalFeedUsed;
  
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
                value={typeof window !== 'undefined' ? parseFloat(localStorage.getItem('availableDozens') ? 
                  JSON.parse(localStorage.getItem('availableDozens') || '{}').total || 0 : 0) : 0}
                label="Dozens Available"
                trend="+0.0%"
                color="green"
                description="Eggs available for sale"
                onClick={() => router.push('/dashboard/sales')}
              />
              <DashboardStatCard 
                value={incubationBatches
                  .filter(batch => batch.status === 'incubating')
                  .reduce((sum: number, batch: EggBatch) => sum + batch.eggCount, 0)}
                label="Incubating Eggs"
                trend={dashboardStats.incubationTrend}
                color="egg"
                description="Eggs currently in incubators"
                onClick={() => router.push('/dashboard/incubation')}
              />
              <DashboardStatCard 
                value={dashboardStats.dailyRevenue}
                label="Today's Total Sales"
                unit="$"
                trend={dashboardStats.revenueTrend}
                color="green"
                description="Total revenue from today's sales"
                onClick={() => router.push('/dashboard/sales')}
              />
              <DashboardStatCard 
                value={dashboardStats.totalFeedPurchased}
                label="Total Feed Purchased"
                unit="lbs"
                color="blue"
                description="All-time feed purchases"
                onClick={() => router.push('/dashboard/feed')}
              />
              <DashboardStatCard 
                value={feedRemaining}
                label="Feed Remaining"
                unit="lbs"
                color="green"
                description="Current feed inventory"
                onClick={() => router.push('/dashboard/feed')}
              />
              <DashboardStatCard 
                value={dashboardStats.totalFeedUsed}
                label="Feed Used"
                unit="lbs"
                trend={dashboardStats.feedTrend}
                color="orange"
                description="All-time feed consumption"
                onClick={() => router.push('/dashboard/feed')}
              />
              <DashboardStatCard 
                value={dashboardStats.totalFeedCost}
                label="Total Feed Cost"
                unit="$"
                color="purple"
                description="All-time feed expenses"
                onClick={() => router.push('/dashboard/feed')}
              />
            </div>

            {/* Middle Section - Production Status Card removed */}

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
