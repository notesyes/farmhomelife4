"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearch } from "@/components/SearchContext";
import SearchResults from "./SearchResults";

const DashboardHeader: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [paymentData] = useState({
    currentPlan: "Premium Farm",
    nextBillingDate: "July 3, 2025",
    amount: "$29.99",
    lastPayment: {
      date: "June 3, 2025",
      amount: "$29.99",
      status: "Paid"
    },
    paymentMethod: {
      type: "Credit Card",
      last4: "4242",
      expiry: "12/26"
    }
  });
  const profileRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Get search context
  const { searchQuery, setSearchQuery, performSearch, clearSearch } = useSearch();
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (paymentRef.current && !paymentRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  
  const togglePaymentDropdown = () => {
    setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
  };
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - visible on mobile only */}
          <div className="flex items-center lg:hidden">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-emerald-600">🏡 Farm Home Life</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search across all data..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setShowSearchResults(true);
                    performSearch(e.target.value);
                  } else {
                    setShowSearchResults(false);
                    clearSearch();
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setShowSearchResults(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    performSearch(searchQuery);
                  } else if (e.key === 'Escape') {
                    clearSearch();
                    setShowSearchResults(false);
                    searchInputRef.current?.blur();
                  }
                }}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    clearSearch();
                    setShowSearchResults(false);
                  }}
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              {showSearchResults && searchQuery && <SearchResults />}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Payment Information */}
            <div className="relative" ref={paymentRef}>
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 relative"
                onClick={togglePaymentDropdown}
                aria-label="View payment information"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full">$</span>
              </button>
              
              {/* Payment Dropdown */}
              {isPaymentDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-4">
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">Subscription Details</h3>
                    <p className="text-sm text-gray-500">Manage your payment information</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Current Plan:</span>
                      <span className="text-sm font-semibold text-gray-900">{paymentData.currentPlan}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Next Billing:</span>
                      <span className="text-sm font-semibold text-gray-900">{paymentData.nextBillingDate}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Amount:</span>
                      <span className="text-sm font-semibold text-gray-900">{paymentData.amount}/month</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {paymentData.paymentMethod.type} ending in {paymentData.paymentMethod.last4}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Last Payment:</span>
                        <span className="text-sm font-semibold text-green-600">
                          {paymentData.lastPayment.amount} • {paymentData.lastPayment.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Link href="/dashboard/billing" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                      Billing History
                    </Link>
                    <Link href="/dashboard/subscription" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                      Manage Subscription
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={toggleProfileDropdown}
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">John Doe</span>
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {isProfileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
