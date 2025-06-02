import { SalesPerformance } from "@/types";

const SalesPerformanceCard: React.FC = () => {
  // Mock data for sales performance
  const salesPerformance: SalesPerformance = {
    weeklyTotal: 386.50,
    monthlyTotal: 1524.80,
    percentageChange: 8.2
  };

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
        
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPerformanceCard;
