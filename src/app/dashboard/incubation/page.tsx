"use client";

import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

// Icons
import { PlusIcon, ClockIcon } from '@heroicons/react/24/outline';

// Utilities
import { format } from 'date-fns';

// Types
type SpeciesType = 'Chicken' | 'Duck' | 'Goose' | 'Turkey' | 'Quail';
type BatchStatus = 'incubating' | 'hatched' | 'failed';
// Commented out until implemented
// type TemperatureUnit = 'F' | 'C';
// Unused types kept for future implementation
// type ActionType = 'turned' | 'candled';

// Commented out until implemented
/* interface SpeciesInfo {
  incubationDays: number;
  temp: number;
  humidity: number;
  varieties: string[];
} */

interface EggBatch {
  id: string;
  batchName: string;
  startDate: string;
  species: SpeciesType;
  varieties: string[];
  eggCount: number;
  notes: string;
  status: BatchStatus;
  temperature: number;
  humidity: number;
  expectedHatchDate: string;
  daysRemaining: number;
  lastTurned: string;
  lastCandled: string;
}

// Commented out until implemented
/* interface BreedRequirement {
  temp: number;
  humidity: number;
  reason: string;
} */

// Commented out until implemented
/* interface IncompatibleBreedRule {
  reason: string;
  detailedExplanation: string;
  severity: 'warning' | 'error';
  canMix: boolean;
  recommendation: string;
} */

// Commented out until implemented
/* interface CompatibilityWarning {
  id: string;
  breed: string;
  reason: string;
  severity: 'warning' | 'error';
  recommendation: string;
  detailedExplanation?: string;
  showDetails: boolean;
}
*/

// Commented out until implemented
/* interface FormData {
  batchName: string;
  startDate: string;
  species: SpeciesType | '';
  varieties: string[];
  eggCount: string;
  temperature: number;
  humidity: number;
  notes: string;
}
*/

export default function IncubationPage() {
  // Species information database - commented out until fully implemented
  /* const speciesData = useMemo<Record<SpeciesType, SpeciesInfo>>(() => ({
    "Chicken": { 
      incubationDays: 21, 
      temp: 99.5, 
      humidity: 55,
      varieties: [
        "Rhode Island Red", "Leghorn", "Plymouth Rock", "Buff Orpington", 
        "Australorp", "Sussex", "Wyandotte", "New Hampshire Red", 
        "Brahma", "Cochin", "Silkie", "Easter Egger", "Marans", 
        "Ameraucana", "Barred Rock", "Cornish Cross", "Jersey Giant"
      ]
    },
    "Duck": { 
      incubationDays: 28, 
      temp: 99.5, 
      humidity: 55,
      varieties: [
        "Mallard", "Pekin", "Rouen", "Khaki Campbell", "Runner", 
        "Cayuga", "Swedish Blue", "Buff", "Welsh Harlequin", 
        "Muscovy", "Call Duck", "Crested"
      ]
    },
    "Goose": { 
      incubationDays: 30, 
      temp: 99.5, 
      humidity: 55,
      varieties: [
        "Toulouse", "Embden", "African", "Chinese", "Pilgrim", 
        "Sebastopol", "American Buff", "Pomeranian", "Roman Tufted"
      ]
    },
    "Turkey": { 
      incubationDays: 28, 
      temp: 99.5, 
      humidity: 55,
      varieties: [
        "Broad Breasted White", "Broad Breasted Bronze", "Heritage Bronze", 
        "Narragansett", "Bourbon Red", "Royal Palm", "Slate", 
        "White Holland", "Black Spanish", "Midget White"
      ]
    },
    "Quail": { 
      incubationDays: 17, 
      temp: 99.7, 
      humidity: 60,
      varieties: [
        "Coturnix (Japanese)", "Bobwhite", "California", "Gambel", 
        "Button (Chinese Painted)", "Pharaoh", "Texas A&M", "Jumbo Brown"
      ]
    }
  }), []); */

  // State management for egg batches
  const [batches] = useState<EggBatch[]>([
    {
      id: "1",
      batchName: "Spring Chickens 2025",
      startDate: "2025-05-15",
      species: "Chicken",
      varieties: ["Rhode Island Red", "Buff Orpington"],
      eggCount: 12,
      notes: "First batch of the season",
      status: "incubating",
      temperature: 99.5,
      humidity: 55,
      expectedHatchDate: "2025-06-05",
      daysRemaining: 21,
      lastTurned: "2025-05-20T08:30:00",
      lastCandled: "2025-05-22T10:15:00"
    },
    {
      id: "2",
      batchName: "Duck Eggs - Summer",
      startDate: "2025-05-18",
      species: "Duck",
      varieties: ["Pekin", "Khaki Campbell"],
      eggCount: 8,
      notes: "Using new humidity settings",
      status: "incubating",
      temperature: 99.5,
      humidity: 65,
      expectedHatchDate: "2025-06-15",
      daysRemaining: 28,
      lastTurned: "2025-05-20T09:45:00",
      lastCandled: "2025-05-23T11:30:00"
    },
    {
      id: "3",
      batchName: "Quail Experiment",
      startDate: "2025-05-20",
      species: "Quail",
      varieties: ["Coturnix (Japanese)"],
      eggCount: 24,
      notes: "Testing new incubator settings",
      status: "incubating",
      temperature: 99.7,
      humidity: 60,
      expectedHatchDate: "2025-06-06",
      daysRemaining: 17,
      lastTurned: "2025-05-20T14:30:00",
      lastCandled: "2025-05-25T10:15:00"
    }
  ]);
  
  // State for showing/hiding the add form
  const [showAddForm, setShowAddForm] = useState(false);
  // const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F");
  // const [compatibilityWarnings, setCompatibilityWarnings] = useState<CompatibilityWarning[]>([]);
  
  // Form state - commented out until form implementation is complete
  /* const [formData, setFormData] = useState<FormData>({
    batchName: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    species: "",
    varieties: [],
    eggCount: "",
    temperature: 99.5,
    humidity: 55,
    notes: ""
  }); */

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Egg Incubation Management</h2>
              <p className="text-gray-600">
                Track and manage your egg batches, monitor incubation progress, and record important events.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Add New Batch
                </button>
              </div>
            </div>
            
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add New Batch</h3>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Spring Chickens 2025"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">Select Species</option>
                        <option value="Chicken">Chicken</option>
                        <option value="Duck">Duck</option>
                        <option value="Goose">Goose</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Quail">Quail</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Egg Count</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Varieties/Breeds</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="Rhode Island Red, Buff Orpington"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="99.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="55"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Any special notes about this batch..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                      onClick={() => {
                        alert('This feature is not fully implemented yet!');
                        setShowAddForm(false);
                      }}
                    >
                      Save Batch
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {batches.map(batch => (
              <div key={batch.id} className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{batch.batchName}</h3>
                      <p className="text-gray-500">{batch.species} • {batch.eggCount} eggs</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{format(new Date(batch.startDate), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected Hatch</p>
                      <p className="font-medium">{format(new Date(batch.expectedHatchDate), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Temperature</p>
                      <p className="font-medium">{batch.temperature}°F</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-medium">{batch.humidity}%</p>
                    </div>
                  </div>
                  
                  {batch.status === 'incubating' && (
                    <div className="mt-4 bg-blue-50 p-3 rounded-md flex items-center">
                      <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-blue-800 font-medium">
                          {batch.daysRemaining} days remaining
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
