import { SalesSummary } from "@/types";
import { useState, useEffect } from "react";
import { Sale } from "@/types";

const SalesSummaryCard: React.FC = () => {
  const [salesSummary, setSalesSummary] = useState<SalesSummary>({
    totalRevenue: 0,
    pendingOrders: 0,
    yearlyRevenue: 0,
    yearlyOrders: 0
  });

  useEffect(() => {
    // Load sales data from localStorage
    const loadSalesData = () => {
      try {
        const savedSales = localStorage.getItem('salesRecords');
        if (savedSales) {
          const sales: Sale[] = JSON.parse(savedSales);
          
          // Calculate yearly revenue
          const currentYear = new Date().getFullYear();
          const yearlyRevenue = sales.reduce((sum, sale) => {
            const saleDate = new Date(sale.date);
            if (saleDate.getFullYear() === currentYear) {
              return sum + sale.total;
            }
            return sum;
          }, 0);
          
          // Count yearly orders
          const yearlyOrders = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getFullYear() === currentYear;
          }).length;
          
          // Count pending orders
          const pendingOrders = sales.filter(sale => sale.paymentStatus === "Pending").length;
          
          // Calculate total revenue (all time)
          const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
          
          setSalesSummary({
            totalRevenue,
            pendingOrders,
            yearlyRevenue,
            yearlyOrders
          });
        }
      } catch (error) {
        console.error('Error loading sales data:', error);
      }
    };
    
    loadSalesData();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'salesRecords') {
        loadSalesData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Summary {new Date().getFullYear()}</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Yearly Revenue</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            ${salesSummary.yearlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Yearly Orders</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {salesSummary.yearlyOrders}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Total Revenue (All Time)</span>
          </div>
          <div className="text-xl font-bold text-amber-600">
            ${salesSummary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Pending Orders</span>
          </div>
          <div className="text-xl font-bold text-gray-800">
            {salesSummary.pendingOrders}
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default SalesSummaryCard;
