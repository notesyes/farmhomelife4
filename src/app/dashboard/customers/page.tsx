"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// Types for our customer data
type Customer = {
  id: string;
  name: string;
  dozensPurchased: number;
  totalSales: number;
};

type Sale = {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  dozens: number;
  pricePerDozen: number;
  total: number;
};

export default function CustomersPage() {
  // Mock data for customers
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "juan", dozensPurchased: 3.00, totalSales: 18.00 },
    { id: "2", name: "Juan Sanchez's", dozensPurchased: 0.00, totalSales: 0.00 },
    { id: "3", name: "machelle", dozensPurchased: 0.00, totalSales: 0.00 },
    { id: "4", name: "michael", dozensPurchased: 3.00, totalSales: 18.00 },
    { id: "5", name: "natasha", dozensPurchased: 0.00, totalSales: 0.00 },
    { id: "6", name: "Peter", dozensPurchased: 0.00, totalSales: 0.00 },
    { id: "7", name: "sage", dozensPurchased: 1.00, totalSales: 6.00 },
  ]);

  // Mock data for recent sales
  const [recentSales, setRecentSales] = useState<Sale[]>([
    { 
      id: "1", 
      date: "2025-06-02", 
      customerId: "4", 
      customerName: "michael", 
      dozens: 3.00, 
      pricePerDozen: 6.00, 
      total: 18.00 
    },
    { 
      id: "2", 
      date: "2025-04-23", 
      customerId: "7", 
      customerName: "sage", 
      dozens: 1.00, 
      pricePerDozen: 6.00, 
      total: 6.00 
    },
    { 
      id: "3", 
      date: "2025-04-23", 
      customerId: "1", 
      customerName: "juan", 
      dozens: 3.00, 
      pricePerDozen: 6.00, 
      total: 18.00 
    },
  ]);

  // State for the new customer form
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: ""
  });

  // State for the new sale form
  const [isAddingSale, setIsAddingSale] = useState(false);
  const [newSale, setNewSale] = useState({
    customerId: "",
    dozens: 0,
    pricePerDozen: 6.00
  });

  // Function to handle adding a new customer
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCustomer.name.trim() === "") {
      alert("Please enter a customer name");
      return;
    }
    
    const newCustomerId = (customers.length + 1).toString();
    
    setCustomers([
      ...customers,
      {
        id: newCustomerId,
        name: newCustomer.name,
        dozensPurchased: 0,
        totalSales: 0
      }
    ]);
    
    setNewCustomer({ name: "" });
    setIsAddingCustomer(false);
  };

  // Function to handle adding a new sale
  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newSale.customerId === "") {
      alert("Please select a customer");
      return;
    }
    
    if (newSale.dozens <= 0) {
      alert("Please enter a valid number of dozens");
      return;
    }
    
    const selectedCustomer = customers.find(c => c.id === newSale.customerId);
    
    if (!selectedCustomer) {
      alert("Invalid customer selected");
      return;
    }
    
    const saleTotal = newSale.dozens * newSale.pricePerDozen;
    const newSaleId = (recentSales.length + 1).toString();
    const today = new Date().toISOString().split('T')[0];
    
    // Add the new sale
    const sale: Sale = {
      id: newSaleId,
      date: today,
      customerId: newSale.customerId,
      customerName: selectedCustomer.name,
      dozens: newSale.dozens,
      pricePerDozen: newSale.pricePerDozen,
      total: saleTotal
    };
    
    setRecentSales([sale, ...recentSales]);
    
    // Update the customer's purchase data
    setCustomers(customers.map(customer => {
      if (customer.id === newSale.customerId) {
        return {
          ...customer,
          dozensPurchased: customer.dozensPurchased + newSale.dozens,
          totalSales: customer.totalSales + saleTotal
        };
      }
      return customer;
    }));
    
    setNewSale({
      customerId: "",
      dozens: 0,
      pricePerDozen: 6.00
    });
    
    setIsAddingSale(false);
  };

  // Function to handle downloading customer data as PDF
  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        {/* Customer Management Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-amber-900">Customer Management</h1>
                <p className="text-amber-800">Track customer purchases and sales</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">Customer Management</h2>
                <button
                  onClick={() => setIsAddingCustomer(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Add New Customer
                </button>
              </div>

              {/* Add Customer Form */}
              {isAddingCustomer && (
                <div className="p-4 bg-amber-50 border-b border-amber-100">
                  <form onSubmit={handleAddCustomer} className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label htmlFor="customerName" className="block text-sm font-medium text-amber-700 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ name: e.target.value })}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomer(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Add Sale Form */}
              {isAddingSale && (
                <div className="p-4 bg-amber-50 border-b border-amber-100">
                  <form onSubmit={handleAddSale} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="saleCustomer" className="block text-sm font-medium text-amber-700 mb-1">
                          Customer
                        </label>
                        <select
                          id="saleCustomer"
                          value={newSale.customerId}
                          onChange={(e) => setNewSale({ ...newSale, customerId: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select a customer</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="saleDozens" className="block text-sm font-medium text-amber-700 mb-1">
                          Dozens
                        </label>
                        <input
                          type="number"
                          id="saleDozens"
                          value={newSale.dozens}
                          onChange={(e) => setNewSale({ ...newSale, dozens: parseFloat(e.target.value) })}
                          min="0"
                          step="0.5"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="salePrice" className="block text-sm font-medium text-amber-700 mb-1">
                          Price per Dozen ($)
                        </label>
                        <input
                          type="number"
                          id="salePrice"
                          value={newSale.pricePerDozen}
                          onChange={(e) => setNewSale({ ...newSale, pricePerDozen: parseFloat(e.target.value) })}
                          min="0"
                          step="0.5"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Add Sale
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingSale(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Customer Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Dozens Purchased
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Total Sales
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {customer.dozensPurchased.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          ${customer.totalSales.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </span>
                            </button>
                            <button 
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                              onClick={() => {
                                // Filter sales for this customer
                                const customerSales = recentSales.filter(sale => sale.customerId === customer.id);
                                // Here you would normally navigate to a detailed view
                                alert(`${customerSales.length} sales found for ${customer.name}`);
                              }}
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Sales
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Add Sale Button */}
              <div className="p-4 border-t border-amber-200 bg-amber-50">
                <button
                  onClick={() => setIsAddingSale(true)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Add New Sale
                </button>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">Recent Sales</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Dozens
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Price/Dozen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.dozens.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          ${sale.pricePerDozen.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                          ${sale.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
