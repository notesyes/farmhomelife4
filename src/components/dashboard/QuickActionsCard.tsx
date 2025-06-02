import { QuickAction } from "@/types";

const QuickActionsCard: React.FC = () => {
  // Mock data for quick actions
  const quickActions: QuickAction[] = [
    {
      id: "record-production",
      label: "Record Production",
      icon: "📝",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      id: "new-sale",
      label: "New Sale",
      icon: "💰",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      id: "feed-stock",
      label: "Feed Stock",
      icon: "🌾",
      color: "bg-yellow-500 hover:bg-yellow-600"
    },
    {
      id: "health-check",
      label: "Health Check",
      icon: "🩺",
      color: "bg-red-500 hover:bg-red-600"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            className={`${action.color} text-white rounded-lg py-3 px-4 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${action.color.split(' ')[0]}`}
          >
            <span className="text-xl mr-2">{action.icon}</span>
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
