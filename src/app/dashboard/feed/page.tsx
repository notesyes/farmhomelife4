"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

// Types for feed data
type FeedType = "chicken" | "duck" | "quail" | "goose" | "turkey" | "other";

type FeedPurchase = {
  id: string;
  date: string;
  feedType: FeedType;
  brand: string;
  quantity: number; // in pounds
  cost: number; // total cost
  notes: string;
};

type FeedUsage = {
  id: string;
  date: string;
  feedType: FeedType;
  quantity: number; // in pounds
  notes: string;
};

export default function FeedPage() {
  // State for feed purchases and usage
  const [feedPurchases, setFeedPurchases] = useState<FeedPurchase[]>([]);
  const [feedUsage, setFeedUsage] = useState<FeedUsage[]>([]);
  
  // State for new feed purchase form
  const [newPurchase, setNewPurchase] = useState<Omit<FeedPurchase, "id">>({
    date: new Date().toISOString().split('T')[0],
    feedType: "chicken",
    brand: "",
    quantity: 0,
    cost: 0,
    notes: ""
  });
  
  // State for new feed usage form
  const [newUsage, setNewUsage] = useState<Omit<FeedUsage, "id">>({
    date: new Date().toISOString().split('T')[0],
    feedType: "chicken",
    quantity: 0,
    notes: ""
  });
  
  // State for showing forms
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showUsageForm, setShowUsageForm] = useState(false);
  
  // State for edit and delete modals
  const [showPurchaseEditModal, setShowPurchaseEditModal] = useState(false);
  const [showUsageEditModal, setShowUsageEditModal] = useState(false);
  const [showPurchaseDeleteModal, setShowPurchaseDeleteModal] = useState(false);
  const [showUsageDeleteModal, setShowUsageDeleteModal] = useState(false);
  const [purchaseToEdit, setPurchaseToEdit] = useState<FeedPurchase | null>(null);
  const [usageToEdit, setUsageToEdit] = useState<FeedUsage | null>(null);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [usageToDelete, setUsageToDelete] = useState<string | null>(null);
  
  // Load feed data from localStorage
  useEffect(() => {
    const savedPurchases = localStorage.getItem('feedPurchases');
    if (savedPurchases) {
      setFeedPurchases(JSON.parse(savedPurchases));
    } else {
      // Default data
      const defaultPurchases: FeedPurchase[] = [
        {
          id: "p1",
          date: "2025-05-15",
          feedType: "chicken",
          brand: "Organic Layer",
          quantity: 50,
          cost: 32.99,
          notes: "On sale at Tractor Supply"
        },
        {
          id: "p2",
          date: "2025-05-28",
          feedType: "duck",
          brand: "Waterfowl Blend",
          quantity: 25,
          cost: 24.50,
          notes: "From local feed store"
        }
      ];
      setFeedPurchases(defaultPurchases);
      localStorage.setItem('feedPurchases', JSON.stringify(defaultPurchases));
    }
    
    const savedUsage = localStorage.getItem('feedUsage');
    if (savedUsage) {
      setFeedUsage(JSON.parse(savedUsage));
    } else {
      // Default data
      const defaultUsage: FeedUsage[] = [
        {
          id: "u1",
          date: "2025-05-20",
          feedType: "chicken",
          quantity: 5,
          notes: "Weekly refill of feeders"
        },
        {
          id: "u2",
          date: "2025-05-27",
          feedType: "chicken",
          quantity: 4.5,
          notes: "Weekly refill of feeders"
        },
        {
          id: "u3",
          date: "2025-05-30",
          feedType: "duck",
          quantity: 3,
          notes: "Refilled duck feeders"
        }
      ];
      setFeedUsage(defaultUsage);
      localStorage.setItem('feedUsage', JSON.stringify(defaultUsage));
    }
  }, []);
  
  // Save to localStorage when data changes
  useEffect(() => {
    if (feedPurchases.length > 0) {
      localStorage.setItem('feedPurchases', JSON.stringify(feedPurchases));
    }
    if (feedUsage.length > 0) {
      localStorage.setItem('feedUsage', JSON.stringify(feedUsage));
    }
  }, [feedPurchases, feedUsage]);
  
  // Calculate feed statistics
  const feedStats = {
    totalPurchased: feedPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0),
    totalUsed: feedUsage.reduce((sum, usage) => sum + usage.quantity, 0),
    totalSpent: feedPurchases.reduce((sum, purchase) => sum + purchase.cost, 0),
    averageCostPerPound: feedPurchases.length > 0 
      ? feedPurchases.reduce((sum, purchase) => sum + purchase.cost, 0) / 
        feedPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0)
      : 0
  };
  
  // Calculate remaining feed
  const remainingFeed = feedStats.totalPurchased - feedStats.totalUsed;
  
  // Handle input change for purchase form
  const handlePurchaseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPurchase({
      ...newPurchase,
      [name]: name === 'quantity' || name === 'cost' ? parseFloat(value) : value
    });
  };
  
  // Handle input change for usage form
  const handleUsageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUsage({
      ...newUsage,
      [name]: name === 'quantity' ? parseFloat(value) : value
    });
  };
  
  // Handle adding a new feed purchase
  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPurchase.brand === "") {
      alert("Please enter a feed brand");
      return;
    }
    
    if (newPurchase.quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    
    if (newPurchase.cost <= 0) {
      alert("Please enter a valid cost");
      return;
    }
    
    const purchase: FeedPurchase = {
      id: `p-${Date.now()}`,
      ...newPurchase
    };
    
    setFeedPurchases([purchase, ...feedPurchases]);
    
    // Reset form
    setNewPurchase({
      date: new Date().toISOString().split('T')[0],
      feedType: "chicken",
      brand: "",
      quantity: 0,
      cost: 0,
      notes: ""
    });
    
    setShowPurchaseForm(false);
  };
  
  // Handle adding a new feed usage
  const handleAddUsage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUsage.quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    
    const usage: FeedUsage = {
      id: `u-${Date.now()}`,
      ...newUsage
    };
    
    setFeedUsage([usage, ...feedUsage]);
    
    // Reset form
    setNewUsage({
      date: new Date().toISOString().split('T')[0],
      feedType: "chicken",
      quantity: 0,
      notes: ""
    });
    
    setShowUsageForm(false);
  };
  
  // Handle opening edit modal for purchase
  const handleEditPurchase = (id: string) => {
    const purchase = feedPurchases.find(p => p.id === id);
    if (purchase) {
      setPurchaseToEdit(purchase);
      setShowPurchaseEditModal(true);
    }
  };
  
  // Handle saving edited purchase
  const handleSaveEditPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purchaseToEdit) return;
    
    // Update the purchase in the purchases array
    const updatedPurchases = feedPurchases.map(purchase => 
      purchase.id === purchaseToEdit.id ? purchaseToEdit : purchase
    );
    
    // Update state and localStorage
    setFeedPurchases(updatedPurchases);
    localStorage.setItem('feedPurchases', JSON.stringify(updatedPurchases));
    
    // Close the modal
    setShowPurchaseEditModal(false);
    setPurchaseToEdit(null);
    
    // Show confirmation
    alert("Purchase updated successfully!");
  };
  
  // Handle opening delete confirmation modal for purchase
  const handleDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setShowPurchaseDeleteModal(true);
  };
  
  // Handle confirming delete for purchase
  const handleDeletePurchaseConfirm = () => {
    if (purchaseToDelete) {
      try {
        // Filter out the deleted purchase
        const updatedPurchases = feedPurchases.filter(purchase => purchase.id !== purchaseToDelete);
        setFeedPurchases(updatedPurchases);
        localStorage.setItem('feedPurchases', JSON.stringify(updatedPurchases));
        
        // Show confirmation
        alert("Feed purchase deleted successfully!");
      } catch (error) {
        console.error('Error deleting feed purchase:', error);
        alert("Error deleting feed purchase. Please try again.");
      }
    }
    
    // Close the modal
    setShowPurchaseDeleteModal(false);
    setPurchaseToDelete(null);
  };
  
  // Handle opening edit modal for usage
  const handleEditUsage = (id: string) => {
    const usage = feedUsage.find(u => u.id === id);
    if (usage) {
      setUsageToEdit(usage);
      setShowUsageEditModal(true);
    }
  };
  
  // Handle saving edited usage
  const handleSaveEditUsage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usageToEdit) return;
    
    // Update the usage in the usage array
    const updatedUsage = feedUsage.map(usage => 
      usage.id === usageToEdit.id ? usageToEdit : usage
    );
    
    // Update state and localStorage
    setFeedUsage(updatedUsage);
    localStorage.setItem('feedUsage', JSON.stringify(updatedUsage));
    
    // Close the modal
    setShowUsageEditModal(false);
    setUsageToEdit(null);
    
    // Show confirmation
    alert("Usage updated successfully!");
  };
  
  // Handle opening delete confirmation modal for usage
  const handleDeleteUsage = (id: string) => {
    setUsageToDelete(id);
    setShowUsageDeleteModal(true);
  };
  
  // Handle confirming delete for usage
  const handleDeleteUsageConfirm = () => {
    if (usageToDelete) {
      try {
        // Filter out the deleted usage
        const updatedUsage = feedUsage.filter(usage => usage.id !== usageToDelete);
        setFeedUsage(updatedUsage);
        localStorage.setItem('feedUsage', JSON.stringify(updatedUsage));
        
        // Show confirmation
        alert("Feed usage record deleted successfully!");
      } catch (error) {
        console.error('Error deleting feed usage:', error);
        alert("Error deleting feed usage record. Please try again.");
      }
    }
    
    // Close the modal
    setShowUsageDeleteModal(false);
    setUsageToDelete(null);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        {/* Feed Management Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-amber-900">Feed Management</h1>
                <p className="text-amber-800">Track feed purchases, usage, and costs</p>
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
            
            {/* Feed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DashboardStatCard 
                value={feedStats.totalPurchased}
                label="Total Feed Purchased"
                unit="lbs"
                color="blue"
                description="All-time feed purchases"
              />
              <DashboardStatCard 
                value={remainingFeed}
                label="Feed Remaining"
                unit="lbs"
                color="green"
                description="Current feed inventory"
              />
              <DashboardStatCard 
                value={feedStats.totalUsed}
                label="Feed Used"
                unit="lbs"
                color="orange"
                description="All-time feed consumption"
              />
              <DashboardStatCard 
                value={feedStats.totalSpent}
                label="Total Spent"
                unit="$"
                color="purple"
                description={`Avg: $${feedStats.averageCostPerPound.toFixed(2)}/lb`}
              />
            </div>
            
            {/* Feed Purchase Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-5 border-b border-gray-200 bg-amber-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-amber-900">Feed Purchases</h2>
                  <p className="text-amber-700 mt-1">Record new feed purchases</p>
                </div>
                <button
                  onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  {showPurchaseForm ? 'Cancel' : '+ Add Purchase'}
                </button>
              </div>
              
              {/* Purchase Form */}
              {showPurchaseForm && (
                <div className="p-6 bg-amber-50 border-b border-amber-200">
                  <form onSubmit={handleAddPurchase} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Purchase Date */}
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-amber-700 mb-1">
                          Purchase Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={newPurchase.date}
                          onChange={handlePurchaseInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      
                      {/* Feed Type */}
                      <div>
                        <label htmlFor="feedType" className="block text-sm font-medium text-amber-700 mb-1">
                          Feed Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="feedType"
                          name="feedType"
                          value={newPurchase.feedType}
                          onChange={handlePurchaseInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        >
                          <option value="chicken">Chicken Feed</option>
                          <option value="duck">Duck Feed</option>
                          <option value="quail">Quail Feed</option>
                          <option value="goose">Goose Feed</option>
                          <option value="turkey">Turkey Feed</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      {/* Brand */}
                      <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-amber-700 mb-1">
                          Brand/Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="brand"
                          name="brand"
                          value={newPurchase.brand}
                          onChange={handlePurchaseInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="e.g. Organic Layer Pellets"
                          required
                        />
                      </div>
                      
                      {/* Quantity */}
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-amber-700 mb-1">
                          Quantity (lbs) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          value={newPurchase.quantity || ''}
                          onChange={handlePurchaseInputChange}
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      
                      {/* Cost */}
                      <div>
                        <label htmlFor="cost" className="block text-sm font-medium text-amber-700 mb-1">
                          Total Cost ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="cost"
                          name="cost"
                          value={newPurchase.cost || ''}
                          onChange={handlePurchaseInputChange}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      
                      {/* Notes */}
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-amber-700 mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          id="notes"
                          name="notes"
                          value={newPurchase.notes}
                          onChange={handlePurchaseInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Optional notes about this purchase"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Save Purchase
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Purchase List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Feed Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Brand
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Quantity (lbs)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Cost
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Notes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {feedPurchases.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No feed purchases recorded yet
                        </td>
                      </tr>
                    ) : (
                      feedPurchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(purchase.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {purchase.feedType.charAt(0).toUpperCase() + purchase.feedType.slice(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {purchase.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {purchase.quantity.toFixed(1)} lbs
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${purchase.cost.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {purchase.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
                            <button
                              onClick={() => handleEditPurchase(purchase.id)}
                              className="text-amber-600 hover:text-amber-900 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePurchase(purchase.id)}
                              className="text-red-600 hover:text-red-900 font-medium ml-2"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Feed Usage Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-5 border-b border-gray-200 bg-amber-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-amber-900">Feed Usage</h2>
                  <p className="text-amber-700 mt-1">Track feed consumption</p>
                </div>
                <button
                  onClick={() => setShowUsageForm(!showUsageForm)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  {showUsageForm ? 'Cancel' : '+ Add Usage'}
                </button>
              </div>
              
              {/* Usage Form */}
              {showUsageForm && (
                <div className="p-6 bg-amber-50 border-b border-amber-200">
                  <form onSubmit={handleAddUsage} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Usage Date */}
                      <div>
                        <label htmlFor="usageDate" className="block text-sm font-medium text-amber-700 mb-1">
                          Usage Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="usageDate"
                          name="date"
                          value={newUsage.date}
                          onChange={handleUsageInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      
                      {/* Feed Type */}
                      <div>
                        <label htmlFor="usageFeedType" className="block text-sm font-medium text-amber-700 mb-1">
                          Feed Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="usageFeedType"
                          name="feedType"
                          value={newUsage.feedType}
                          onChange={handleUsageInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        >
                          <option value="chicken">Chicken Feed</option>
                          <option value="duck">Duck Feed</option>
                          <option value="quail">Quail Feed</option>
                          <option value="goose">Goose Feed</option>
                          <option value="turkey">Turkey Feed</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      {/* Quantity */}
                      <div>
                        <label htmlFor="usageQuantity" className="block text-sm font-medium text-amber-700 mb-1">
                          Quantity (lbs) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="usageQuantity"
                          name="quantity"
                          value={newUsage.quantity || ''}
                          onChange={handleUsageInputChange}
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      
                      {/* Notes */}
                      <div>
                        <label htmlFor="usageNotes" className="block text-sm font-medium text-amber-700 mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          id="usageNotes"
                          name="notes"
                          value={newUsage.notes}
                          onChange={handleUsageInputChange}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Optional notes about this usage"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Save Usage
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Usage List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Feed Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Quantity (lbs)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Notes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {feedUsage.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No feed usage recorded yet
                        </td>
                      </tr>
                    ) : (
                      feedUsage.map((usage) => (
                        <tr key={usage.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(usage.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usage.feedType.charAt(0).toUpperCase() + usage.feedType.slice(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usage.quantity.toFixed(1)} lbs
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {usage.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
                            <button
                              onClick={() => handleEditUsage(usage.id)}
                              className="text-amber-600 hover:text-amber-900 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUsage(usage.id)}
                              className="text-red-600 hover:text-red-900 font-medium ml-2"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Purchase Edit Modal */}
      {showPurchaseEditModal && purchaseToEdit && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Edit Feed Purchase</h3>
            
            <form onSubmit={handleSaveEditPurchase} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Purchase Date */}
                <div>
                  <label htmlFor="editDate" className="block text-sm font-medium text-amber-700 mb-1">
                    Purchase Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="editDate"
                    name="date"
                    value={purchaseToEdit.date}
                    onChange={(e) => setPurchaseToEdit({...purchaseToEdit, date: e.target.value})}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                {/* Feed Type */}
                <div>
                  <label htmlFor="editFeedType" className="block text-sm font-medium text-amber-700 mb-1">
                    Feed Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="editFeedType"
                    name="feedType"
                    value={purchaseToEdit.feedType}
                    onChange={(e) => setPurchaseToEdit({...purchaseToEdit, feedType: e.target.value as FeedType})}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="chicken">Chicken Feed</option>
                    <option value="duck">Duck Feed</option>
                    <option value="quail">Quail Feed</option>
                    <option value="goose">Goose Feed</option>
                    <option value="turkey">Turkey Feed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Brand */}
                <div>
                  <label htmlFor="editBrand" className="block text-sm font-medium text-amber-700 mb-1">
                    Brand/Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="editBrand"
                    name="brand"
                    value={purchaseToEdit.brand}
                    onChange={(e) => setPurchaseToEdit({...purchaseToEdit, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Organic Layer Pellets"
                    required
                  />
                </div>
                
                {/* Quantity */}
                <div>
                  <label htmlFor="editQuantity" className="block text-sm font-medium text-amber-700 mb-1">
                    Quantity (lbs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="editQuantity"
                    name="quantity"
                    value={purchaseToEdit.quantity || ''}
                    onChange={(e) => setPurchaseToEdit({...purchaseToEdit, quantity: parseFloat(e.target.value)})}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                {/* Cost */}
                <div>
                  <label htmlFor="editCost" className="block text-sm font-medium text-amber-700 mb-1">
                    Total Cost ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="editCost"
                    name="cost"
                    value={purchaseToEdit.cost || ''}
                    onChange={(e) => setPurchaseToEdit({...purchaseToEdit, cost: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                {/* Notes */}
                <div className="md:col-span-2">
                  <label htmlFor="editNotes" className="block text-sm font-medium text-amber-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    id="editNotes"
                    name="notes"
                    value={purchaseToEdit.notes}
                    onChange={(e) => setPurchaseToEdit({...purchaseToEdit, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Optional notes about this purchase"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPurchaseEditModal(false);
                    setPurchaseToEdit(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
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
      
      {/* Usage Edit Modal */}
      {showUsageEditModal && usageToEdit && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Edit Feed Usage</h3>
            
            <form onSubmit={handleSaveEditUsage} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Usage Date */}
                <div>
                  <label htmlFor="editUsageDate" className="block text-sm font-medium text-amber-700 mb-1">
                    Usage Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="editUsageDate"
                    name="date"
                    value={usageToEdit.date}
                    onChange={(e) => setUsageToEdit({...usageToEdit, date: e.target.value})}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                {/* Feed Type */}
                <div>
                  <label htmlFor="editUsageFeedType" className="block text-sm font-medium text-amber-700 mb-1">
                    Feed Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="editUsageFeedType"
                    name="feedType"
                    value={usageToEdit.feedType}
                    onChange={(e) => setUsageToEdit({...usageToEdit, feedType: e.target.value as FeedType})}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="chicken">Chicken Feed</option>
                    <option value="duck">Duck Feed</option>
                    <option value="quail">Quail Feed</option>
                    <option value="goose">Goose Feed</option>
                    <option value="turkey">Turkey Feed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Quantity */}
                <div>
                  <label htmlFor="editUsageQuantity" className="block text-sm font-medium text-amber-700 mb-1">
                    Quantity (lbs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="editUsageQuantity"
                    name="quantity"
                    value={usageToEdit.quantity || ''}
                    onChange={(e) => setUsageToEdit({...usageToEdit, quantity: parseFloat(e.target.value)})}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                {/* Notes */}
                <div>
                  <label htmlFor="editUsageNotes" className="block text-sm font-medium text-amber-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    id="editUsageNotes"
                    name="notes"
                    value={usageToEdit.notes}
                    onChange={(e) => setUsageToEdit({...usageToEdit, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Optional notes about this usage"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUsageEditModal(false);
                    setUsageToEdit(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
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
      
      {/* Purchase Delete Confirmation Modal */}
      {showPurchaseDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this feed purchase? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPurchaseDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePurchaseConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Usage Delete Confirmation Modal */}
      {showUsageDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this feed usage record? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUsageDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUsageConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
