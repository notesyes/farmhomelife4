"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// Types for incubation data
type SpeciesType = "chicken" | "duck" | "quail" | "goose" | "turkey";

type SpeciesInfo = {
  name: string;
  incubationDays: number;
  temperature: number;
  humidity: number;
  varieties: string[];
};

type EggBatch = {
  id: string;
  name: string;
  startDate: string;
  expectedHatchDate: string;
  eggCount: number;
  speciesType: SpeciesType;
  speciesVariety: string;
  notes: string;
  status: "incubating" | "hatched" | "failed";
  temperature: number;
  humidity: number;
  lastTurned: string;
  lastCandled: string;
};

export default function IncubationPage() {
  // Species information database
  const speciesInfo: Record<SpeciesType, SpeciesInfo> = {
    chicken: {
      name: "Chicken",
      incubationDays: 21,
      temperature: 99.5,
      humidity: 55,
      varieties: ["Rhode Island Red", "Leghorn", "Plymouth Rock", "Orpington", "Wyandotte", "Sussex", "Australorp"]
    },
    duck: {
      name: "Duck",
      incubationDays: 28,
      temperature: 99.3,
      humidity: 65,
      varieties: ["Pekin", "Mallard", "Muscovy", "Runner", "Cayuga", "Swedish", "Rouen"]
    },
    quail: {
      name: "Quail",
      incubationDays: 18,
      temperature: 99.5,
      humidity: 50,
      varieties: ["Coturnix", "Bobwhite", "Button", "California", "Japanese"]
    },
    goose: {
      name: "Goose",
      incubationDays: 30,
      temperature: 99.0,
      humidity: 65,
      varieties: ["Embden", "Toulouse", "Chinese", "African", "Pilgrim"]
    },
    turkey: {
      name: "Turkey",
      incubationDays: 28,
      temperature: 99.5,
      humidity: 60,
      varieties: ["Broad Breasted White", "Broad Breasted Bronze", "Bourbon Red", "Narragansett", "Royal Palm"]
    }
  };

  const [batches, setBatches] = useState<EggBatch[]>([
    {
      id: "batch1",
      name: "Spring Batch 1",
      startDate: "2025-05-20",
      expectedHatchDate: "2025-06-10",
      eggCount: 12,
      speciesType: "chicken",
      speciesVariety: "Rhode Island Red",
      notes: "First batch of the season",
      status: "incubating",
      temperature: 99.5,
      humidity: 55,
      lastTurned: "2025-06-02",
      lastCandled: "2025-05-27"
    },
    {
      id: "batch2",
      name: "Spring Batch 2",
      startDate: "2025-05-25",
      expectedHatchDate: "2025-06-22",
      eggCount: 8,
      speciesType: "duck",
      speciesVariety: "Pekin",
      notes: "Using new incubator settings",
      status: "incubating",
      temperature: 99.3,
      humidity: 65,
      lastTurned: "2025-06-02",
      lastCandled: "2025-05-30"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<EggBatch>>({
    name: "",
    startDate: new Date().toISOString().split("T")[0],
    eggCount: 0,
    speciesType: "chicken",
    speciesVariety: "",
    notes: "",
    temperature: 99.5,
    humidity: 55
  });
  
  // Check if there are active incubations and get their species type
  const activeIncubations = batches.filter(batch => batch.status === "incubating");
  const hasActiveIncubations = activeIncubations.length > 0;
  const activeSpeciesType = hasActiveIncubations ? activeIncubations[0].speciesType : null;
  
  // Determine which species are allowed for new batches
  const allowedSpeciesTypes = hasActiveIncubations 
    ? [activeSpeciesType] 
    : Object.keys(speciesInfo) as SpeciesType[];

  // Calculate days remaining until hatch
  const calculateDaysRemaining = (hatchDate: string) => {
    const today = new Date();
    const hatch = new Date(hatchDate);
    const diffTime = hatch.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate incubation progress percentage
  const calculateProgress = (startDate: string, hatchDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(hatchDate).getTime();
    const today = new Date().getTime();
    
    if (today >= end) return 100;
    if (today <= start) return 0;
    
    const total = end - start;
    const current = today - start;
    // Format to fixed precision to ensure consistent rendering between server and client
    return Math.round((current / total) * 1000) / 10;
  };

  // Handle adding a new batch
  const handleAddBatch = () => {
    if (!newBatch.name || !newBatch.startDate || !newBatch.speciesVariety || !newBatch.eggCount || newBatch.eggCount <= 0) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (hasActiveIncubations && activeSpeciesType && activeSpeciesType !== newBatch.speciesType) {
      alert(`Cannot mix different species in the incubator. You currently have ${speciesInfo[activeSpeciesType].name} eggs incubating.`);
      return;
    }

    // Get the selected species info
    const selectedSpeciesInfo = newBatch.speciesType ? speciesInfo[newBatch.speciesType] : speciesInfo.chicken;
  
    // Calculate expected hatch date based on species type
    const startDate = new Date(newBatch.startDate || "");
    const incubationDays = selectedSpeciesInfo.incubationDays;
    const hatchDate = new Date(startDate);
    hatchDate.setDate(startDate.getDate() + incubationDays);

    const newBatchComplete: EggBatch = {
      id: `batch${Date.now()}`,
      name: newBatch.name || "",
      startDate: newBatch.startDate || "",
      expectedHatchDate: hatchDate.toISOString().split("T")[0],
      eggCount: newBatch.eggCount || 0,
      speciesType: newBatch.speciesType || "chicken",
      speciesVariety: newBatch.speciesVariety || "",
      notes: newBatch.notes || "",
      status: "incubating",
      temperature: newBatch.temperature || selectedSpeciesInfo.temperature,
      humidity: newBatch.humidity || selectedSpeciesInfo.humidity,
      lastTurned: new Date().toISOString().split("T")[0],
      lastCandled: ""
    };

    setBatches([...batches, newBatchComplete]);
    setShowAddForm(false);
    setNewBatch({
      name: "",
      startDate: new Date().toISOString().split("T")[0],
      eggCount: 0,
      speciesType: newBatch.speciesType,
      speciesVariety: "",
      notes: "",
      temperature: selectedSpeciesInfo.temperature,
      humidity: selectedSpeciesInfo.humidity
    });
  };

  // Handle updating batch status
  const handleUpdateStatus = (id: string, status: "incubating" | "hatched" | "failed") => {
    try {
      console.log(`Updating batch ${id} status to ${status}`);
      
      // Update the batch status
      const updatedBatches = batches.map(batch => 
        batch.id === id ? { ...batch, status } : batch
      );
      
      setBatches(updatedBatches);
      
      // Show confirmation message
      const statusMessages = {
        hatched: "Batch marked as hatched successfully!",
        failed: "Batch marked as failed.",
        incubating: "Batch status updated to incubating."
      };
      
      alert(statusMessages[status]);
    } catch (error) {
      console.error("Error updating batch status:", error);
      alert("There was an error updating the batch status. Please try again.");
    }
  };

  // Handle recording egg turning
  const handleRecordTurning = (id: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      console.log(`Recording turning for batch ${id} on ${today}`);
      
      // Update the batch with the new turning date
      const updatedBatches = batches.map(batch => 
        batch.id === id ? { ...batch, lastTurned: today } : batch
      );
      
      setBatches(updatedBatches);
      alert("Egg turning recorded!");
    } catch (error) {
      console.error("Error recording egg turning:", error);
      alert("There was an error recording the egg turning. Please try again.");
    }
  };

  // Handle recording candling
  const handleRecordCandling = (id: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      console.log(`Recording candling for batch ${id} on ${today}`);
      
      // Update the batch with the new candling date
      const updatedBatches = batches.map(batch => 
        batch.id === id ? { ...batch, lastCandled: today } : batch
      );
      
      setBatches(updatedBatches);
      alert("Egg candling recorded!");
    } catch (error) {
      console.error("Error recording egg candling:", error);
      alert("There was an error recording the egg candling. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        {/* Incubation Management Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Egg Incubation</h1>
                <p className="text-sm text-gray-600">Track and manage your incubating egg batches</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Batch
              </button>
            </div>

            {/* Add New Batch Form */}
            {showAddForm && (
              <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-amber-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Egg Batch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name*</label>
                    <input
                      type="text"
                      value={newBatch.name}
                      onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Spring Batch 3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                    <input
                      type="date"
                      value={newBatch.startDate}
                      onChange={(e) => setNewBatch({...newBatch, startDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Species Type*</label>
                    <select
                      value={newBatch.speciesType}
                      onChange={(e) => {
                        const newSpeciesType = e.target.value as SpeciesType;
                        setNewBatch({
                          ...newBatch, 
                          speciesType: newSpeciesType,
                          speciesVariety: "",
                          temperature: speciesInfo[newSpeciesType].temperature,
                          humidity: speciesInfo[newSpeciesType].humidity
                        });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled={hasActiveIncubations}
                    >
                      {allowedSpeciesTypes.map((type) => {
                        // Ensure type is a valid key
                        if (type && speciesInfo[type]) {
                          return (
                            <option key={type} value={type}>
                              {speciesInfo[type].name} ({speciesInfo[type].incubationDays} days)
                            </option>
                          );
                        }
                        return null;
                      })}
                    </select>
                    {hasActiveIncubations && activeSpeciesType && (
                      <p className="text-xs text-amber-600 mt-1">
                        You can only incubate {speciesInfo[activeSpeciesType].name} eggs while you have active {speciesInfo[activeSpeciesType].name} incubations.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variety*</label>
                    <select
                      value={newBatch.speciesVariety}
                      onChange={(e) => setNewBatch({...newBatch, speciesVariety: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a variety</option>
                      {newBatch.speciesType && speciesInfo[newBatch.speciesType].varieties.map((variety) => (
                        <option key={variety} value={variety}>{variety}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Egg Count*</label>
                    <input
                      type="number"
                      value={newBatch.eggCount || ""}
                      onChange={(e) => setNewBatch({...newBatch, eggCount: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                    <input
                      type="number"
                      value={newBatch.temperature || ""}
                      onChange={(e) => setNewBatch({...newBatch, temperature: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
                    <input
                      type="number"
                      value={newBatch.humidity || ""}
                      onChange={(e) => setNewBatch({...newBatch, humidity: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newBatch.notes}
                      onChange={(e) => setNewBatch({...newBatch, notes: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Any special notes about this batch"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBatch}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Add Batch
                  </button>
                </div>
              </div>
            )}

            {/* Active Batches */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-amber-200 mb-6">
              <div className="p-4 bg-amber-50 border-b border-amber-200">
                <h2 className="text-lg font-medium text-gray-900">Active Incubation Batches</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Species
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hatch Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {batches.map((batch) => (
                      <tr key={batch.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                          <div className="text-sm text-gray-500">{batch.eggCount} eggs</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{speciesInfo[batch.speciesType].name}</div>
                          <div className="text-xs text-gray-500">{batch.speciesVariety}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{batch.startDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{batch.expectedHatchDate}</div>
                          <div className="text-xs text-gray-500">
                            {batch.status === "incubating" && calculateDaysRemaining(batch.expectedHatchDate) > 0 ? 
                              `${calculateDaysRemaining(batch.expectedHatchDate)} days left` : 
                              batch.status === "incubating" ? "Due today!" : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-emerald-600 h-2.5 rounded-full" 
                              style={{ width: `${calculateProgress(batch.startDate, batch.expectedHatchDate)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round(calculateProgress(batch.startDate, batch.expectedHatchDate))}% complete
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${batch.status === "incubating" ? "bg-blue-100 text-blue-800" : 
                              batch.status === "hatched" ? "bg-green-100 text-green-800" : 
                              "bg-red-100 text-red-800"}`}>
                            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {batch.status === "incubating" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRecordTurning(batch.id);
                                  }}
                                  className="text-emerald-600 hover:text-emerald-900 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                                  title={`Last turned: ${batch.lastTurned}`}
                                  type="button"
                                  aria-label={`Turn eggs for batch ${batch.name}`}
                                >
                                  Turn
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRecordCandling(batch.id);
                                  }}
                                  className="text-amber-600 hover:text-amber-900 px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                                  title={`Last candled: ${batch.lastCandled || 'Never'}`}
                                  type="button"
                                  aria-label={`Candle eggs for batch ${batch.name}`}
                                >
                                  Candle
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleUpdateStatus(batch.id, "hatched");
                                  }}
                                  className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-100 transition-colors"
                                  type="button"
                                  aria-label={`Mark batch ${batch.name} as hatched`}
                                >
                                  Hatched
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to mark batch ${batch.name} as failed?`)) {
                                      handleUpdateStatus(batch.id, "failed");
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                                  type="button"
                                  aria-label={`Mark batch ${batch.name} as failed`}
                                >
                                  Failed
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Incubation Tips */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-amber-200">
              <div className="p-4 bg-amber-50 border-b border-amber-200">
                <h2 className="text-lg font-medium text-gray-900">Incubation Tips</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">Chicken Eggs</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>Incubation period: 21 days</li>
                      <li>Temperature: 99.5°F (37.5°C)</li>
                      <li>Humidity: 50-55% for days 1-18, 65% for days 19-21</li>
                      <li>Turn eggs at least 3 times daily until day 18</li>
                      <li>Stop turning on day 18 and increase humidity</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">Duck Eggs</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>Incubation period: 28 days</li>
                      <li>Temperature: 99.3°F (37.4°C)</li>
                      <li>Humidity: 55-60% for days 1-25, 70-75% for days 26-28</li>
                      <li>Turn eggs at least 3 times daily until day 25</li>
                      <li>Stop turning on day 25 and increase humidity</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
                    <h3 className="font-medium text-amber-800 mb-2">Important Tips</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li className="font-medium text-red-600">Never mix different species in the same incubator!</li>
                      <li>Different species have different incubation requirements</li>
                      <li>Quail: 18 days at 99.5°F, 50% humidity</li>
                      <li>Turkey: 28 days at 99.5°F, 60% humidity</li>
                      <li>Goose: 30 days at 99.0°F, 65% humidity</li>
                    </ul>
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
