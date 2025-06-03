"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

// Types for our sales data
type Customer = {
  id: string;
  name: string;
  dozensPurchased?: number;
  totalSales?: number;
  email?: string;
  phone?: string;
  address?: string;
};

type EggProduction = {
  id: string;
  name: string;
  type: string;
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
  pickupDate?: string;
  pickupTime?: string;
  notes: string;
};

function SalesPageContent() {
  const searchParams = useSearchParams();
  const customerIdFilter = searchParams.get("customerId");

  // Customer data with localStorage persistence
  const [customers] = useState<Customer[]>(() => {
    if (typeof window !== "undefined") {
      const savedCustomers = localStorage.getItem("farmhomelife-customers");
      if (savedCustomers) {
        try {
          return JSON.parse(savedCustomers);
        } catch (e) {
          console.error("Error parsing saved customers:", e);
        }
      }
    }
    // Start with empty customer list
    return [];
  });

  // Egg production records matching inventory egg types
  const [eggProductions] = useState<EggProduction[]>([
    { id: "chicken", name: "Chicken Eggs", type: "Chicken" },
    { id: "duck", name: "Duck Eggs", type: "Duck" },
    { id: "quail", name: "Quail Eggs", type: "Quail" },
    { id: "goose", name: "Goose Eggs", type: "Goose" },
    { id: "turkey", name: "Turkey Eggs", type: "Turkey" },
  ]);

  // Sales data with localStorage persistence
  const [sales, setSales] = useState<Sale[]>(() => {
    if (typeof window !== "undefined") {
      const savedSales = localStorage.getItem("farmhomelife-sales");
      if (savedSales) {
        try {
          return JSON.parse(savedSales);
        } catch (e) {
          console.error("Error parsing saved sales:", e);
        }
      }
    }
    // Start with empty sales list
    return [];
  });

  // State for available egg dozens
  const [availableDozens, setAvailableDozens] = useState<{
    total: number;
    byType: Record<string, number>;
  }>({ total: 0, byType: {} });

  // Load available dozens from localStorage
  useEffect(() => {
    try {
      const savedDozens = localStorage.getItem("availableEggDozens");
      if (savedDozens) {
        setAvailableDozens(JSON.parse(savedDozens));
      }
    } catch (error) {
      console.error("Error loading available dozens from localStorage:", error);
    }
  }, []);

  // State for the new sale form
  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    eggProductionId: "",
    dozens: 0,
    pricePerDozen: 6.0,
    pickupMethod: "Pickup in Person",
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    pickupDate: new Date().toISOString().split("T")[0],
    pickupTime: "",
    notes: "",
  });

  // State for current month filter
  const [showCurrentMonthOnly] = useState(true);

  // Calculate sales summary
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalDozens: 0,
    averagePrice: 0,
  });

  // Save sales to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("farmhomelife-sales", JSON.stringify(sales));
    }
  }, [sales]);

  // Calculate daily revenue
  const dailyRevenue = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return sales
      .filter((sale) => sale.date === today)
      .reduce((sum, sale) => sum + sale.total, 0);
  }, [sales]);

  // Create a memoized filtered sales array
  const filteredSales = useMemo(() => {
    const filtered = customerIdFilter
      ? sales.filter((sale) => sale.customerId === customerIdFilter)
      : sales;

    return showCurrentMonthOnly
      ? filtered.filter((sale) => {
          const saleMonth = new Date(sale.date).getMonth();
          const saleYear = new Date(sale.date).getFullYear();
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          return saleMonth === currentMonth && saleYear === currentYear;
        })
      : filtered;
  }, [sales, showCurrentMonthOnly, customerIdFilter]);

  // Update sales summary when filtered sales change
  useEffect(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalDozens = filteredSales.reduce(
      (sum, sale) => sum + sale.dozens,
      0
    );
    const averagePrice = totalDozens > 0 ? totalSales / totalDozens : 0;

    setSalesSummary({
      totalSales,
      totalDozens,
      averagePrice,
    });
  }, [filteredSales]);

  // Handle input change for new sale form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({
      ...prev,
      [name]:
        name === "dozens" || name === "pricePerDozen"
          ? parseFloat(value) || 0
          : value,
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

    const selectedCustomer = customers.find((c) => c.id === newSale.customerId);
    const selectedEggProduction = eggProductions.find(
      (e) => e.id === newSale.eggProductionId
    );

    if (!selectedCustomer || !selectedEggProduction) {
      alert("Invalid selection");
      return;
    }

    const saleTotal = newSale.dozens * newSale.pricePerDozen;
    const newSaleId = `sale-${Date.now()}`;

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
      pickupDate: newSale.pickupDate,
      pickupTime: newSale.pickupTime,
      notes: newSale.notes,
    };

    const updatedSales = [sale, ...sales];
    setSales(updatedSales);

    // Reset form
    setNewSale({
      date: new Date().toISOString().split("T")[0],
      customerId: "",
      eggProductionId: "",
      dozens: 0,
      pricePerDozen: 6.0,
      pickupMethod: "Pickup in Person",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      pickupDate: new Date().toISOString().split("T")[0],
      pickupTime: "",
      notes: "",
    });

    alert("Sale added successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 bg-amber-50">
                <div className="flex items-center">
                  <button
                    className="flex items-center px-3 py-2 mr-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                    Back
                  </button>
                  <h2 className="text-lg font-medium text-amber-900">
                    Sales Summary
                  </h2>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <DashboardStatCard
                    value={availableDozens.total}
                    label="Dozens Available"
                    color="egg"
                    description="Eggs available for sale"
                    className="bg-white shadow-sm"
                  />
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-sm font-medium text-green-800 mb-2">
                      Daily Revenue
                    </h3>
                    <p className="text-2xl font-bold text-green-700">
                      ${dailyRevenue.toFixed(2)}
                    </p>
                    <span className="text-xs text-gray-500">
                      Today&apos;s sales
                    </span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-sm font-medium text-green-800 mb-2">
                      Total Sales
                    </h3>
                    <p className="text-2xl font-bold text-green-700">
                      ${salesSummary.totalSales.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                      Total Dozens Sold
                    </h3>
                    <p className="text-2xl font-bold text-blue-700">
                      {salesSummary.totalDozens.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 bg-amber-50">
                <h2 className="text-lg font-medium text-amber-900">
                  Add New Sale
                </h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleAddSale} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-amber-700 mb-1"
                      >
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={newSale.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="customerId"
                        className="block text-sm font-medium text-amber-700 mb-1"
                      >
                        Customer <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="customerId"
                        name="customerId"
                        value={newSale.customerId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="">Select Customer</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="eggProductionId"
                        className="block text-sm font-medium text-amber-700 mb-1"
                      >
                        Egg Production <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="eggProductionId"
                        name="eggProductionId"
                        value={newSale.eggProductionId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="">Select Egg Type</option>
                        {eggProductions.map((production) => (
                          <option key={production.id} value={production.id}>
                            {production.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="dozens"
                        className="block text-sm font-medium text-amber-700 mb-1"
                      >
                        Dozens <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="dozens"
                        name="dozens"
                        value={newSale.dozens === 0 ? "" : newSale.dozens}
                        onChange={handleInputChange}
                        min="0.25"
                        step="0.25"
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pricePerDozen"
                        className="block text-sm font-medium text-amber-700 mb-1"
                      >
                        Price per Dozen <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="pricePerDozen"
                        name="pricePerDozen"
                        value={newSale.pricePerDozen}
                        onChange={handleInputChange}
                        min="0"
                        step="0.25"
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="paymentMethod"
                        className="block text-sm font-medium text-amber-700 mb-1"
                      >
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
                        <option value="Check">Check</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Venmo">Venmo</option>
                        <option value="PayPal">PayPal</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-amber-700 mb-1"
                    >
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={newSale.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Any additional notes about this sale..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Add Sale
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-amber-50">
                <h2 className="text-lg font-medium text-amber-900">
                  Recent Sales
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Egg Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Dozens
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Price/Dozen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {filteredSales.length > 0 ? (
                      filteredSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-amber-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                            {sale.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                            {sale.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                            {sale.eggProductionName}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                sale.paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {sale.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No sales records found. Add your first sale above.
                        </td>
                      </tr>
                    )}
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

export default function SalesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalesPageContent />
    </Suspense>
  );
}
