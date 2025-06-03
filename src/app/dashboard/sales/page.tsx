"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// Types for our sales data
type Customer = {
  id: string;
  name: string;
};

type EggProduction = {
  id: string;
  name: string;
};

type Sale = {
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
};

export default function SalesPage() {
  // Mock data for customers
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "juan" },
    { id: "2", name: "Juan Sanchez's" },
    { id: "3", name: "machelle" },
    { id: "4", name: "michael" },
    { id: "5", name: "natasha" },
    { id: "6", name: "Peter" },
    { id: "7", name: "sage" },
  ]);

  // Mock data for egg production records
  const [eggProductions, setEggProductions] = useState<EggProduction[]>([
    { id: "1", name: "Free Range Eggs" },
    { id: "2", name: "Organic Eggs" },
    { id: "3", name: "Duck Eggs" },
    { id: "4", name: "Quail Eggs" },
  ]);

  // Mock data for sales
  const [sales, setSales] = useState<Sale[]>([
    { 
      id: "1", 
      date: "2025-06-02", 
      customerId: "4", 
      customerName: "michael", 
      eggProductionId: "1",
      eggProductionName: "Free Range Eggs",
      dozens: 3.00, 
      pricePerDozen: 6.00, 
      total: 18.00,
      pickupMethod: "Pickup in Person",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      notes: ""
    }
  ]);

  // State for the new sale form
  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split('T')[0],
    customerId: "",
    eggProductionId: "",
    dozens: 0,
    pricePerDozen: 6.00,
    pickupMethod: "Pickup in Person",
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    notes: ""
  });

  // State for current month filter
  const [showCurrentMonthOnly, setShowCurrentMonthOnly] = useState(true);
  
  // Calculate sales summary
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalDozens: 0,
    averagePrice: 0
  });

  // Create a memoized filtered sales array to prevent infinite re-renders
  const filteredSales = useMemo(() => {
    return showCurrentMonthOnly 
      ? sales.filter(sale => {
          const saleMonth = new Date(sale.date).getMonth();
          const saleYear = new Date(sale.date).getFullYear();
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          return saleMonth === currentMonth && saleYear === currentYear;
        })
      : sales;
  }, [sales, showCurrentMonthOnly]);

  // Update sales summary when filtered sales change
  useEffect(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalDozens = filteredSales.reduce((sum, sale) => sum + sale.dozens, 0);
    const averagePrice = totalDozens > 0 ? totalSales / totalDozens : 0;
    
    setSalesSummary({
      totalSales,
      totalDozens,
      averagePrice
    });
  }, [filteredSales]);  // This dependency is correct, but there might be an issue elsewhere

  // Calculate total for new sale
  const calculateTotal = () => {
    return newSale.dozens * newSale.pricePerDozen;
  };

  // Handle input change for new sale form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSale(prev => ({
      ...prev,
      [name]: name === "dozens" || name === "pricePerDozen" ? parseFloat(value) || 0 : value
    }));
  };

  // Handle adding a new sale
  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newSale.customerId === "") {
      alert("Please select a customer");
      return;
    }
    
    if (newSale.eggProductionId === "") {
      alert("Please select an egg production record");
      return;
    }
    
    if (newSale.dozens <= 0) {
      alert("Please enter a valid number of dozens");
      return;
    }
    
    const selectedCustomer = customers.find(c => c.id === newSale.customerId);
    const selectedEggProduction = eggProductions.find(e => e.id === newSale.eggProductionId);
    
    if (!selectedCustomer || !selectedEggProduction) {
      alert("Invalid selection");
      return;
    }
    
    const saleTotal = calculateTotal();
    const newSaleId = (sales.length + 1).toString();
    
    // Add the new sale
    const sale: Sale = {
      id: newSaleId,
      date: newSale.date,
      customerId: newSale.customerId,
      customerName: selectedCustomer.name,
      eggProductionId: newSale.eggProductionId,
      eggProductionName: selectedEggProduction.name,
      dozens: newSale.dozens,
      pricePerDozen: newSale.pricePerDozen,
      total: saleTotal,
      pickupMethod: newSale.pickupMethod,
      paymentMethod: newSale.paymentMethod,
      paymentStatus: newSale.paymentStatus,
      notes: newSale.notes
    };
    
    setSales([sale, ...sales]);
    
    // Reset form
    setNewSale({
      date: new Date().toISOString().split('T')[0],
      customerId: "",
      eggProductionId: "",
      dozens: 0,
      pricePerDozen: 6.00,
      pickupMethod: "Pickup in Person",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      notes: ""
    });
  };

  // Handle editing a sale
  const handleEditSale = (id: string) => {
    alert(`Edit functionality for sale ${id} would be implemented here`);
  };

  // Handle deleting a sale
  const handleDeleteSale = (id: string) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  // Handle adding a new egg production record
  const handleAddEggProduction = () => {
    const name = prompt("Enter name for new egg production record:");
    if (name && name.trim() !== "") {
      const newId = (eggProductions.length + 1).toString();
      setEggProductions([...eggProductions, { id: newId, name }]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        {/* Sales Management Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-amber-900">Sales Management</h1>
                <p className="text-amber-800">Manage sales and attach customers</p>
              </div>
              <div>
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>

            {/* Add New Sale Form */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">Add New Sale</h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleAddSale} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sale Date */}
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-amber-700 mb-1">
                        Sale Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={newSale.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Customer */}
                    <div>
                      <label htmlFor="customerId" className="block text-sm font-medium text-amber-700 mb-1">
                        Customer
                      </label>
                      <select
                        id="customerId"
                        name="customerId"
                        value={newSale.customerId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select Customer</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Egg Production Record */}
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label htmlFor="eggProductionId" className="block text-sm font-medium text-amber-700 mb-1">
                          Egg Production Record
                        </label>
                        <select
                          id="eggProductionId"
                          name="eggProductionId"
                          value={newSale.eggProductionId}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select Egg Production</option>
                          {eggProductions.map((production) => (
                            <option key={production.id} value={production.id}>
                              {production.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddEggProduction}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add New
                      </button>
                    </div>

                    {/* Price Per Dozen */}
                    <div>
                      <label htmlFor="pricePerDozen" className="block text-sm font-medium text-amber-700 mb-1">
                        Price Per Dozen
                      </label>
                      <input
                        type="number"
                        id="pricePerDozen"
                        name="pricePerDozen"
                        value={newSale.pricePerDozen}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Dozens Purchased */}
                    <div>
                      <label htmlFor="dozens" className="block text-sm font-medium text-amber-700 mb-1">
                        Dozens Purchased
                      </label>
                      <input
                        type="number"
                        id="dozens"
                        name="dozens"
                        value={newSale.dozens}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Pickup Method */}
                    <div>
                      <label htmlFor="pickupMethod" className="block text-sm font-medium text-amber-700 mb-1">
                        Pickup Method
                      </label>
                      <select
                        id="pickupMethod"
                        name="pickupMethod"
                        value={newSale.pickupMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Pickup in Person">Pickup in Person</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Shipping">Shipping</option>
                      </select>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label htmlFor="paymentMethod" className="block text-sm font-medium text-amber-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={newSale.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Venmo">Venmo</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Check">Check</option>
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div>
                      <label htmlFor="paymentStatus" className="block text-sm font-medium text-amber-700 mb-1">
                        Payment Status
                      </label>
                      <select
                        id="paymentStatus"
                        name="paymentStatus"
                        value={newSale.paymentStatus}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-amber-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={newSale.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter any notes about this sale (optional)"
                    />
                  </div>

                  {/* Total and Submit */}
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-amber-900">
                      Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Add Sale
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sales Records */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">Sales Records</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-amber-700">
                    {showCurrentMonthOnly ? "Showing current month only" : "Showing all sales"}
                  </span>
                  <button
                    onClick={() => setShowCurrentMonthOnly(!showCurrentMonthOnly)}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm"
                  >
                    {showCurrentMonthOnly ? "Show All Sales" : "Show Current Month"}
                  </button>
                </div>
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
                        Price/Dozen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Dozens
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          ${sale.pricePerDozen.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.dozens.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                          ${sale.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditSale(sale.id)}
                              className="px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </span>
                            </button>
                            <button 
                              onClick={() => handleDeleteSale(sale.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSales.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No sales found for the selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales Summary */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">Sales Summary</h2>
                <span className="text-sm text-amber-700">
                  {showCurrentMonthOnly ? "Showing current month only" : "Showing all time"}
                </span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-sm font-medium text-green-800 mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold text-green-700">${salesSummary.totalSales.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Total Dozens Sold</h3>
                    <p className="text-2xl font-bold text-blue-700">{salesSummary.totalDozens.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="text-sm font-medium text-purple-800 mb-2">Average Price/Dozen</h3>
                    <p className="text-2xl font-bold text-purple-700">${salesSummary.averagePrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
