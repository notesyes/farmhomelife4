import Link from "next/link";

const DashboardSidebar: React.FC = () => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊", current: true },
    { name: "Production", href: "/dashboard/production", icon: "🥚", current: false },
    { name: "Inventory", href: "/dashboard/inventory", icon: "📦", current: false },
    { name: "Customers", href: "/dashboard/customers", icon: "👥", current: false },
    { name: "Sales", href: "/dashboard/sales", icon: "💰", current: false },
    { name: "Reports", href: "/dashboard/reports", icon: "📈", current: false },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️", current: false },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-emerald-700">
          {/* Sidebar Header / Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-emerald-800">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">🏡 Farm Home Life</span>
            </Link>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${
                      item.current
                        ? "bg-emerald-800 text-white"
                        : "text-emerald-100 hover:bg-emerald-600 hover:text-white"
                    }
                  `}
                >
                  <span className="mr-3 h-6 w-6 flex items-center justify-center text-lg">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="flex-shrink-0 flex border-t border-emerald-800 p-4">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Doe</p>
                <Link href="/dashboard/profile" className="text-xs font-medium text-emerald-200 hover:text-white">
                  View profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
