"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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

// Define inventory record type to match inventory page
type InventoryRecord = {
  id: string;
  date: string;
  eggCount: number;
  pickupTime: string;
  pickupMethod: string;
  eggType: string;
  broken: number;
  incubated: number;
  weather: string;
  notes: string;
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

export default function SalesPage() {
  const searchParams = useSearchParams();
  const customerIdFilter = searchParams.get('customerId');

  // Customer data with localStorage persistence
  const [customers, setCustomers] = useState<Customer[]>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedCustomers = localStorage.getItem('farmhomelife-customers');
      if (savedCustomers) {
        try {
          return JSON.parse(savedCustomers);
        } catch (e) {
          console.error('Error parsing saved customers:', e);
        }
      }
    }
    // Default initial data
    return [
      { id: "1", name: "juan" },
      { id: "2", name: "jane" },
      { id: "3", name: "bob" },
      { id: "4", name: "michael" },
      { id: "5", name: "natasha" },
      { id: "6", name: "Peter" },
      { id: "7", name: "sage" },
    ];
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
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedSales = localStorage.getItem('farmhomelife-sales');
      if (savedSales) {
        try {
          return JSON.parse(savedSales);
        } catch (e) {
          console.error('Error parsing saved sales:', e);
        }
      }
    }
    // Default initial data
    return [
      { 
        id: "1", 
        date: "2025-06-02", 
        customerId: "4", 
        customerName: "michael", 
        eggProductionId: "chicken",
        eggProductionName: "Chicken Eggs",
        dozens: 3.00, 
        pricePerDozen: 6.00, 
        total: 18.00,
        pickupMethod: "Pickup in Person",
        paymentMethod: "Cash",
        paymentStatus: "Paid",
        notes: ""
      }
    ];
  });

  // State for available egg dozens
  const [availableDozens, setAvailableDozens] = useState<{total: number, byType: Record<string, number>}>({ total: 0, byType: {} });
  
  // Load available dozens from localStorage
  useEffect(() => {
    try {
      const savedDozens = localStorage.getItem('availableEggDozens');
      if (savedDozens) {
        setAvailableDozens(JSON.parse(savedDozens));
      }
    } catch (error) {
      console.error('Error loading available dozens from localStorage:', error);
    }
  }, []);
  
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
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: "",
    notes: ""
  });

  // State for current month filter
  const [showCurrentMonthOnly, setShowCurrentMonthOnly] = useState(true);
  
  // State for showing customer modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<{ name: string; email: string; phone: string; address: string; }>({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '' 
  });
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  
  // State for edit sale modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  
  // Calculate sales summary
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalDozens: 0,
    averagePrice: 0
  });

  // Save sales to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmhomelife-sales', JSON.stringify(sales));
    }
  }, [sales]);

  // Calculate daily revenue
  const dailyRevenue = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    return sales
      .filter(sale => sale.date === today)
      .reduce((sum, sale) => sum + sale.total, 0);
  }, [sales]);

  // Create a memoized filtered sales array to prevent infinite re-renders
  const filteredSales = useMemo(() => {
    // First filter by customer ID if present
    const filtered = customerIdFilter
      ? sales.filter(sale => sale.customerId === customerIdFilter)
      : sales;
    
    // Then filter by current month if needed
    return showCurrentMonthOnly 
      ? filtered.filter(sale => {
          const saleMonth = new Date(sale.date).getMonth();
          const saleYear = new Date(sale.date).getFullYear();
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          return saleMonth === currentMonth && saleYear === currentYear;
        })
      : filtered;
  }, [sales, showCurrentMonthOnly, customerIdFilter]);

  // Save sales to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmhomelife-sales', JSON.stringify(sales));
    }
  }, [sales]);

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
  }, [filteredSales]);

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
    console.log("Adding new sale...");
    
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
    
    // Check if enough inventory is available
    const eggType = selectedEggProduction.type;
    const availableDozensByType = availableDozens.byType[eggType] || 0;
    
    if (newSale.dozens > availableDozensByType) {
      alert(`Not enough ${eggType} eggs in inventory. Only ${availableDozensByType.toFixed(1)} dozens available.`);
      return;
    }
    
    const saleTotal = calculateTotal();
    const newSaleId = `sale-${Date.now()}`; // Use timestamp for unique ID
    
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
      pickupDate: newSale.pickupDate,
      pickupTime: newSale.pickupTime,
      notes: newSale.notes
    };
    
    // Update sales state with the new sale at the beginning of the array
    const updatedSales = [sale, ...sales];
    setSales(updatedSales);
    
    console.log("Sale added:", sale);
    
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
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: "",
      notes: ""
    });
    
    // Update inventory by reducing the sold eggs
    try {
      // Get current inventory records
      const savedRecords = localStorage.getItem('inventoryRecords');
      if (savedRecords) {
        const inventoryRecords = JSON.parse(savedRecords);
        
        // Calculate eggs to deduct (dozens * 12)
        const eggsToDeduct = newSale.dozens * 12;
        let remainingToDeduct = eggsToDeduct;
        
        // Find records with the matching egg type and available eggs
        const updatedRecords = inventoryRecords.map((record: InventoryRecord) => {
          // Skip if not the right egg type or all eggs already deducted
          if (record.eggType !== selectedEggProduction.type || remainingToDeduct <= 0) {
            return record;
          }
          
          // Calculate available eggs in this record
          // We only count eggs that are not marked as incubated (which includes sold eggs)
          const availableEggs = record.eggCount - record.incubated;
          if (availableEggs <= 0) {
            return record;
          }
          
          // Deduct eggs from this record
          const deductFromThisRecord = Math.min(availableEggs, remainingToDeduct);
          remainingToDeduct -= deductFromThisRecord;
          
          // Mark these eggs as sold by adding to incubated (using incubated field as a workaround)
          return {
            ...record,
            incubated: record.incubated + deductFromThisRecord
          };
        });
        
        // Save updated inventory back to localStorage
        localStorage.setItem('inventoryRecords', JSON.stringify(updatedRecords));
        
        // Recalculate available dozens based on updated inventory
        // This ensures our available dozens calculation is consistent
        const eggTypeMap: Record<string, number> = {};
        
        // Calculate total available eggs by type
        updatedRecords.forEach((record: InventoryRecord) => {
          const availableEggs = record.eggCount - record.incubated;
          if (availableEggs > 0) {
            if (eggTypeMap[record.eggType]) {
              eggTypeMap[record.eggType] += availableEggs;
            } else {
              eggTypeMap[record.eggType] = availableEggs;
            }
          }
        });
        
        // Convert to dozens and update state
        const byType: Record<string, number> = {};
        let totalDozens = 0;
        
        Object.entries(eggTypeMap).forEach(([type, count]) => {
          const dozens = parseFloat((count / 12).toFixed(1));
          byType[type] = dozens;
          totalDozens += dozens;
        });
        
        const newAvailableDozens = {
          total: totalDozens,
          byType
        };
        
        setAvailableDozens(newAvailableDozens);
        localStorage.setItem('availableDozens', JSON.stringify(newAvailableDozens));
      }
    } catch (error) {
      console.error('Error updating inventory after sale:', error);
    }
    
    // Show confirmation
    alert("Sale added successfully!");
  };

  // Handle opening edit modal
  const handleEditSale = (id: string) => {
    const saleToEdit = sales.find(sale => sale.id === id);
    if (saleToEdit) {
      setEditingSale(saleToEdit);
      setShowEditModal(true);
    }
  };

  // Handle saving edited sale
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSale) return;
    
    // Update the sale in the sales array
    const updatedSales = sales.map(sale => 
      sale.id === editingSale.id ? editingSale : sale
    );
    
    // Update state and localStorage
    setSales(updatedSales);
    localStorage.setItem('salesRecords', JSON.stringify(updatedSales));
    
    // Close the modal
    setShowEditModal(false);
    setEditingSale(null);
    
    // Show confirmation
    alert("Sale updated successfully!");
  };

  // Handle opening delete confirmation modal
  const handleDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Handle confirming delete
  const handleDeleteConfirm = () => {
    if (saleToDelete) {
      // Get the sale to be deleted
      const saleToRemove = sales.find(sale => sale.id === saleToDelete);
      
      if (saleToRemove) {
        // Filter out the deleted sale
        const updatedSales = sales.filter(sale => sale.id !== saleToDelete);
        setSales(updatedSales);
        localStorage.setItem('salesRecords', JSON.stringify(updatedSales));
        
        // If the sale was paid, we need to add the eggs back to inventory
        if (saleToRemove.paymentStatus === 'Paid') {
          try {
            // Get the egg type from the sale
            const eggProduction = eggProductions.find(ep => ep.id === saleToRemove.eggProductionId);
            
            if (eggProduction && eggProduction.type) {
              // Get current inventory records
              const savedRecords = localStorage.getItem('inventoryRecords');
              if (savedRecords) {
                const inventoryRecords = JSON.parse(savedRecords);
                
                // Calculate eggs to add back (dozens * 12)
                const eggsToAddBack = saleToRemove.dozens * 12;
                
                // Find the most recent record with the matching egg type
                const matchingRecords = inventoryRecords
                  .filter((record: InventoryRecord) => record.eggType === eggProduction.type)
                  .sort((a: InventoryRecord, b: InventoryRecord) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                  );
                
                if (matchingRecords.length > 0) {
                  // Update the most recent record
                  const updatedRecords = inventoryRecords.map((record: InventoryRecord) => {
                    if (record.id === matchingRecords[0].id) {
                      return {
                        ...record,
                        incubated: Math.max(0, record.incubated - eggsToAddBack)
                      };
                    }
                    return record;
                  });
                  
                  // Save updated inventory back to localStorage
                  localStorage.setItem('inventoryRecords', JSON.stringify(updatedRecords));
                  
                  // Recalculate available dozens
                  const eggTypeMap: Record<string, number> = {};
                  
                  updatedRecords.forEach((record: InventoryRecord) => {
                    const availableEggs = record.eggCount - record.incubated;
                    if (availableEggs > 0) {
                      if (eggTypeMap[record.eggType]) {
                        eggTypeMap[record.eggType] += availableEggs;
                      } else {
                        eggTypeMap[record.eggType] = availableEggs;
                      }
                    }
                  });
                  
                  // Convert to dozens and update state
                  const byType: Record<string, number> = {};
                  let totalDozens = 0;
                  
                  Object.entries(eggTypeMap).forEach(([type, count]) => {
                    const dozens = parseFloat((count / 12).toFixed(1));
                    byType[type] = dozens;
                    totalDozens += dozens;
                  });
                  
                  const newAvailableDozens = {
                    total: totalDozens,
                    byType
                  };
                  
                  setAvailableDozens(newAvailableDozens);
                  localStorage.setItem('availableDozens', JSON.stringify(newAvailableDozens));
                }
              }
            }
          } catch (error) {
            console.error('Error updating inventory after sale deletion:', error);
          }
        }
      }
    }
    
    // Close the modal
    setShowDeleteModal(false);
    setSaleToDelete(null);
  };

  // Handle marking a sale as paid
  const handleMarkAsPaid = (id: string) => {
    const updatedSales = sales.map(sale => 
      sale.id === id ? { ...sale, paymentStatus: "Paid" } : sale
    );
    setSales(updatedSales);
  };

  // Handle customer input change
  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding a new customer
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCustomer.name.trim() === "") {
      alert("Please enter a customer name");
      return;
    }
    
    const newCustomerId = (customers.length + 1).toString(); // Use same ID format as Customers page
    const customer: Customer = {
      id: newCustomerId,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address
    };
    
    const updatedCustomers = [...customers, customer];
    setCustomers(updatedCustomers);
    
    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmhomelife-customers', JSON.stringify(updatedCustomers));
    }
    
    // Select the new customer in the form
    setNewSale(prev => ({ ...prev, customerId: newCustomerId }));
    
    // Close the modal
    setShowCustomerModal(false);
    
    // Reset the form
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  // Handle closing the customer modal
  const handleCloseCustomerModal = () => {
    setShowCustomerModal(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  // Toggle current month filter
  const toggleCurrentMonthFilter = () => {
    setShowCurrentMonthOnly(!showCurrentMonthOnly);
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
                <h2 className="text-lg font-medium text-amber-900">Sales Summary</h2>
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
                    <h3 className="text-sm font-medium text-green-800 mb-2">Daily Revenue</h3>
                    <p className="text-2xl font-bold text-green-700">${dailyRevenue.toFixed(2)}</p>
                    <span className="text-xs text-gray-500">Today&apos;s sales</span>
                  </div>
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
            
            {/* Add New Sale Form */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 bg-amber-50">
                <h2 className="text-lg font-medium text-amber-900">Add New Sale</h2>
              </div>
              
              <div className="p-4">
                <form onSubmit={handleAddSale} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Date */}
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-amber-700 mb-1">
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
                    
                    {/* Customer */}
                    <div>
                      <label htmlFor="customerId" className="block text-sm font-medium text-amber-700 mb-1">
                        Customer <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-2">
                        <select
                          id="customerId"
                          name="customerId"
                          value={newSale.customerId}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        >
                          <option value="">Select Customer</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowCustomerModal(true)}
                          className="px-3 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Egg Production */}
                    <div>
                      <label htmlFor="eggProductionId" className="block text-sm font-medium text-amber-700 mb-1">
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
                        {eggProductions.map(production => (
                          <option key={production.id} value={production.id}>{production.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Dozens */}
                    <div>
                      <div className="flex justify-between items-center">
                        <label htmlFor="dozens" className="block text-sm font-medium text-amber-700 mb-1">
                          Dozens <span className="text-red-500">*</span>
                        </label>
                        {newSale.eggProductionId && (
                          <span className="text-xs text-red-500 font-medium">
                            {Math.floor(availableDozens.byType[eggProductions.find(ep => ep.id === newSale.eggProductionId)?.type || ''] || 0)} dozens available
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        id="dozens"
                        name="dozens"
                        value={newSale.dozens}
                        onChange={handleInputChange}
                        min="0.25"
                        step="0.25"
                        max={newSale.eggProductionId ? availableDozens.byType[eggProductions.find(ep => ep.id === newSale.eggProductionId)?.type || ''] || 0 : undefined}
                        className={`w-full px-3 py-2 border ${newSale.eggProductionId && newSale.dozens > (availableDozens.byType[eggProductions.find(ep => ep.id === newSale.eggProductionId)?.type || ''] || 0) ? 'border-red-500' : 'border-amber-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        required
                      />
                      {newSale.eggProductionId && newSale.dozens > (availableDozens.byType[eggProductions.find(ep => ep.id === newSale.eggProductionId)?.type || ''] || 0) && (
                        <p className="mt-1 text-xs text-red-500">Warning: You don&apos;t have enough eggs to sell this amount!</p>
                      )}
                    </div>
                    
                    {/* Price Per Dozen */}
                    <div>
                      <label htmlFor="pricePerDozen" className="block text-sm font-medium text-amber-700 mb-1">
                        Price Per Dozen <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          id="pricePerDozen"
                          name="pricePerDozen"
                          value={newSale.pricePerDozen}
                          onChange={handleInputChange}
                          min="0.01"
                          step="0.01"
                          className="w-full pl-7 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">
                        Total
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="text"
                          value={calculateTotal().toFixed(2)}
                          className="w-full pl-7 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700"
                          disabled
                        />
                      </div>
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
                        <option value="Other">Other</option>
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
                        <option value="Due on Pickup">Due on Pickup</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-amber-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={newSale.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="flex justify-end">
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
            
            {/* Sales List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-amber-50 flex justify-between items-center">
                <h2 className="text-lg font-medium text-amber-900">Sales List</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleCurrentMonthFilter}
                    className={`px-3 py-1 rounded transition-colors ${
                      showCurrentMonthOnly 
                        ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {showCurrentMonthOnly ? 'Showing Current Month' : 'Show All'}
                  </button>
                </div>
              </div>
              
              {customerIdFilter && (
                <div className="p-2 bg-blue-50 flex items-center">
                  <span className="text-sm text-blue-700 mr-2">
                    Filtering by customer: {customers.find(c => c.id === customerIdFilter)?.name || customerIdFilter}
                  </span>
                  <Link href="/dashboard/sales" passHref>
                    <button
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear Filter
                    </button>
                  </Link>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dozens
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price/Dozen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSales.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                          No sales found
                        </td>
                      </tr>
                    ) : (
                      filteredSales.map(sale => (
                        <tr key={sale.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(sale.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Link href={`/dashboard/sales?customerId=${sale.customerId}`} className="text-blue-600 hover:text-blue-900">
                              {sale.customerName}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.eggProductionName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.dozens.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${sale.pricePerDozen.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${sale.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sale.paymentStatus === 'Paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {sale.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditSale(sale.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              {sale.paymentStatus !== 'Paid' && (
                                <button
                                  onClick={() => handleMarkAsPaid(sale.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Mark Paid
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteSale(sale.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-red-700 mb-4">Confirm Delete</h3>
                <p className="text-gray-700 mb-6">Are you sure you want to delete this sale? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Edit Sale Modal */}
          {showEditModal && editingSale && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-amber-900">Edit Sale</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingSale(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label htmlFor="edit-date" className="block text-sm font-medium text-amber-700 mb-1">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="edit-date"
                        name="date"
                        value={editingSale.date}
                        onChange={(e) => setEditingSale({...editingSale, date: e.target.value})}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    
                    {/* Customer */}
                    <div>
                      <label htmlFor="edit-customerId" className="block text-sm font-medium text-amber-700 mb-1">
                        Customer <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="edit-customerId"
                        name="customerId"
                        value={editingSale.customerId}
                        onChange={(e) => {
                          const selectedCustomer = customers.find(c => c.id === e.target.value);
                          setEditingSale({
                            ...editingSale, 
                            customerId: e.target.value,
                            customerName: selectedCustomer ? selectedCustomer.name : ''
                          });
                        }}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Egg Production */}
                    <div>
                      <label htmlFor="edit-eggProductionId" className="block text-sm font-medium text-amber-700 mb-1">
                        Egg Production <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="edit-eggProductionId"
                        name="eggProductionId"
                        value={editingSale.eggProductionId}
                        onChange={(e) => {
                          const selectedProduction = eggProductions.find(p => p.id === e.target.value);
                          setEditingSale({
                            ...editingSale, 
                            eggProductionId: e.target.value,
                            eggProductionName: selectedProduction ? selectedProduction.name : ''
                          });
                        }}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        {eggProductions.map(production => (
                          <option key={production.id} value={production.id}>{production.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Dozens */}
                    <div>
                      <label htmlFor="edit-dozens" className="block text-sm font-medium text-amber-700 mb-1">
                        Dozens <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="edit-dozens"
                        name="dozens"
                        value={editingSale.dozens}
                        onChange={(e) => {
                          const dozens = parseFloat(e.target.value);
                          setEditingSale({
                            ...editingSale, 
                            dozens,
                            total: dozens * editingSale.pricePerDozen
                          });
                        }}
                        step="0.1"
                        min="0.1"
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    
                    {/* Price per Dozen */}
                    <div>
                      <label htmlFor="edit-pricePerDozen" className="block text-sm font-medium text-amber-700 mb-1">
                        Price per Dozen <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <input
                          type="number"
                          id="edit-pricePerDozen"
                          name="pricePerDozen"
                          value={editingSale.pricePerDozen}
                          onChange={(e) => {
                            const price = parseFloat(e.target.value);
                            setEditingSale({
                              ...editingSale, 
                              pricePerDozen: price,
                              total: editingSale.dozens * price
                            });
                          }}
                          step="0.01"
                          min="0.01"
                          className="w-full pl-8 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div>
                      <label htmlFor="edit-total" className="block text-sm font-medium text-amber-700 mb-1">
                        Total
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <input
                          type="number"
                          id="edit-total"
                          name="total"
                          value={editingSale.total.toFixed(2)}
                          readOnly
                          className="w-full pl-8 px-3 py-2 bg-gray-50 border border-amber-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    {/* Payment Method */}
                    <div>
                      <label htmlFor="edit-paymentMethod" className="block text-sm font-medium text-amber-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        id="edit-paymentMethod"
                        name="paymentMethod"
                        value={editingSale.paymentMethod}
                        onChange={(e) => setEditingSale({...editingSale, paymentMethod: e.target.value})}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Venmo">Venmo</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Check">Check</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    {/* Payment Status */}
                    <div>
                      <label htmlFor="edit-paymentStatus" className="block text-sm font-medium text-amber-700 mb-1">
                        Payment Status
                      </label>
                      <select
                        id="edit-paymentStatus"
                        name="paymentStatus"
                        value={editingSale.paymentStatus}
                        onChange={(e) => setEditingSale({...editingSale, paymentStatus: e.target.value})}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Due on Pickup">Due on Pickup</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label htmlFor="edit-notes" className="block text-sm font-medium text-amber-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="edit-notes"
                      name="notes"
                      value={editingSale.notes || ''}
                      onChange={(e) => setEditingSale({...editingSale, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* New Customer Modal */}
          {showCustomerModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-amber-900">Add New Customer</h3>
                  <button
                    onClick={handleCloseCustomerModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleAddCustomer} className="space-y-4">
                  {/* Customer Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-amber-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newCustomer.name}
                      onChange={handleCustomerInputChange}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  {/* Customer Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-amber-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newCustomer.email}
                      onChange={handleCustomerInputChange}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  {/* Customer Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-amber-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={newCustomer.phone}
                      onChange={handleCustomerInputChange}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  {/* Customer Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-amber-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={newCustomer.address}
                      onChange={handleCustomerInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseCustomerModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Add Customer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
