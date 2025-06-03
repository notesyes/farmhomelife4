"use client";

import Link from "next/link";
import { useState } from "react";

const DashboardSidebar: React.FC = () => {
  const [navItems, setNavItems] = useState([
    { name: "Dashboard", href: "/dashboard", icon: "📊", current: true, canDelete: false },
    { name: "Incubation", href: "/dashboard/incubation", icon: "🐥", current: false, canDelete: false },
    { name: "Inventory", href: "/dashboard/inventory", icon: "📦", current: false, canDelete: true },
    { name: "Customers", href: "/dashboard/customers", icon: "👥", current: false, canDelete: false },
    { name: "Sales", href: "/dashboard/sales", icon: "💰", current: false, canDelete: false },
    { name: "Reports", href: "/dashboard/reports", icon: "📈", current: false, canDelete: true },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️", current: false, canDelete: false },
  ]);
  
  // Function to handle deleting a navigation item
  const handleDeleteNavItem = (itemName: string) => {
    if (confirm(`Are you sure you want to delete the ${itemName} section from the sidebar?`)) {
      setNavItems(navItems.filter(item => item.name !== itemName));
    }
  };

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
              {navItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <Link
                    href={item.href}
                    className={`
                      flex-grow group flex items-center px-2 py-2 text-sm font-medium rounded-md
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
                  {item.canDelete && (
                    <button
                      onClick={() => handleDeleteNavItem(item.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-emerald-200 hover:text-white hover:bg-red-600 rounded-full"
                      title={`Delete ${item.name}`}
                      aria-label={`Delete ${item.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
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
