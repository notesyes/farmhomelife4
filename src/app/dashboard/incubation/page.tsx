"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

// Icons
import { PlusIcon, ClockIcon } from '@heroicons/react/24/outline';

// Utilities
import { format } from 'date-fns';

// Types
type SpeciesType = 'Chicken' | 'Duck' | 'Goose' | 'Turkey' | 'Quail';
type BatchStatus = 'incubating' | 'hatched' | 'failed' | 'completed';
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
  alerts?: IncubationAlert[];
}

interface IncubationAlert {
  id: string;
  type: 'turning' | 'lockdown' | 'hatch';
  message: string;
  date: string;
  acknowledged: boolean;
}

// Commented out until implemented
/* interface BreedRequirement {
  temp: number;
  humidity: number;
  reason: string;
} */

interface IncompatibleBreedRule {
  reason: string;
  detailedExplanation: string;
  severity: 'warning' | 'error';
  canMix: boolean;
  recommendation: string;
}

interface CompatibilityWarning {
  id: string;
  breeds: string[];
  reason: string;
  severity: 'warning' | 'error';
  recommendation: string;
  detailedExplanation: string;
  showDetails: boolean;
}

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
  // Incompatible breed rules database
  const incompatibleBreeds = useMemo<Record<string, IncompatibleBreedRule>>(() => ({
    // Chicken compatibility rules
    "Silkie-Standard": {
      reason: "Different humidity requirements",
      detailedExplanation: "Silkie eggs benefit from higher humidity throughout incubation due to their unique genetic characteristics.",
      severity: "warning",
      canMix: true,
      recommendation: "Consider using a humidity chamber for Silkie eggs"
    },
    "Bantam-Standard": {
      reason: "Size difference affects incubation",
      detailedExplanation: "Bantam eggs are significantly smaller than standard breed eggs and may develop faster or be affected by air circulation differently.",
      severity: "warning",
      canMix: true,
      recommendation: "Place bantam eggs in a separate section or tray"
    },
    "Brahma-Leghorn": {
      reason: "Different incubation periods",
      detailedExplanation: "Brahma eggs typically take 1-2 days longer to hatch than Leghorn eggs.",
      severity: "warning",
      canMix: true,
      recommendation: "Consider staggering the start dates"
    },
    "Silkie-Brahma": {
      reason: "Significantly different humidity and temperature needs",
      detailedExplanation: "These breeds have evolved in very different environments and have different shell porosity and embryo development needs.",
      severity: "error",
      canMix: false,
      recommendation: "Do not incubate these breeds together"
    },
    "Jersey Giant-Bantam": {
      reason: "Extreme size difference",
      detailedExplanation: "Jersey Giants produce much larger eggs than Bantams, which can lead to uneven heat distribution and airflow issues.",
      severity: "error",
      canMix: false,
      recommendation: "Incubate separately with appropriate settings for each"
    },
    
    // Duck compatibility rules
    "Muscovy-Pekin": {
      reason: "Different humidity preferences",
      detailedExplanation: "Muscovy ducks are adapted to drier conditions and their eggs do better with lower humidity than other duck breeds.",
      severity: "warning",
      canMix: true,
      recommendation: "Consider using a humidity chamber for Muscovy eggs"
    },
    
    // Quail compatibility rules
    "Coturnix-Bobwhite": {
      reason: "Different incubation periods",
      detailedExplanation: "Coturnix quail eggs hatch in 17-18 days while Bobwhite quail eggs take 23-24 days.",
      severity: "error",
      canMix: false,
      recommendation: "Incubate separately with appropriate timing"
    }
  }), []);
  
  // Species data for default temperature and humidity settings
  const speciesData = useMemo(() => ({
    "Chicken": {
      temp: 99.5,
      humidity: 55,
      incubationDays: 21,
      varieties: [
        "Silkie", "Brahma", "Leghorn", "Rhode Island Red", "Plymouth Rock", 
        "Orpington", "Wyandotte", "Jersey Giant", "Bantam", "Standard"
      ]
    },
    "Duck": {
      temp: 99.5,
      humidity: 65,
      incubationDays: 28,
      varieties: [
        "Pekin", "Muscovy", "Mallard", "Rouen", "Runner", 
        "Khaki Campbell", "Cayuga", "Swedish", "Magpie", "Call"
      ]
    },
    "Goose": {
      temp: 99.5,
      humidity: 65,
      incubationDays: 30,
      varieties: [
        "Toulouse", "Embden", "African", "Chinese", "Pilgrim", 
        "Sebastopol", "American Buff", "Egyptian", "Roman", "Pomeranian"
      ]
    },
    "Turkey": {
      temp: 99.5,
      humidity: 60,
      incubationDays: 28,
      varieties: [
        "Broad Breasted White", "Broad Breasted Bronze", "Bourbon Red", "Narragansett", "Royal Palm", 
        "Black Spanish", "Blue Slate", "Midget White", "Beltsville Small White", "Standard Bronze"
      ]
    },
    "Quail": {
      temp: 99.5,
      humidity: 55,
      incubationDays: 18,
      varieties: [
        "Coturnix", "Bobwhite", "Button", "California", "Gambel's", 
        "Mountain", "Japanese", "Texas A&M", "Jumbo Brown", "Tibetan"
      ]
    }
  }), []);
  
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
        notes: "First batch of the season, from our best layers.",
        status: "incubating",
        temperature: 99.5,
        humidity: 55,
        expectedHatchDate: "2025-06-05T00:00:00",
        daysRemaining: 21,
        lastTurned: "2025-05-25T08:00:00",
        lastCandled: "2025-05-20T10:00:00"
      },
      {
        id: "batch-2",
        batchName: "Quail Experiment",
        startDate: "2025-05-20T00:00:00",
        species: "Quail",
        varieties: ["Coturnix"],
        eggCount: 24,
        notes: "Testing higher humidity for better hatch rates.",
        status: "incubating",
        temperature: 99.5,
        humidity: 60,
        expectedHatchDate: "2025-06-07T00:00:00",
        daysRemaining: 16,
        lastTurned: "2025-05-25T08:30:00",
        lastCandled: "2025-05-25T10:15:00"
      }
    ];
  });

  // State for showing/hiding the add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesType | ''>('');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [compatibilityWarnings, setCompatibilityWarnings] = useState<CompatibilityWarning[]>([]);
  const [temperature, setTemperature] = useState<number>(99.5);
  const [humidity, setHumidity] = useState<number>(55);
  const [batchName, setBatchName] = useState<string>('');
  const [eggCount, setEggCount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState<string>('');
  const [activeAlerts, setActiveAlerts] = useState<{batchId: string, alerts: IncubationAlert[]}[]>([]);
  
  // Reference to batches to prevent infinite update loops
  const batchesRef = useRef<EggBatch[]>(batches);
  // const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F");
  
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
  
  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
  // Function to generate alerts for a batch - wrapped in useCallback to maintain referential stability
  const generateAlertsForBatch = useMemo(() => (batch: EggBatch): IncubationAlert[] => {
    if (batch.status !== 'incubating') return [];
    
    const today = new Date();
    const speciesData = {
      "Chicken": { days: 21, turnUntil: 18 },
      "Duck": { days: 28, turnUntil: 25 },
      "Goose": { days: 30, turnUntil: 27 },
      "Turkey": { days: 28, turnUntil: 25 },
      "Quail": { days: 18, turnUntil: 15 }
    };
    
    const totalDays = speciesData[batch.species]?.days || 21;
    const turnUntilDay = speciesData[batch.species]?.turnUntil || 18;
    const startDateObj = new Date(batch.startDate);
    // Calculate days elapsed for alert logic
    const daysElapsed = Math.floor((today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate important dates
    const turnEndDate = new Date(startDateObj);
    turnEndDate.setDate(startDateObj.getDate() + turnUntilDay);
    
    const lockdownDate = new Date(startDateObj);
    lockdownDate.setDate(startDateObj.getDate() + totalDays - 3);
    
    const hatchDate = new Date(startDateObj);
    hatchDate.setDate(startDateObj.getDate() + totalDays);
    
    // Create alerts for upcoming or current events
    const newAlerts: IncubationAlert[] = [];
    
    // Check for turning end alert (1 day before)
    const dayBeforeTurnEnd = new Date(turnEndDate);
    dayBeforeTurnEnd.setDate(turnEndDate.getDate() - 1);
    
    // Use daysElapsed to determine if we're at the turning end date
    if (isSameDay(today, dayBeforeTurnEnd) || daysElapsed === turnUntilDay - 1) {
      newAlerts.push({
        id: `${batch.id}-turning-${today.toISOString().split('T')[0]}`,
        type: 'turning',
        message: `TURNING ALERT: Stop turning eggs tomorrow for ${batch.batchName}`,
        date: format(turnEndDate, 'yyyy-MM-dd'),
        acknowledged: false
      });
    }
    
    // Check for lockdown alert
    if (isSameDay(today, lockdownDate) || daysElapsed === totalDays - 3) {
      newAlerts.push({
        id: `${batch.id}-lockdown-${today.toISOString().split('T')[0]}`,
        type: 'lockdown',
        message: `LOCKDOWN ALERT: Begin lockdown today for ${batch.batchName}. Stop turning and increase humidity.`,
        date: format(lockdownDate, 'yyyy-MM-dd'),
        acknowledged: false
      });
    }
    
    // Check for hatch day alert
    if (isSameDay(today, hatchDate) || daysElapsed === totalDays) {
      newAlerts.push({
        id: `${batch.id}-hatch-${today.toISOString().split('T')[0]}`,
        type: 'hatch',
        message: `HATCH DAY ALERT: ${batch.batchName} is due to hatch today!`,
        date: format(hatchDate, 'yyyy-MM-dd'),
        acknowledged: false
      });
    }
    
    // Check for one day before hatch alert
    const dayBeforeHatch = new Date(hatchDate);
    dayBeforeHatch.setDate(hatchDate.getDate() - 1);
    
    if (isSameDay(today, dayBeforeHatch) || daysElapsed === totalDays - 1) {
      newAlerts.push({
        id: `${batch.id}-prehatch-${today.toISOString().split('T')[0]}`,
        type: 'hatch',
        message: `PRE-HATCH ALERT: ${batch.batchName} is due to hatch tomorrow! Ensure humidity is high.`,
        date: format(dayBeforeHatch, 'yyyy-MM-dd'),
        acknowledged: false
      });
    }
    
    return newAlerts;
  }, []);
  
  // Update the ref whenever batches changes and save to localStorage
  useEffect(() => {
    batchesRef.current = batches;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('incubationBatches', JSON.stringify(batches));
    }
  }, [batches]);
  
  // Recalculate days remaining for each batch on page load and every day
  useEffect(() => {
    const updateDaysRemaining = () => {
      const today = new Date();
      const currentBatches = batchesRef.current; // Use the ref to avoid dependency issues
      
      const updatedBatches = currentBatches.map(batch => {
        if (batch.status !== 'incubating') return batch;
        
        const speciesData = {
          "Chicken": { days: 21, turnUntil: 18 },
          "Duck": { days: 28, turnUntil: 25 },
          "Goose": { days: 30, turnUntil: 27 },
          "Turkey": { days: 28, turnUntil: 25 },
          "Quail": { days: 18, turnUntil: 15 }
        };
        
        const totalDays = speciesData[batch.species]?.days || 21;
        const startDate = new Date(batch.startDate);
        const expectedHatchDate = new Date(startDate);
        expectedHatchDate.setDate(startDate.getDate() + totalDays);
        
        // Calculate days remaining based on today and expected hatch date
        const daysRemaining = Math.max(0, Math.ceil((expectedHatchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        
        return {
          ...batch,
          daysRemaining,
          expectedHatchDate: expectedHatchDate.toISOString()
        };
      });
      
      // Only update if there are changes
      if (JSON.stringify(updatedBatches) !== JSON.stringify(currentBatches)) {
        setBatches(updatedBatches);
      }
    };
    
    // Update immediately and then daily
    updateDaysRemaining();
    const intervalId = setInterval(updateDaysRemaining, 1000 * 60 * 60); // Check every hour
    
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array is fine since we're using the ref
  
  // Check for important incubation events and create alerts
  useEffect(() => {
    // This effect handles alert generation and management
    // Initialize batches with alerts on first load
    const initializeAlertsForBatches = () => {
      const currentBatches = batchesRef.current;
      const batchesWithAlerts = currentBatches.map(batch => {
        const newAlerts = generateAlertsForBatch(batch);
        // Don't create duplicates of existing alerts
        const existingAlertIds = (batch.alerts || []).map(alert => alert.id);
        const uniqueNewAlerts = newAlerts.filter(alert => !existingAlertIds.includes(alert.id));
        
        if (uniqueNewAlerts.length === 0) return batch;
        
        return {
          ...batch,
          alerts: [...(batch.alerts || []), ...uniqueNewAlerts]
        };
      });
      
      // Only update if there are actual changes to avoid infinite loops
      const batchesString = JSON.stringify(currentBatches);
      const updatedBatchesString = JSON.stringify(batchesWithAlerts);
      
      if (batchesString !== updatedBatchesString) {
        setBatches(batchesWithAlerts);
      }
    };
    
    // Update active alerts for display
    const updateActiveAlerts = () => {
      const currentBatches = batchesRef.current;
      const allActiveAlerts = currentBatches
        .filter(batch => batch.alerts && batch.alerts.length > 0)
        .map(batch => ({
          batchId: batch.id,
          alerts: batch.alerts?.filter(alert => !alert.acknowledged) || []
        }))
        .filter(item => item.alerts.length > 0);
      
      setActiveAlerts(allActiveAlerts);
    };
    
    // Initialize alerts
    initializeAlertsForBatches();
    updateActiveAlerts();
    
    // Set up a daily check for new alerts
    const intervalId = setInterval(() => {
      initializeAlertsForBatches();
      updateActiveAlerts();
    }, 1000 * 60 * 60); // Check every hour
    
    return () => clearInterval(intervalId);
  }, [generateAlertsForBatch]); // Include generateAlertsForBatch which is stable due to useMemo
  
  // Function to acknowledge an alert
  const acknowledgeAlert = (batchId: string, alertId: string) => {
    setBatches(prevBatches => {
      return prevBatches.map(batch => {
        if (batch.id !== batchId) return batch;
        
        return {
          ...batch,
          alerts: batch.alerts?.map(alert => {
            if (alert.id === alertId) {
              return { ...alert, acknowledged: true };
            }
            return alert;
          })
        };
      });
    });
    
    // Update active alerts
    setActiveAlerts(prev => {
      const updated = prev.map(item => {
        if (item.batchId !== batchId) return item;
        
        return {
          ...item,
          alerts: item.alerts.filter(alert => alert.id !== alertId)
        };
      }).filter(item => item.alerts.length > 0);
      
      return updated;
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20 mb-6">
              <h1 className="text-3xl font-bold text-amber-700 flex items-center gap-3 mb-2">
                <span className="text-4xl">🥚</span> Egg Incubation Management
              </h1>
              <p className="text-amber-800">
                Track and manage your egg batches, monitor incubation progress, and record important events.
              </p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center hover:translate-y-[-2px] hover:shadow-lg transition duration-300"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Add New Batch
                </button>
                
                {activeAlerts.length > 0 && (
                  <div className="text-amber-800 flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="font-medium">{activeAlerts.reduce((total, item) => total + item.alerts.length, 0)} active alerts</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Incubation Alerts Section */}
            {activeAlerts.length > 0 && (
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 mb-6">
                <h2 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Important Incubation Alerts
                </h2>
                
                <div className="space-y-3">
                  {activeAlerts.map(item => (
                    <div key={item.batchId} className="border border-amber-100 rounded-lg overflow-hidden">
                      <div className="bg-amber-50 px-4 py-2 font-medium text-amber-800 border-b border-amber-100">
                        {batches.find(b => b.id === item.batchId)?.batchName}
                      </div>
                      
                      {item.alerts.map(alert => (
                        <div key={alert.id} className={`px-4 py-3 flex justify-between items-center ${alert.type === 'hatch' ? 'bg-amber-50' : alert.type === 'lockdown' ? 'bg-amber-50' : 'bg-white'}`}>
                          <div className="flex items-start">
                            <div className={`p-1 rounded-full flex-shrink-0 ${alert.type === 'hatch' ? 'bg-red-100 text-red-600' : alert.type === 'lockdown' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'} mr-3`}>
                              {alert.type === 'hatch' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              ) : alert.type === 'lockdown' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">{alert.message}</p>
                              <p className="text-xs text-gray-500">Date: {alert.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => acknowledgeAlert(item.batchId, alert.id)}
                            className="ml-4 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full hover:bg-amber-200 transition-colors"
                          >
                            Acknowledge
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {showAddForm && (
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20 mb-6">
                <h2 className="text-xl font-semibold text-amber-700 mb-4">Add New Batch</h2>
                
                {compatibilityWarnings.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-amber-700 mb-2">Compatibility Warnings</h3>
                    <div className="space-y-3">
                      {compatibilityWarnings.map(warning => (
                        <div 
                          key={warning.id}
                          className={`p-4 rounded-lg ${
                            warning.severity === 'error' 
                              ? 'bg-red-50 border border-red-200' 
                              : 'bg-amber-50 border border-amber-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`p-1 rounded-full ${
                              warning.severity === 'error' ? 'bg-red-100' : 'bg-amber-100'
                            } mr-3`}>
                              {warning.severity === 'error' ? (
                                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${
                                warning.severity === 'error' ? 'text-red-800' : 'text-amber-800'
                              }`}>
                                {warning.breeds.join(' + ')}: {warning.reason}
                              </p>
                              <p className={`text-sm ${
                                warning.severity === 'error' ? 'text-red-600' : 'text-amber-600'
                              }`}>
                                {warning.recommendation}
                              </p>
                                <button
                                  type="button"
                                  className="mt-2 px-3 py-1 text-sm font-medium bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md border border-amber-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                                  onClick={() => {
                                    setCompatibilityWarnings(warnings => 
                                      warnings.map(w => 
                                        w.id === warning.id 
                                          ? {...w, showDetails: !w.showDetails} 
                                          : w
                                      )
                                    );
                                  }}
                                >
                                  {warning.showDetails ? '↑ Hide details' : '↓ Show details'}
                                </button>
                                {warning.showDetails && (
                                  <p className="mt-1 text-xs text-gray-600">
                                    {warning.detailedExplanation}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-1">Batch Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white text-amber-900" 
                      placeholder="Spring Chickens 2025"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">Species</label>
                      <select 
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white text-amber-900"
                        value={selectedSpecies}
                        onChange={(e) => {
                          const species = e.target.value as SpeciesType | '';
                          setSelectedSpecies(species);
                          setSelectedBreeds([]);
                          
                          // Automatically set temperature and humidity based on species
                          if (species && speciesData[species]) {
                            setTemperature(speciesData[species].temp);
                            setHumidity(speciesData[species].humidity);
                          }
                        }}
                      >
                        <option value="">Select Species</option>
                        <option value="Chicken">Chicken</option>
                        <option value="Duck">Duck</option>
                        <option value="Goose">Goose</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Quail">Quail</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">Egg Count</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white text-amber-900" 
                        placeholder="24"
                        value={eggCount}
                        onChange={(e) => setEggCount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white text-amber-900" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  
                  {selectedSpecies && (
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">Breeds/Varieties</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {speciesData[selectedSpecies].varieties.map(variety => (
                          <div key={variety} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`variety-${variety}`}
                              checked={selectedBreeds.includes(variety)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Add the breed
                                  const newBreeds = [...selectedBreeds, variety];
                                  setSelectedBreeds(newBreeds);
                                  
                                  // Check for compatibility issues
                                  const newWarnings: CompatibilityWarning[] = [];
                                  
                                  // Check each pair of breeds
                                  for (let i = 0; i < newBreeds.length; i++) {
                                    for (let j = i + 1; j < newBreeds.length; j++) {
                                      const breed1 = newBreeds[i];
                                      const breed2 = newBreeds[j];
                                      
                                      // Check both orders of the pair
                                      const key1 = `${breed1}-${breed2}`;
                                      const key2 = `${breed2}-${breed1}`;
                                      
                                      if (incompatibleBreeds[key1] || incompatibleBreeds[key2]) {
                                        const rule = incompatibleBreeds[key1] || incompatibleBreeds[key2];
                                        
                                        newWarnings.push({
                                          id: `${key1}-${Date.now()}`,
                                          breeds: [breed1, breed2],
                                          reason: rule.reason,
                                          severity: rule.severity,
                                          recommendation: rule.recommendation,
                                          detailedExplanation: rule.detailedExplanation,
                                          showDetails: false
                                        });
                                      }
                                    }
                                  }
                                  
                                  if (newWarnings.length > 0) {
                                    setCompatibilityWarnings(prev => {
                                      // Filter out any warnings that involve the current breeds
                                      const filtered = prev.filter(w => {
                                        return !w.breeds.includes(variety);
                                      });
                                      
                                      return [...filtered, ...newWarnings];
                                    });
                                  }
                                } else {
                                  // Remove the breed
                                  setSelectedBreeds(prev => prev.filter(b => b !== variety));
                                  
                                  // Remove any warnings involving this breed
                                  setCompatibilityWarnings(prev => 
                                    prev.filter(w => !w.breeds.includes(variety))
                                  );
                                }
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={`variety-${variety}`} className="text-sm text-amber-800">
                              {variety}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">Temperature (°F)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={temperature}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemperature(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white text-amber-900" 
                        placeholder="99.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">Humidity (%)</label>
                      <input 
                        type="number" 
                        value={humidity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHumidity(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white text-amber-900" 
                        placeholder="55"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-1">Notes</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white text-amber-900" 
                      placeholder="Any special notes about this batch..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg shadow-md hover:translate-y-[-2px] hover:shadow-lg transition duration-300"
                      onClick={() => {
                        // Validate form
                        if (!batchName.trim()) {
                          alert('Please enter a batch name');
                          return;
                        }
                        if (!selectedSpecies) {
                          alert('Please select a species');
                          return;
                        }
                        if (!eggCount || parseInt(eggCount) <= 0) {
                          alert('Please enter a valid egg count');
                          return;
                        }

                        // Calculate expected hatch date based on species
                        const incubationDays = selectedSpecies ? speciesData[selectedSpecies].incubationDays : 21;
                        const startDateObj = new Date(startDate);
                        const expectedHatchDate = new Date(startDateObj);
                        expectedHatchDate.setDate(startDateObj.getDate() + incubationDays);

                        // Create new batch
                        const newBatch: EggBatch = {
                          id: `batch-${Date.now()}`,
                          batchName: batchName,
                          startDate: startDateObj.toISOString(),
                          species: selectedSpecies,
                          varieties: selectedBreeds,
                          eggCount: parseInt(eggCount),
                          notes: notes,
                          status: 'incubating',
                          temperature: temperature,
                          humidity: humidity,
                          expectedHatchDate: expectedHatchDate.toISOString(),
                          daysRemaining: incubationDays,
                          lastTurned: new Date().toISOString(),
                          lastCandled: new Date().toISOString()
                        };

                        // Add to batches
                        setBatches(prev => [newBatch, ...prev]);

                        // Reset form
                        setBatchName('');
                        setSelectedSpecies('');
                        setSelectedBreeds([]);
                        setEggCount('');
                        setStartDate(format(new Date(), 'yyyy-MM-dd'));
                        setNotes('');
                        setTemperature(99.5);
                        setHumidity(55);
                        setCompatibilityWarnings([]);
                        
                        // Close form
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
              <div key={batch.id} className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg border border-white border-opacity-30 overflow-hidden mb-4">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-700">{batch.batchName}</h3>
                      <p className="text-amber-600">{batch.species} • {batch.eggCount} eggs</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // For now, just show an alert
                          alert(`Edit batch: ${batch.batchName}`);
                          // In the future, this would open an edit form
                        }}
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-colors"
                        title="Edit batch"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete batch: ${batch.batchName}?`)) {
                            const newBatches = batches.filter(b => b.id !== batch.id);
                            setBatches(newBatches);
                            // Also update localStorage
                            localStorage.setItem('incubationBatches', JSON.stringify(newBatches));
                          }
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete batch"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {batch.status === 'incubating' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm(`Mark this batch as completed? This will move it to the completed state.`)) {
                              const newBatches = batches.map(b => 
                                b.id === batch.id ? {...b, status: 'completed' as BatchStatus} : b
                              );
                              setBatches(newBatches);
                              // Also update localStorage
                              localStorage.setItem('incubationBatches', JSON.stringify(newBatches));
                            }
                          }}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                          title="Mark as completed"
                          type="button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-amber-600">Start Date</p>
                      <p className="font-medium text-amber-900">{format(new Date(batch.startDate), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-amber-600">Expected Hatch</p>
                      <p className="font-medium text-amber-900">{format(new Date(batch.expectedHatchDate), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-amber-600">Temperature</p>
                      <p className="font-medium text-amber-900">{batch.temperature}°F</p>
                    </div>
                    <div>
                      <p className="text-sm text-amber-600">Humidity</p>
                      <p className="font-medium text-amber-900">{batch.humidity}%</p>
                    </div>
                  </div>
                  
                  {batch.status === 'completed' && (
                    <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="text-green-700 font-medium">
                          Batch completed
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {batch.status === 'incubating' && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-center">
                        <ClockIcon className="h-5 w-5 text-amber-600 mr-2" />
                        <div>
                          <p className="text-amber-700 font-medium">
                            {batch.daysRemaining} days remaining
                          </p>
                        </div>
                      </div>
                      
                      {/* Incubation Progress Bar */}
                      <div className="space-y-2 bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-amber-800">Incubation Timeline</h4>
                          <div className="relative h-5 bg-white rounded-full overflow-hidden shadow-inner border border-amber-200">
                          {(() => {
                            // Calculate progress based on start date and species incubation period
                            const speciesData = {
                              "Chicken": { days: 21, turnUntil: 18 },
                              "Duck": { days: 28, turnUntil: 25 },
                              "Goose": { days: 30, turnUntil: 27 },
                              "Turkey": { days: 28, turnUntil: 25 },
                              "Quail": { days: 18, turnUntil: 15 }
                            };
                            
                            const totalDays = speciesData[batch.species]?.days || 21;
                            const turnUntilDay = speciesData[batch.species]?.turnUntil || 18;
                            const currentDay = totalDays - batch.daysRemaining + 1;
                            const lockdownDay = turnUntilDay + 1;
                            
                            // Calculate days until each phase
                            const daysUntilLockdown = Math.max(0, lockdownDay - currentDay);
                            const daysUntilHatch = Math.max(0, totalDays - currentDay + 1);
                            
                            return (
                              <>
                                <div className="flex flex-col items-center">
                                  <div className={`w-2 h-2 rounded-full ${currentDay === 1 ? 'bg-amber-400 ring-2 ring-amber-300' : 'bg-amber-400'} mb-1`}></div>
                                  <span>Start</span>
                                  <span className="mt-1 font-medium">Day 1</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className={`w-2 h-2 rounded-full ${currentDay > 1 && currentDay <= turnUntilDay ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-amber-500'} mb-1`}></div>
                                  <span>Turning</span>
                                  <span className="mt-1 font-medium">Until Day {turnUntilDay}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className={`w-2 h-2 rounded-full ${currentDay > turnUntilDay && currentDay < totalDays ? 'bg-amber-600 ring-2 ring-amber-300' : 'bg-amber-600'} mb-1`}></div>
                                  <span>Lockdown</span>
                                  <span className="mt-1 font-medium">
                                    {currentDay < lockdownDay ? `In ${daysUntilLockdown} days` : currentDay >= lockdownDay && currentDay < totalDays ? 'Active' : 'Complete'}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className={`w-2 h-2 rounded-full ${currentDay >= totalDays ? 'bg-amber-700 ring-2 ring-amber-300' : 'bg-amber-700'} mb-1`}></div>
                                  <span>Hatch</span>
                                  <span className="mt-1 font-medium">
                                    {currentDay < totalDays ? `In ${daysUntilHatch} days` : 'Today!'}
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        
                        <div className="relative h-5 bg-white rounded-full overflow-hidden shadow-inner border border-amber-200">
                          {/* Calculate progress percentage based on species and days */}
                          {(() => {
                            const speciesData = {
                              "Chicken": { days: 21, turnUntil: 18 },
                              "Duck": { days: 28, turnUntil: 25 },
                              "Goose": { days: 30, turnUntil: 27 },
                              "Turkey": { days: 28, turnUntil: 25 },
                              "Quail": { days: 18, turnUntil: 15 }
                            };
                            
                            const totalDays = speciesData[batch.species]?.days || 21;
                            const turnUntilDay = speciesData[batch.species]?.turnUntil || 18;
                            const daysElapsed = totalDays - batch.daysRemaining;
                            const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
                            
                            // Calculate milestone positions
                            const turnUntilPosition = (turnUntilDay / totalDays) * 100;
                            const lockdownPosition = ((totalDays - 3) / totalDays) * 100;
                            
                            return (
                              <>
                                {/* Main progress bar with gradient based on phase */}
                                <div 
                                  className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out ${progress < turnUntilPosition ? 'bg-gradient-to-r from-amber-400 to-amber-500' : progress < lockdownPosition ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-amber-600 to-amber-700'}`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                                
                                {/* Milestone markers with tooltips */}
                                <div className="absolute top-0 h-full w-full">
                                  {/* Turning phase end marker */}
                                  <div className="group relative">
                                    <div 
                                      className="absolute top-0 h-full border-l-2 border-amber-600 z-10" 
                                      style={{ left: `${turnUntilPosition}%` }}
                                    ></div>
                                    <div 
                                      className="absolute bottom-full mb-1 left-0 transform -translate-x-1/2 hidden group-hover:block bg-amber-600 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20"
                                      style={{ left: `${turnUntilPosition}%` }}
                                    >
                                      Stop turning on day {turnUntilDay}
                                    </div>
                                  </div>
                                  
                                  {/* Lockdown marker */}
                                  <div className="group relative">
                                    <div 
                                      className="absolute top-0 h-full border-l-2 border-amber-800 z-10" 
                                      style={{ left: `${lockdownPosition}%` }}
                                    ></div>
                                    <div 
                                      className="absolute bottom-full mb-1 left-0 transform -translate-x-1/2 hidden group-hover:block bg-amber-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20"
                                      style={{ left: `${lockdownPosition}%` }}
                                    >
                                      Lockdown on day {totalDays - 3}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Current day indicator with pulsing effect */}
                                <div 
                                  className="absolute top-0 h-full z-10" 
                                  style={{ left: `${progress}%` }}
                                >
                                  <div className="absolute top-1/2 transform -translate-y-1/2 -ml-2.5">
                                    <div className="h-5 w-5 bg-white border-2 border-amber-600 rounded-full shadow-md flex items-center justify-center animate-pulse">
                                      <div className="h-2 w-2 bg-amber-600 rounded-full"></div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        
                        {/* Handling instructions based on current phase */}
                        {(() => {
                          const speciesData = {
                            "Chicken": { days: 21, turnUntil: 18 },
                            "Duck": { days: 28, turnUntil: 25 },
                            "Goose": { days: 30, turnUntil: 27 },
                            "Turkey": { days: 28, turnUntil: 25 },
                            "Quail": { days: 18, turnUntil: 15 }
                          };
                          
                          const totalDays = speciesData[batch.species]?.days || 21;
                          const turnUntilDay = speciesData[batch.species]?.turnUntil || 18;
                          const daysElapsed = totalDays - batch.daysRemaining;
                          
                          let instructions = "";
                          let bgColor = "bg-amber-50";
                          let textColor = "text-amber-800";
                          let borderColor = "border-amber-200";
                          
                          if (daysElapsed < 7) {
                            // First week
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
                        })()}
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
