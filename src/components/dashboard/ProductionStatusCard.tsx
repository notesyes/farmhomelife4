import { ProductionStatus } from "@/types";

const ProductionStatusCard: React.FC = () => {
  // Mock data for production status
  const productionStatus: ProductionStatus = {
    fresh: 127,
    washed: 68,
    packed: 124,
    sold: 23
  };

  // Calculate total for percentages
  const total = Object.values(productionStatus).reduce((sum, value) => sum + value, 0);

  // Calculate percentages for each status
  const getPercentage = (value: number) => Math.round((value / total) * 100);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Production Status</h3>
        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Fresh Eggs */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Fresh</span>
            <span className="text-xs font-medium text-gray-500">{getPercentage(productionStatus.fresh)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${getPercentage(productionStatus.fresh)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xl font-bold text-gray-800">{productionStatus.fresh}</div>
        </div>

        {/* Washed Eggs */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Washed</span>
            <span className="text-xs font-medium text-gray-500">{getPercentage(productionStatus.washed)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${getPercentage(productionStatus.washed)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xl font-bold text-gray-800">{productionStatus.washed}</div>
        </div>

        {/* Packed Eggs */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Packed</span>
            <span className="text-xs font-medium text-gray-500">{getPercentage(productionStatus.packed)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500" 
              style={{ width: `${getPercentage(productionStatus.packed)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xl font-bold text-gray-800">{productionStatus.packed}</div>
        </div>

        {/* Sold Eggs */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Sold</span>
            <span className="text-xs font-medium text-gray-500">{getPercentage(productionStatus.sold)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500" 
              style={{ width: `${getPercentage(productionStatus.sold)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xl font-bold text-gray-800">{productionStatus.sold}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductionStatusCard;
