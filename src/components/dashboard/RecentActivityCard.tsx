import { Transaction } from "@/types";

const RecentActivityCard: React.FC = () => {
  // Mock data for recent transactions
  const recentTransactions: Transaction[] = [
    {
      id: "tx-001",
      date: "2025-06-02",
      type: "sale",
      customer: "Sunrise Cafe",
      quantity: 12,
      total: 35.85
    },
    {
      id: "tx-002",
      date: "2025-06-01",
      type: "sale",
      customer: "Fresh n' Local",
      quantity: 30,
      total: 90.00
    },
    {
      id: "tx-003",
      date: "2025-05-31",
      type: "sale",
      customer: "Green Valley Market",
      quantity: 8,
      total: 22.80
    },
    {
      id: "tx-004",
      date: "2025-05-30",
      type: "sale",
      customer: "Local Bakery",
      quantity: 12,
      total: 36.00
    }
  ];

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
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    transaction.type === "sale" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {transaction.type === "sale" ? "Sale" : "Purchase"}
                  </span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-600">
                  {transaction.customer}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  ${transaction.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityCard;
