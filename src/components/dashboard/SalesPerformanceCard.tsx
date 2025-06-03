import { SalesPerformance } from "@/types";
import { useState, useEffect } from "react";
import { Sale, FeedPurchase } from "@/types";

interface ProfitAnalysis {
  totalSales: number;
  totalFeedCost: number;
  netProfit: number;
  profitMargin: number;
}

const SalesPerformanceCard: React.FC = () => {
  const [salesPerformance, setSalesPerformance] = useState<SalesPerformance>({
    weeklyTotal: 0,
    monthlyTotal: 0,
    percentageChange: 0
  });
  
  const [profitAnalysis, setProfitAnalysis] = useState<ProfitAnalysis>({
    totalSales: 0,
    totalFeedCost: 0,
    netProfit: 0,
    profitMargin: 0
  });

  useEffect(() => {
    // Load sales data and feed costs from localStorage
    const loadData = () => {
      try {
        const savedSales = localStorage.getItem('salesRecords');
        const savedFeedPurchases = localStorage.getItem('feedPurchases');
        
        if (savedSales) {
          const sales: Sale[] = JSON.parse(savedSales);
          const feedPurchases: FeedPurchase[] = savedFeedPurchases ? JSON.parse(savedFeedPurchases) : [];
          
          // Get current date and calculate date ranges
          const today = new Date();
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(today.getMonth() - 1);
          
          const twoMonthsAgo = new Date(today);
          twoMonthsAgo.setMonth(today.getMonth() - 2);
          
          // Calculate weekly total
          const weeklyTotal = sales.reduce((sum, sale) => {
            const saleDate = new Date(sale.date);
            if (saleDate >= oneWeekAgo && saleDate <= today) {
              return sum + sale.total;
            }
            return sum;
          }, 0);
          
          // Calculate monthly total
          const monthlyTotal = sales.reduce((sum, sale) => {
            const saleDate = new Date(sale.date);
            if (saleDate >= oneMonthAgo && saleDate <= today) {
              return sum + sale.total;
            }
            return sum;
          }, 0);
          
          // Calculate previous month's total for percentage change
          const previousMonthTotal = sales.reduce((sum, sale) => {
            const saleDate = new Date(sale.date);
            if (saleDate >= twoMonthsAgo && saleDate < oneMonthAgo) {
              return sum + sale.total;
            }
            return sum;
          }, 0);
          
          // Calculate percentage change
          let percentageChange = 0;
          if (previousMonthTotal > 0) {
            percentageChange = ((monthlyTotal - previousMonthTotal) / previousMonthTotal) * 100;
          }
          
          setSalesPerformance({
            weeklyTotal,
            monthlyTotal,
            percentageChange: Math.round(percentageChange * 10) / 10 // Round to 1 decimal place
          });
          
          // Calculate profit analysis
          const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
          const totalFeedCost = feedPurchases.reduce((sum, purchase) => sum + purchase.cost, 0);
          const netProfit = totalSales - totalFeedCost;
          const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
          
          setProfitAnalysis({
            totalSales,
            totalFeedCost,
            netProfit,
            profitMargin: Math.round(profitMargin * 10) / 10 // Round to 1 decimal place
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'salesRecords' || e.key === 'feedPurchases') {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Performance</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Weekly Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${salesPerformance.weeklyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Monthly Total</span>
            <span className={`text-xs font-medium ${salesPerformance.percentageChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {salesPerformance.percentageChange > 0 ? '+' : ''}{salesPerformance.percentageChange}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${salesPerformance.monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        {/* Profit Analysis Section */}
        <div className="pt-4 border-t border-gray-200 mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">Profit Analysis</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Sales</span>
              </div>
              <div className="text-lg font-bold text-emerald-600">
                ${profitAnalysis.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Feed Costs</span>
              </div>
              <div className="text-lg font-bold text-red-600">
                -${profitAnalysis.totalFeedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Net Profit</span>
                <span className={`text-xs font-medium ${profitAnalysis.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitAnalysis.profitMargin.toFixed(1)}% margin
                </span>
              </div>
              <div className={`text-xl font-bold ${profitAnalysis.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ${profitAnalysis.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPerformanceCard;
