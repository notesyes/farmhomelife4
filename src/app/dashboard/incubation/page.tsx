"use client";

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

// Icons
import { PlusIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// No type definitions needed here

interface Alert {
  type: 'info' | 'warning' | 'error';
  message: string;
  actionRequired?: boolean;
}

interface EggBatch {
  id: string;
  batchName: string;
  startDate: string;
  species: string;
  varieties: string[];
  eggCount: number;
  notes?: string;
  status: string;
  temperature: number;
  humidity: number;
  expectedHatchDate: string;
  daysRemaining: number;
  daysElapsed: number;
  lastTurned?: string;
  lastCandled?: string;
  alerts?: Alert[];
}

// This interface would be used for the batch form when implemented
// Currently using EggBatch for all batch operations

interface InventoryRecord {
  id: string;
  date: string;
  eggCount: number;
  pickupTime: string;
  pickupMethod: string;
  eggType: string;
  incubated: number;
  broken: number;
  weather: string;
  notes: string;
}

export default function IncubationPage() {
  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteBatchId, setDeleteBatchId] = useState<string | null>(null);
  
  // State for complete confirmation modal
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [completeBatchId, setCompleteBatchId] = useState<string | null>(null);
  
  // State for form visibility
  const [showForm, setShowForm] = useState(false);
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [editBatchId, setEditBatchId] = useState<string | null>(null);
  
  // State for available eggs from inventory
  const [availableEggs, setAvailableEggs] = useState(0);
  
  // Load available eggs count from inventory
  useEffect(() => {
    try {
      // Load inventory records from localStorage
      const savedRecords = localStorage.getItem('inventoryRecords');
      if (savedRecords) {
        const records = JSON.parse(savedRecords);
        
        // Calculate total available eggs (total eggs minus already incubated and broken)
        const totalAvailable = records.reduce((sum: number, record: InventoryRecord) => {
          const availableInRecord = record.eggCount - record.incubated - record.broken;
          return sum + Math.max(0, availableInRecord);
        }, 0);
        
        setAvailableEggs(totalAvailable);
      }
    } catch (error) {
      console.error('Error loading inventory records:', error);
    }
  }, []);
  
  // Chicken breeds list
  const chickenBreeds = [
    "Ameraucana",
    "Ancona",
    "Andalusian",
    "Araucana",
    "Australorp",
    "Barnevelder",
    "Brahma",
    "Campine",
    "Cochin",
    "Delaware",
    "Dominique",
    "Dorking",
    "Easter Egger",
    "Faverolles",
    "Hamburg",
    "Holland",
    "Java",
    "Jersey Giant",
    "Leghorn",
    "Marans",
    "Minorca",
    "New Hampshire",
    "Orpington",
    "Plymouth Rock",
    "Polish",
    "Rhode Island Red",
    "Sebright",
    "Silkie",
    "Sussex",
    "Welsummer",
    "Wyandotte"
  ];
  
  // Breed compatibility data - breeds that shouldn't be incubated together
  // This is based on different incubation requirements (temperature, humidity, development time)
  const incompatibleBreeds: {[species: string]: {[breed: string]: string[]}} = {
    "Chicken": {
      "Silkie": ["Leghorn", "Rhode Island Red", "Plymouth Rock"], // Silkies need higher humidity
      "Brahma": ["Leghorn", "Ancona"], // Brahmas have different development times
      "Jersey Giant": ["Leghorn", "Sebright", "Campine"], // Jersey Giants need longer incubation
      "Polish": ["Wyandotte", "Orpington"], // Polish chickens have special requirements
      "Cochin": ["Leghorn", "Ancona", "Minorca"], // Cochins need different conditions
      "Marans": ["Leghorn", "Hamburg"] // Marans eggs are darker and harder to candle
    },
    "Duck": {
      "Muscovy": ["Pekin", "Rouen", "Khaki Campbell"], // Muscovy ducks have longer incubation period (35 days vs 28)
      "Call Duck": ["Indian Runner", "Muscovy"], // Call ducks have smaller eggs with different requirements
      "Indian Runner": ["Muscovy", "Call Duck"] // Indian Runners have different egg characteristics
    },
    "Quail": {
      "Coturnix": ["Bobwhite"], // Different incubation periods and temperature requirements
      "Bobwhite": ["Coturnix", "Button"] // Different humidity needs
    },
    "Turkey": {
      "Bourbon Red": ["Wild Turkey"], // Domestic vs wild turkey eggs have different needs
      "Royal Palm": ["Wild Turkey"] // Different humidity requirements
    },
    "Goose": {
      "African": ["Chinese"], // Different incubation periods
      "Embden": ["Egyptian"] // Different humidity requirements
    }
  };
  
  // Function to check breed compatibility
  const checkBreedCompatibility = (breeds: string[], species: string): {compatible: boolean, warnings: string[]} => {
    const warnings: string[] = [];
    
    // If we don't have compatibility data for this species, return compatible
    if (!incompatibleBreeds[species]) {
      return { compatible: true, warnings: [] };
    }
    
    // Check each breed against the incompatible list for this species
    for (let i = 0; i < breeds.length; i++) {
      const breed = breeds[i];
      if (incompatibleBreeds[species][breed]) {
        // Check if any incompatible breeds are in our selection
        const conflicts = incompatibleBreeds[species][breed].filter(incompatible => 
          breeds.includes(incompatible)
        );
        
        if (conflicts.length > 0) {
          warnings.push(`${breed} should not be incubated with ${conflicts.join(', ')}`);
        }
      }
    }
    
    return {
      compatible: warnings.length === 0,
      warnings
    };
  };
  
  // Duck breeds list
  const duckBreeds = [
    "Pekin",
    "Rouen",
    "Khaki Campbell",
    "Indian Runner",
    "Muscovy",
    "Call Duck",
    "Swedish",
    "Cayuga",
    "Welsh Harlequin",
    "Magpie"
  ];
  
  // Quail breeds list
  const quailBreeds = [
    "Coturnix",
    "Bobwhite",
    "Button",
    "California",
    "Gambel's",
    "Japanese",
    "Jumbo Coturnix",
    "Mountain",
    "Texas A&M"
  ];
  
  // Turkey breeds list
  const turkeyBreeds = [
    "Broad Breasted White",
    "Broad Breasted Bronze",
    "Bourbon Red",
    "Black Spanish",
    "Narragansett",
    "Royal Palm",
    "Slate",
    "Wild Turkey",
    "Beltsville Small White",
    "White Holland"
  ];
  
  // Goose breeds list
  const gooseBreeds = [
    "Toulouse",
    "Embden",
    "African",
    "Chinese",
    "Pilgrim",
    "Sebastopol",
    "Egyptian",
    "Roman",
    "Buff",
    "Canada"
  ];
  
  // Form state
  const [formData, setFormData] = useState({
    batchName: '',
    species: '',
    varieties: '',
    eggCount: 0,
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    temperature: 99.5,
    humidity: 55
  });
  
  // State for showing breed selection
  const [showBreedSelector, setShowBreedSelector] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  
  // Default incubation settings by species
  const incubationSettings: {[species: string]: {temperature: number, humidity: number}} = {
    "Chicken": { temperature: 99.5, humidity: 55 },
    "Duck": { temperature: 99.5, humidity: 65 },
    "Quail": { temperature: 99.5, humidity: 50 },
    "Turkey": { temperature: 100.0, humidity: 60 },
    "Goose": { temperature: 99.5, humidity: 65 },
    "Pheasant": { temperature: 99.5, humidity: 55 },
    "Guinea Fowl": { temperature: 99.5, humidity: 65 },
    "Peafowl": { temperature: 99.0, humidity: 60 }
  };
  
  // Function to get breeds based on species
  const getBreedsBySpecies = (): string[] => {
    switch (formData.species) {
      case 'Chicken':
        return chickenBreeds;
      case 'Duck':
        return duckBreeds;
      case 'Quail':
        return quailBreeds;
      case 'Turkey':
        return turkeyBreeds;
      case 'Goose':
        return gooseBreeds;
      default:
        return [];
    }
  };
  
  // Function to get default incubation settings for a species
  const getIncubationSettings = (species: string) => {
    return incubationSettings[species] || { temperature: 99.5, humidity: 55 };
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'species') {
      // Get default temperature and humidity for selected species
      const settings = getIncubationSettings(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        varieties: '',
        temperature: settings.temperature,
        humidity: settings.humidity
      }));
      
      setSelectedBreeds([]);
      // Show breed selector for all species that have breeds defined
      setShowBreedSelector(['Chicken', 'Duck', 'Quail', 'Turkey', 'Goose'].includes(value));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'eggCount' || name === 'temperature' || name === 'humidity' 
          ? parseFloat(value) 
          : value
      }));
    }
  };
  
  // State for compatibility warnings
  const [compatibilityWarnings, setCompatibilityWarnings] = useState<string[]>([]);
  
  // Handle breed selection
  const handleBreedSelection = (breed: string) => {
    const isSelected = selectedBreeds.includes(breed);
    let newSelectedBreeds: string[];
    
    if (isSelected) {
      // Remove breed if already selected
      newSelectedBreeds = selectedBreeds.filter((b: string) => b !== breed);
    } else {
      // Add breed if not already selected
      newSelectedBreeds = [...selectedBreeds, breed];
    }
    
    // Check compatibility of the selected breeds
    if (newSelectedBreeds.length > 1) {
      const compatibility = checkBreedCompatibility(newSelectedBreeds, formData.species);
      setCompatibilityWarnings(compatibility.warnings);
    } else {
      setCompatibilityWarnings([]);
    }
    
    setSelectedBreeds(newSelectedBreeds);
    setFormData(prev => ({
      ...prev,
      varieties: newSelectedBreeds.join(', ')
    }));
  };
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate that we have enough eggs available
      if (formData.eggCount > availableEggs && !editMode) {
        alert(`You only have ${availableEggs} eggs available for incubation.`);
        return;
      }
      
      // Calculate expected hatch date (21 days for chicken, 28 for duck, etc.)
      const startDate = new Date(formData.startDate);
      let incubationDays = 21; // Default for chicken
      
      if (formData.species === 'Duck') incubationDays = 28;
      if (formData.species === 'Goose') incubationDays = 30;
      if (formData.species === 'Turkey') incubationDays = 28;
      if (formData.species === 'Quail') incubationDays = 18;
      
      const expectedHatchDate = new Date(startDate);
      expectedHatchDate.setDate(startDate.getDate() + incubationDays);
      
      const newBatch = {
        id: editMode && editBatchId ? editBatchId : `batch-${Date.now()}`,
        batchName: formData.batchName,
        startDate: startDate.toISOString(),
        species: formData.species,
        varieties: formData.varieties.split(',').map(v => v.trim()).filter(v => v !== ''),
        eggCount: formData.eggCount,
        notes: formData.notes,
        status: 'incubating',
        temperature: formData.temperature,
        humidity: formData.humidity,
        expectedHatchDate: expectedHatchDate.toISOString(),
        daysRemaining: incubationDays,
        daysElapsed: 0,
        lastTurned: new Date().toISOString(),
        lastCandled: new Date().toISOString()
      };
      
      let updatedBatches;
      
      if (editMode && editBatchId) {
        // Update existing batch
        
        updatedBatches = batches.map(batch => 
          batch.id === editBatchId ? newBatch : batch
        );
      } else {
        // Add new batch
        updatedBatches = [...batches, newBatch];
      }
      
      // Update state and localStorage
      setBatches(updatedBatches);
      localStorage.setItem('incubationBatches', JSON.stringify(updatedBatches));
      
      // Update available eggs count for display purposes only
      if (!editMode) {
        // Just update the display count after adding a new batch
        setAvailableEggs(prev => Math.max(0, prev - formData.eggCount));
      }
      
      // Reset form
      setFormData({
        batchName: '',
        species: '',
        varieties: '',
        eggCount: 0,
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
        temperature: 99.5,
        humidity: 55
      });
      
      // Close form
      setShowForm(false);
      setEditMode(false);
      setEditBatchId(null);
      
    } catch (error) {
      console.error('Error saving batch:', error);
    }
  };
  
  // Handle edit batch
  const handleEditBatch = (batchId: string) => {
    const batchToEdit = batches.find(b => b.id === batchId);
    
    if (batchToEdit) {
      // Get default temperature and humidity for this species if not already set
      const settings = getIncubationSettings(batchToEdit.species);
      
      // Set form data to batch data
      setFormData({
        batchName: batchToEdit.batchName,
        species: batchToEdit.species,
        varieties: Array.isArray(batchToEdit.varieties) ? batchToEdit.varieties.join(', ') : '',
        eggCount: batchToEdit.eggCount,
        startDate: batchToEdit.startDate,
        notes: batchToEdit.notes || '',
        temperature: batchToEdit.temperature || settings.temperature,
        humidity: batchToEdit.humidity || settings.humidity
      });
      
      // Set selected breeds from varieties
      if (batchToEdit.varieties && Array.isArray(batchToEdit.varieties) && batchToEdit.varieties.length > 0) {
        setSelectedBreeds(batchToEdit.varieties);
        
        // Check compatibility of the selected breeds
        if (batchToEdit.varieties.length > 1) {
          const compatibility = checkBreedCompatibility(batchToEdit.varieties, batchToEdit.species);
          setCompatibilityWarnings(compatibility.warnings);
        } else {
          setCompatibilityWarnings([]);
        }
      } else {
        setSelectedBreeds([]);
        setCompatibilityWarnings([]);
      }
      
      // Show breed selector for all species that have breeds defined
      setShowBreedSelector(['Chicken', 'Duck', 'Quail', 'Turkey', 'Goose'].includes(batchToEdit.species));
      
      // Set edit mode
      setEditMode(true);
      setEditBatchId(batchId);
      setShowForm(true);
    }
  };

  // Load batches from localStorage or use sample data if none exists
  const [batches, setBatches] = useState<EggBatch[]>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedBatches = localStorage.getItem('incubationBatches');
      if (savedBatches) {
        try {
          return JSON.parse(savedBatches);
        } catch (e) {
          console.error('Error parsing saved batches:', e);
        }
      }
    }
    
    // Default sample data if no saved batches
    return [
      {
        id: "batch-1",
        batchName: "Spring Chickens 2025",
        startDate: "2025-05-15T00:00:00",
        species: "Chicken",
        varieties: ["Rhode Island Red", "Plymouth Rock"],
        eggCount: 12,
        notes: "First batch of the season",
        status: "incubating",
        temperature: 99.5,
        humidity: 55,
        expectedHatchDate: "2025-06-05T00:00:00",
        daysRemaining: 14,
        daysElapsed: 7,
        lastTurned: "2025-05-22T08:30:00",
        lastCandled: "2025-05-20T10:15:00"
      },
      {
        id: "batch-2",
        batchName: "Duck Eggs - Mallard",
        startDate: "2025-05-20T00:00:00",
        species: "Duck",
        varieties: ["Mallard"],
        eggCount: 8,
        notes: "From local farm",
        status: "incubating",
        temperature: 99.5,
        humidity: 60,
        expectedHatchDate: "2025-06-17T00:00:00",
        daysRemaining: 26,
        daysElapsed: 2,
        lastTurned: "2025-05-22T08:30:00",
        lastCandled: "2025-05-22T10:15:00"
      }
    ];
  });
  
  // Function to handle delete button click
  const handleDeleteButtonClick = (batchId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!batchId) return;
    e.preventDefault();
    e.stopPropagation();
    setDeleteBatchId(batchId);
    setShowDeleteConfirm(true);
  };
  
  // Function to handle complete button click
  const handleCompleteButtonClick = (batchId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!batchId) return;
    e.preventDefault();
    e.stopPropagation();
    setCompleteBatchId(batchId);
    setShowCompleteConfirm(true);
  };
  
  // Function to handle delete batch
  const handleDeleteBatch = () => {
    if (deleteBatchId) {
      try {
        const newBatches = batches.filter(b => b.id !== deleteBatchId);
        setBatches(newBatches);
        localStorage.setItem('incubationBatches', JSON.stringify(newBatches));
      } catch (error) {
        console.error('Error deleting batch:', error);
      } finally {
        setShowDeleteConfirm(false);
        setDeleteBatchId(null);
      }
    }
  };
  
  // Function to handle complete batch
  const handleCompleteBatch = () => {
    if (completeBatchId) {
      try {
        const newBatches = batches.map(b => 
          b.id === completeBatchId ? {...b, status: 'completed'} : b
        );
        setBatches(newBatches);
        localStorage.setItem('incubationBatches', JSON.stringify(newBatches));
      } catch (error) {
        console.error('Error completing batch:', error);
      } finally {
        setShowCompleteConfirm(false);
        setCompleteBatchId(null);
      }
    }
  };
  
  // Component's return statement
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Incubation Batches</h1>
              <button 
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                onClick={() => setShowForm(true)}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New Batch
              </button>
            </div>
            
            {/* Add/Edit Batch Form */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {editMode ? 'Edit Batch' : 'Add New Batch'}
                    </h2>
                    <button 
                      onClick={() => {
                        setShowForm(false);
                        setEditMode(false);
                        setEditBatchId(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                        <input
                          type="text"
                          name="batchName"
                          value={formData.batchName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                        <select
                          name="species"
                          value={formData.species}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select Species</option>
                          <option value="Chicken">Chicken</option>
                          <option value="Duck">Duck</option>
                          <option value="Quail">Quail</option>
                          <option value="Turkey">Turkey</option>
                          <option value="Goose">Goose</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Varieties</label>
                        <input
                          type="text"
                          name="varieties"
                          value={formData.varieties}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="E.g. Leghorn, Rhode Island Red"
                        />
                        
                        {/* Breed selector */}
                        {showBreedSelector && (
                          <div className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto">
                            <div className="text-sm font-medium text-gray-700 mb-1">Select from common breeds:</div>
                            <div className="flex flex-wrap gap-1">
                              {getBreedsBySpecies().map(breed => (
                                <button
                                  key={breed}
                                  type="button"
                                  onClick={() => handleBreedSelection(breed)}
                                  className={`px-2 py-1 text-xs rounded-full ${selectedBreeds.includes(breed) 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                    : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}
                                >
                                  {breed}
                                </button>
                              ))}
                            </div>
                            

                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Egg Count</label>
                          <div className="flex items-center">
                            <InformationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-xs text-red-500 font-medium">{availableEggs} eggs available</span>
                          </div>
                        </div>
                        <input
                          type="number"
                          name="eggCount"
                          value={formData.eggCount}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min="1"
                          max={availableEggs}
                          required
                        />
                        
                        {/* Compatibility warnings */}
                        {compatibilityWarnings.length > 0 && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                            <div className="text-sm font-medium text-red-700 mb-1">⚠️ Compatibility Warnings:</div>
                            <ul className="text-xs text-red-600 list-disc pl-4">
                              {compatibilityWarnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                            <p className="text-xs text-red-600 mt-1">
                              These breeds have different incubation requirements and may not develop properly together.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                        <input
                          type="number"
                          name="temperature"
                          value={formData.temperature}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          step="0.1"
                          min="90"
                          max="105"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
                        <input
                          type="number"
                          name="humidity"
                          value={formData.humidity}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min="30"
                          max="80"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditMode(false);
                          setEditBatchId(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                      >
                        {editMode ? 'Update Batch' : 'Create Batch'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Batch List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch) => {
                // Calculate progress percentage
                let progress = 0;
                try {
                  if (batch.startDate && batch.expectedHatchDate) {
                    const startDate = new Date(batch.startDate);
                    const expectedHatchDate = new Date(batch.expectedHatchDate);
                    const today = new Date();
                    const totalDays = Math.round((expectedHatchDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (totalDays > 0) {
                      const daysElapsed = Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                      progress = Math.min(Math.max(Math.round((daysElapsed / totalDays) * 100), 0), 100);
                    }
                  }
                } catch (e) {
                  console.error('Error calculating progress:', e);
                  progress = 0;
                }
                
                // Determine status colors
                let statusColor = "text-gray-700";
                let statusBg = "bg-gray-50";
                let statusBorder = "border-gray-200";
                let statusText = "Unknown";
                
                if (batch.status) {
                  statusText = batch.status.charAt(0).toUpperCase() + batch.status.slice(1);
                  
                  switch(batch.status) {
                    case "incubating":
                      statusColor = "text-amber-700";
                      statusBg = "bg-amber-50";
                      statusBorder = "border-amber-200";
                      break;
                    case "hatched":
                      statusColor = "text-green-700";
                      statusBg = "bg-green-50";
                      statusBorder = "border-green-200";
                      break;
                    case "failed":
                      statusColor = "text-red-700";
                      statusBg = "bg-red-50";
                      statusBorder = "border-red-200";
                      break;
                    case "completed":
                      statusColor = "text-blue-700";
                      statusBg = "bg-blue-50";
                      statusBorder = "border-blue-200";
                      break;
                  }
                }
                
                return (
                  <div 
                    key={batch.id} 
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{batch.batchName}</h3>
                          <p className="text-sm text-gray-500">{batch.species} {batch.varieties && batch.varieties.length > 0 ? `- ${batch.varieties.join(", ")}` : ''}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor} border ${statusBorder}`}>
                          {statusText}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-800 font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-600">Eggs</p>
                          <p className="font-medium">{batch.eggCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Hatch</p>
                          <p className="font-medium">{batch.expectedHatchDate ? new Date(batch.expectedHatchDate).toLocaleDateString() : 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Temperature</p>
                          <p className="font-medium">{batch.temperature !== undefined ? `${batch.temperature}°F` : 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Humidity</p>
                          <p className="font-medium">{batch.humidity !== undefined ? `${batch.humidity}%` : 'Not set'}</p>
                        </div>
                      </div>
                      
                      {/* Batch actions */}
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={(e) => handleCompleteButtonClick(batch.id, e)}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded border border-green-200 text-sm hover:bg-green-100 transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleEditBatch(batch.id)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 text-sm hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDeleteButtonClick(batch.id, e)}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded border border-red-200 text-sm hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Phase-specific instructions */}
                    {batch.status === "incubating" && (() => {
                      try {
                        if (batch.startDate && batch.expectedHatchDate) {
                          const startDate = new Date(batch.startDate);
                          const expectedHatchDate = new Date(batch.expectedHatchDate);
                          const totalDays = Math.round((expectedHatchDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                          
                          if (totalDays > 0) {
                            const daysElapsed = Math.round((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                            const turnUntilDay = totalDays - 3; // Stop turning 3 days before hatch
                            
                            let instructions = "";
                            let bgColor = "bg-gray-50";
                            let borderColor = "border-gray-200";
                            let textColor = "text-gray-700";
                            
                            if (daysElapsed < 3) {
                              // Early period
                              instructions = "Turn eggs 3-5 times daily. Maintain temperature and humidity carefully during this critical period.";
                            } else if (daysElapsed < turnUntilDay) {
                              // Middle period
                              instructions = "Continue turning eggs 3 times daily. Candle eggs to check development and remove any clear (infertile) eggs.";
                            } else if (daysElapsed < totalDays - 1) {
                              // Lockdown period
                              instructions = "LOCKDOWN PHASE: Stop turning eggs. Increase humidity to 65-70%. Minimize opening incubator.";
                              bgColor = "bg-amber-100";
                              borderColor = "border-amber-400";
                              textColor = "text-amber-900";
                            } else {
                              // Hatching imminent
                              instructions = "HATCHING IMMINENT: Eggs may begin pipping. Do not open incubator. Maintain high humidity.";
                              bgColor = "bg-amber-200";
                              borderColor = "border-amber-500";
                              textColor = "text-amber-900 font-medium";
                            }
                            
                            return (
                              <div className={`mt-2 p-2 rounded-lg ${bgColor} ${textColor} text-sm border ${borderColor}`}>
                                <p>{instructions}</p>
                              </div>
                            );
                          }
                        }
                      } catch (e) {
                        console.error('Error rendering phase instructions:', e);
                      }
                      
                      // Default instruction if dates are missing or invalid
                      return (
                        <div className="mt-2 p-2 rounded-lg bg-gray-50 text-gray-700 text-sm border border-gray-200">
                          <p>Turn eggs 3-5 times daily. Monitor temperature and humidity levels.</p>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this batch? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteBatchId(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBatch}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Complete Confirmation Modal */}
          {showCompleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Completion</h3>
                <p className="text-gray-600 mb-6">Mark this batch as completed? This will move it to the completed state.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCompleteConfirm(false);
                      setCompleteBatchId(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteBatch}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
