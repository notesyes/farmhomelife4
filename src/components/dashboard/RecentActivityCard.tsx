import { useState, useEffect } from "react";

interface Sale {
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
}

interface FeedPurchase {
  id: string;
  date: string;
  feedType: string;
  brand: string;
  quantity: number; // in pounds
  cost: number; // total cost
  notes: string;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  customer: string;
  description: string;
  total: number;
}

const RecentActivityCard = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  
  // Load sales and feed purchase data from localStorage
  useEffect(() => {
    try {
      // Load sales data
      const savedSales = localStorage.getItem('salesRecords');
      let salesData: Sale[] = [];
      if (savedSales) {
        salesData = JSON.parse(savedSales);
      }
      
      // Load feed purchase data
      const savedFeedPurchases = localStorage.getItem('feedPurchases');
      let feedPurchaseData: FeedPurchase[] = [];
      if (savedFeedPurchases) {
        feedPurchaseData = JSON.parse(savedFeedPurchases);
      }
      
      // Convert sales to transactions
      const salesTransactions = salesData.map(sale => ({
        id: sale.id,
        date: sale.date,
        type: 'sale',
        customer: sale.customerName,
        description: `${sale.dozens} dozen ${sale.eggProductionName}`,
        total: sale.total
      }));
      
      // Convert feed purchases to transactions
      const feedTransactions = feedPurchaseData.map(purchase => ({
        id: purchase.id,
        date: purchase.date,
        type: 'purchase',
        customer: purchase.brand,
        description: `${purchase.quantity} lbs of ${purchase.feedType} feed`,
        total: purchase.cost
      }));
      
      // Combine and sort by date (newest first)
      const allTransactions = [...salesTransactions, ...feedTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5); // Show only the 5 most recent transactions
      
      setRecentTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transaction data:', error);
      setRecentTransactions([]);
    }
  }, []);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          View all
        </button>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      transaction.type === "sale" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {transaction.type === "sale" ? "Sale" : "Purchase"}
                    </span>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-600">
                    {transaction.customer}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-600">
                    {transaction.description}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    ${transaction.total.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-2 py-4 text-sm text-center text-gray-500">
                  No recent transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityCard;
