"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/components/UserContext";
import Image from "next/image";

type NavItem = {
  name: string;
  href: string;
  icon: string;
  current: boolean;
};

const DashboardSidebar: React.FC = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([
    { name: "Dashboard", href: "/dashboard", icon: "📊", current: true },
    { name: "Incubation", href: "/dashboard/incubation", icon: "🐥", current: false },
    { name: "Inventory", href: "/dashboard/inventory", icon: "📦", current: false },
    { name: "Feed", href: "/dashboard/feed", icon: "🌾", current: false },
    { name: "Customers", href: "/dashboard/customers", icon: "👥", current: false },
    { name: "Sales", href: "/dashboard/sales", icon: "💰", current: false },
    { name: "Reports", href: "/dashboard/reports", icon: "📈", current: false },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️", current: false },
  ]);
  
  // Save navItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardNavItems', JSON.stringify(navItems));
  }, [navItems]);
  
  // Load navItems from localStorage on initial render
  useEffect(() => {
    const savedNavItems = localStorage.getItem('dashboardNavItems');
    if (savedNavItems) {
      try {
        const parsedItems = JSON.parse(savedNavItems);
        setNavItems(parsedItems);
      } catch (error) {
        console.error('Failed to parse saved nav items:', error);
      }
    }
  }, []);
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<number | null>(null);
  
  // No longer need the delete function since we removed the delete buttons
  
  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };
  
  const handleDragEnter = (index: number) => {
    setDraggedOverItem(index);
  };
  
  const handleDragEnd = () => {
    if (draggedItem !== null && draggedOverItem !== null && draggedItem !== draggedOverItem) {
      // Create a copy of the navItems array
      const newNavItems = [...navItems];
      
      // Remove the dragged item from its original position
      const draggedItemContent = newNavItems.splice(draggedItem, 1)[0];
      
      // Insert the dragged item at the new position
      newNavItems.splice(draggedOverItem, 0, draggedItemContent);
      
      // Update the state with the new order
      setNavItems(newNavItems);
    }
    
    // Reset drag state
    setDraggedItem(null);
    setDraggedOverItem(null);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    // Prevent default to allow drop
    e.preventDefault();
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
              {navItems.map((item, index) => (
                <div 
                  key={item.name} 
                  className={`flex items-center justify-between group cursor-move ${draggedItem === index ? 'opacity-50' : ''} ${draggedOverItem === index ? 'border-t-2 border-emerald-400' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
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
                    onClick={(e) => {
                      // Prevent navigation when dragging
                      if (draggedItem !== null) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <span className="mr-3 h-6 w-6 flex items-center justify-center text-lg">
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                  <div className="flex items-center">
                    <span className="mr-2 text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="flex-shrink-0 flex border-t border-emerald-800 p-4">
            <div className="flex items-center">
              <div>
                {/* Use the profile image from context */}
                <div className="inline-block h-9 w-9 rounded-full overflow-hidden">
                  <Image 
                    src={useUser().profileImage} 
                    alt="Profile"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{useUser().userName}</p>
                <div className="flex flex-col space-y-1 mt-1">
                  <Link href="/dashboard/profile" className="text-xs font-medium text-emerald-200 hover:text-white">
                    Your Profile
                  </Link>
                  <Link href="/dashboard/settings" className="text-xs font-medium text-emerald-200 hover:text-white">
                    Settings
                  </Link>
                  <Link href="/" className="text-xs font-medium text-emerald-200 hover:text-white">
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
