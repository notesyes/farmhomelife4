import { SalesSummary } from "@/types";

const SalesSummaryCard: React.FC = () => {
  // Mock data for sales summary
  const salesSummary: SalesSummary = {
    totalRevenue: 1179.25,
    pendingOrders: 2
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Summary</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            ${salesSummary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Pending Orders</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {salesSummary.pendingOrders}
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            Manage Customers
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesSummaryCard;
