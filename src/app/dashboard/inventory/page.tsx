"use client";

import { useState, useCallback, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement,
  ChartType,
  TooltipItem,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Define types for this component
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

type IncubationData = {
  name: string;
  eggCount: number;
  speciesType: "chicken" | "duck" | "quail" | "goose" | "turkey";
  speciesVariety: string;
  notes: string;
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart data type

// Chart data type
type ChartDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  type?: ChartType;
  tension?: number;
};

type ChartDataType = {
  labels: string[];
  datasets: ChartDataset[];
};

export default function InventoryPage() {
  // State for form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    eggCount: 0,
    pickupTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    pickupMethod: "",
    eggType: "",
    incubated: 0,
    broken: 0,
    weather: "",
    notes: ""
  });
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  // State for incubation modal
  const [showIncubationModal, setShowIncubationModal] = useState(false);
  const [recordForIncubation, setRecordForIncubation] = useState<InventoryRecord | null>(null);
  const [incubationData, setIncubationData] = useState<IncubationData>({
    name: "",
    eggCount: 0,
    speciesType: "chicken",
    speciesVariety: "",
    notes: ""
  });

  // Function to calculate available dozens for sale
  const calculateAvailableDozens = (records: InventoryRecord[]) => {
    const eggTypeMap: Record<string, number> = {};
    
    // Calculate total available eggs by type
    // Only count eggs that are not broken and not marked for other purposes (incubated/sold)
    records.forEach(record => {
      // We only count eggs that are not broken and not marked for other purposes
      const availableEggs = record.eggCount - record.incubated;
      if (availableEggs > 0) {
        if (eggTypeMap[record.eggType]) {
          eggTypeMap[record.eggType] += availableEggs;
        } else {
          eggTypeMap[record.eggType] = availableEggs;
        }
      }
    });
    
    // Convert to dozens and return both total and by type
    const byType: Record<string, number> = {};
    let totalDozens = 0;
    
    Object.entries(eggTypeMap).forEach(([type, count]) => {
      // Calculate dozens with one decimal place precision
      const dozens = (count / 12).toFixed(1);
      byType[type] = parseFloat(dozens);
      totalDozens += parseFloat(dozens);
    });
    
    // Store in localStorage for access by the Sales page
    localStorage.setItem('availableDozens', JSON.stringify({
      total: totalDozens,
      byType
    }));
    
    return {
      total: totalDozens,
      byType
    };
  };
  
  // State for inventory records
  const initialFormState = {
    date: new Date().toISOString().split('T')[0],
    eggCount: 0,
    pickupTime: '',
    pickupMethod: '',
    eggType: '',
    broken: 0,
    incubated: 0,
    weather: '',
    notes: ''
  };

  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>([]);
  const [availableDozens, setAvailableDozens] = useState({ total: 0, byType: {} });
  
  // Load inventory records from localStorage on component mount
  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem('inventoryRecords');
      if (savedRecords) {
        setInventoryRecords(JSON.parse(savedRecords));
      } else {
        // Default data if nothing is saved
        const defaultRecords = [
          {
            id: "rec1",
            date: new Date().toISOString().split('T')[0],
            eggCount: 50,
            pickupTime: "15:37",
            pickupMethod: "Evening Collection",
            eggType: "Chicken",
            incubated: 25,
            broken: 25,
            weather: "cloudy",
            notes: "Mixed sizes, some soft shells"
          }
        ];
        setInventoryRecords(defaultRecords);
        localStorage.setItem('inventoryRecords', JSON.stringify(defaultRecords));
      }
    } catch (error) {
      console.error('Error loading inventory records from localStorage:', error);
    }
  }, []);
  
  // Save inventory records to localStorage whenever they change
  useEffect(() => {
    if (inventoryRecords.length > 0) {
      localStorage.setItem('inventoryRecords', JSON.stringify(inventoryRecords));
      
      // Calculate available dozens whenever inventory changes
      const dozens = calculateAvailableDozens(inventoryRecords);
      setAvailableDozens(dozens);
      
      // Save available dozens to localStorage for use in sales page
      localStorage.setItem('availableEggDozens', JSON.stringify(dozens));
    } else {
      // If there are no inventory records, set available dozens to zero
      const emptyDozens = { total: 0, byType: {} };
      setAvailableDozens(emptyDozens);
      localStorage.setItem('availableEggDozens', JSON.stringify(emptyDozens));
    }
  }, [inventoryRecords]);
  
  // Reset egg inventory count to zero
  const resetEggInventory = () => {
    const emptyDozens = { total: 0, byType: {} };
    setAvailableDozens(emptyDozens);
    localStorage.setItem('availableEggDozens', JSON.stringify(emptyDozens));
    alert('Egg inventory has been reset to zero');
  };
  
  // Reset egg inventory to zero on component mount
  useEffect(() => {
    // Reset egg inventory to zero
    const emptyDozens = { total: 0, byType: {} };
    setAvailableDozens(emptyDozens);
    localStorage.setItem('availableEggDozens', JSON.stringify(emptyDozens));
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [timeFilter, setTimeFilter] = useState("Last 7 days");
  
  // State for chart display
  const [chartType, setChartType] = useState<"7days" | "30days" | "weekly">("7days");
  const [chartData, setChartData] = useState<ChartDataType | null>(null);

  // Reset form function
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      eggCount: 0,
      pickupTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      pickupMethod: "",
      eggType: "",
      incubated: 0,
      broken: 0,
      weather: "",
      notes: ""
    });
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    let parsedValue = value;
    
    // Convert numeric values to numbers
    if (id === 'eggCount' || id === 'broken' || id === 'incubated') {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
      // Ensure TypeScript knows this is a number
      return setFormData(prev => ({ ...prev, [id]: parsedValue as number }));
    }
    
    setFormData(prev => ({ ...prev, [id]: parsedValue }));
  };

  // Clear form function
  const handleClearForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      eggCount: 0,
      pickupTime: '',
      pickupMethod: '',
      eggType: '',
      broken: 0,
      incubated: 0,
      weather: '',
      notes: ''
    });
  };

  // Filter records based on search and filters
  const getFilteredRecords = () => inventoryRecords.filter((record: InventoryRecord) => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm) ||
      record.pickupMethod.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Method filter
    const matchesMethod = methodFilter === "All Methods" || record.pickupMethod === methodFilter;
    
    // Time filter
    let matchesTimeFilter = true;
    const recordDate = new Date(record.date);
    const today = new Date();
    
    if (timeFilter === "Last 7 days") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      matchesTimeFilter = recordDate >= weekAgo;
    } else if (timeFilter === "Last 30 days") {
      const monthAgo = new Date();
      monthAgo.setDate(today.getDate() - 30);
      matchesTimeFilter = recordDate >= monthAgo;
    } else if (timeFilter === "This month") {
      matchesTimeFilter = recordDate.getMonth() === today.getMonth() && 
                          recordDate.getFullYear() === today.getFullYear();
    }
    
    return matchesSearch && matchesMethod && matchesTimeFilter;
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.eggCount || formData.eggCount <= 0) {
      alert("Please enter a valid egg count");
      return;
    }
    
    if (!formData.pickupMethod) {
      alert("Please select a pickup method");
      return;
    }
    
    // Create a complete record with all fields
    const completeRecord: InventoryRecord = {
      id: isEditing && editingId ? editingId : `record-${Date.now()}`,
      date: formData.date,
      eggCount: typeof formData.eggCount === 'number' ? formData.eggCount : parseInt(formData.eggCount.toString(), 10),
      pickupTime: formData.pickupTime,
      pickupMethod: formData.pickupMethod,
      eggType: formData.eggType || 'Chicken', // Default to Chicken if not specified
      incubated: typeof formData.incubated === 'number' ? formData.incubated : parseInt(formData.incubated.toString(), 10),
      broken: typeof formData.broken === 'number' ? formData.broken : parseInt(formData.broken.toString(), 10),
      weather: formData.weather,
      notes: formData.notes
    };
    
    if (isEditing && editingId) {
      // Update existing record
      const updatedRecords = inventoryRecords.map(record => 
        record.id === editingId ? completeRecord : record
      );
      
      setInventoryRecords(updatedRecords);
      localStorage.setItem('inventoryRecords', JSON.stringify(updatedRecords));
      setIsEditing(false);
      // showSuccessMessage("Record updated successfully!");
    } else {
      // Add new record
      const updatedRecords = [...inventoryRecords, completeRecord];
      setInventoryRecords(updatedRecords);
      localStorage.setItem('inventoryRecords', JSON.stringify(updatedRecords));
      // showSuccessMessage("New egg record added successfully!");
    }
    
    // Reset form
    resetForm();
  };

  // Handle delete button click
  const handleDelete = (id: string) => {
    // Show confirmation modal instead of using window.confirm
    setRecordToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Handle incubate button click
  const handleIncubate = (record: InventoryRecord) => {
    if (record.incubated <= 0) {
      alert("No eggs marked for incubation in this record.");
      return;
    }
    
    setRecordForIncubation(record);
    setIncubationData({
      name: `Batch from ${record.date}`,
      eggCount: record.incubated,
      speciesType: "chicken",
      speciesVariety: "",
      notes: ""
    });
    setShowIncubationModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (recordToDelete) {
      // Remove the record from the array
      const updatedRecords = inventoryRecords.filter(record => record.id !== recordToDelete);
      setInventoryRecords(updatedRecords);
      
      // Save to localStorage
      localStorage.setItem('inventoryRecords', JSON.stringify(updatedRecords));
      
      // Close the modal and reset state
      setShowDeleteModal(false);
      setRecordToDelete(null);
      
      // Show success message
      showSuccessMessage("Record deleted successfully!");
    }
  };

  // Calculate statistics
  const thisWeekRecords = inventoryRecords.filter((record: InventoryRecord) => {
    const recordDate = new Date(record.date);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    return recordDate >= weekAgo && recordDate <= today;
  });

  const totalThisWeek = thisWeekRecords.reduce((sum: number, record: InventoryRecord) => sum + record.eggCount, 0);
  const dailyAverage = thisWeekRecords.length > 0 ? (totalThisWeek / thisWeekRecords.length).toFixed(1) : "0";

  // Calculate trend vs last week
  const lastWeekRecords = inventoryRecords.filter((record: InventoryRecord) => {
    const recordDate = new Date(record.date);
    const weekAgo = new Date();
    const twoWeeksAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return recordDate >= twoWeeksAgo && recordDate < weekAgo;
  });

  const totalLastWeek = lastWeekRecords.reduce((sum: number, record: InventoryRecord) => sum + record.eggCount, 0);
  const trend = totalLastWeek > 0 
    ? Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100) 
    : 0;
  const trendDirection = trend >= 0 ? "up" : "down";
  
  // Handle confirm incubation
  const handleConfirmIncubation = () => {
    if (!recordForIncubation || incubationData.eggCount <= 0 || !incubationData.speciesVariety) {
      alert("Please fill out all required fields");
      return;
    }
    
    try {
      // Create a new incubation batch
      const today = new Date();
      const speciesInfo: Record<string, {incubationDays: number, temperature: number, humidity: number}> = {
        chicken: { incubationDays: 21, temperature: 99.5, humidity: 55 },
        duck: { incubationDays: 28, temperature: 99.3, humidity: 65 },
        quail: { incubationDays: 18, temperature: 99.5, humidity: 50 },
        goose: { incubationDays: 30, temperature: 99.0, humidity: 65 },
        turkey: { incubationDays: 28, temperature: 99.5, humidity: 60 }
      };
      
      const startDate = today.toISOString().split('T')[0];
      const hatchDate = new Date(today);
      hatchDate.setDate(today.getDate() + speciesInfo[incubationData.speciesType].incubationDays);
      
      const newBatch = {
        id: `batch-${Date.now()}`,
        batchName: incubationData.name,
        startDate: startDate,
        expectedHatchDate: hatchDate.toISOString().split('T')[0],
        eggCount: incubationData.eggCount,
        speciesType: incubationData.speciesType,
        speciesVariety: incubationData.speciesVariety,
        notes: incubationData.notes,
        status: "incubating" as "incubating" | "hatched" | "failed",
        temperature: speciesInfo[incubationData.speciesType].temperature,
        humidity: speciesInfo[incubationData.speciesType].humidity,
        lastTurned: startDate,
        lastCandled: ""
      };
      
      // Get existing batches or initialize empty array
      const existingBatches = localStorage.getItem('incubationBatches');
      const batches = existingBatches ? JSON.parse(existingBatches) : [];
      
      // Add new batch
      batches.push(newBatch);
      localStorage.setItem('incubationBatches', JSON.stringify(batches));
      
      // Close modal
      setShowIncubationModal(false);
      setRecordForIncubation(null);
      setIncubationData({
        name: "",
        eggCount: 0,
        speciesType: "chicken",
        speciesVariety: "",
        notes: ""
      });
      
      // Show success message
      showSuccessMessage('Eggs successfully added to incubation!');
    } catch (error) {
      console.error("Error adding to incubation:", error);
      setShowIncubationModal(false);
      setRecordForIncubation(null);
    }
  };
  
  // Function to prepare chart data based on the selected chart type
  const prepareChartData = useCallback((): ChartDataType | null => {
    if (inventoryRecords.length === 0) return null;
    
    let labels: string[] = [];
    let data: number[] = [];
    
    if (chartType === '7days') {
      // Get data for last 7 days
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();
      
      labels = last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      });
      
      data = last7Days.map(date => {
        const dayRecords = inventoryRecords.filter(r => r.date === date);
        return dayRecords.reduce((sum, r) => sum + r.eggCount, 0);
      });
    } else if (chartType === '30days') {
      // Get data for last 30 days with 7-day moving average
      const last30Days = [...Array(30)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();
      
      labels = last30Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      const dailyData = last30Days.map(date => {
        const dayRecords = inventoryRecords.filter(r => r.date === date);
        return dayRecords.reduce((sum, r) => sum + r.eggCount, 0);
      });
      
      // Calculate 7-day moving average
      data = dailyData.map((_, i) => {
        if (i < 6) return 0; // Not enough data for 7-day average yet
        const weekSum = dailyData.slice(i-6, i+1).reduce((sum, val) => sum + val, 0);
        return Math.round(weekSum / 7);
      });
    } else { // Weekly
      // Get data for last 12 weeks
      const weeks: {[key: string]: number} = {};
      
      inventoryRecords.forEach(record => {
        const date = new Date(record.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Set to Sunday
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeks[weekKey]) weeks[weekKey] = 0;
        weeks[weekKey] += record.eggCount;
      });
      
      // Sort weeks and take last 12
      const sortedWeeks = Object.entries(weeks)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .slice(-12);
      
      labels = sortedWeeks.map(([week]) => {
        const d = new Date(week);
        return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      });
      
      data = sortedWeeks.map(([_, count]) => count);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Egg Production',
          data,
          backgroundColor: 'rgba(255, 183, 77, 0.6)',
          borderColor: 'rgb(255, 159, 28)',
          borderWidth: 1
        }
      ]
    };
  }, [inventoryRecords, chartType]);

  // Update chart data when records or chart type changes
  useEffect(() => {
    const data = prepareChartData();
    setChartData(data);
  }, [prepareChartData]);
  
  // Function to show success message
  const showSuccessMessage = (message: string) => {
    const msgElement = document.createElement('div');
    msgElement.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
    msgElement.innerHTML = `<p>${message}</p>`;
    document.body.appendChild(msgElement);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
      msgElement.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(msgElement), 500);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-100 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white border-opacity-20">
              <h1 className="text-3xl font-bold text-amber-700 flex items-center gap-3 mb-2">
                <span className="text-4xl">🥚</span> Egg Production Tracker
              </h1>
              <p className="text-amber-800">Monitor your daily egg production with smart insights and analytics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">{totalThisWeek}</div>
                <div className="text-sm font-medium uppercase tracking-wide text-amber-800">Eggs This Week</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">{Math.floor(availableDozens.total)}</div>
                <div className="text-sm font-medium uppercase tracking-wide text-green-800">Dozens Available</div>
                <div className="text-xs text-gray-500 mt-1">Available for sale</div>
                <button
                  onClick={resetEggInventory}
                  className="mt-2 px-3 py-1 text-xs bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                >
                  Reset to Zero
                </button>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">{dailyAverage}</div>
                <div className="text-sm font-medium uppercase tracking-wide text-amber-800">Daily Average</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className={`text-4xl font-bold mb-2 ${trendDirection === "up" ? "text-emerald-600" : "text-red-600"}`}>
                  {trendDirection === "up" ? "↗" : "↘"} {Math.abs(trend)}%</div>
                <div className="text-sm font-medium uppercase tracking-wide text-amber-800">vs Last Week</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Add New Record Form */}
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-amber-700 flex items-center gap-2 mb-6">
                  {isEditing ? '✏️ Edit Record' : '📝 Add New Record'}
                </h2>
                <form id="egg-form" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="date" className="block text-amber-800 font-medium mb-2">Date</label>
                    <input 
                      type="date" 
                      id="date" 
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="eggCount" className="block text-amber-800 font-medium mb-2">Total Eggs</label>
                      <input 
                        type="number" 
                        id="eggCount" 
                        value={formData.eggCount === 0 ? "" : formData.eggCount}
                        onChange={handleInputChange}
                        placeholder="0" 
                        min="0"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                      />
                    </div>
                    <div>
                      <label htmlFor="pickupTime" className="block text-amber-800 font-medium mb-2">Pickup Time</label>
                      <input 
                        type="time" 
                        id="pickupTime" 
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        placeholder="Current time"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="pickupMethod" className="block text-amber-800 font-medium mb-2">Pickup Method</label>
                    <select 
                      id="pickupMethod" 
                      value={formData.pickupMethod}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                    >
                      <option value="">Select Method</option>
                      <option value="Morning Coop Check">Morning Coop Check</option>
                      <option value="Evening Collection">Evening Collection</option>
                      <option value="Free Range Pickup">Free Range Pickup</option>
                      <option value="Nest Box Collection">Nest Box Collection</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="eggType" className="block text-amber-800 font-medium mb-2">Egg Type</label>
                    <select 
                      id="eggType" 
                      value={formData.eggType}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                    >
                      <option value="">Select Egg Type</option>
                      <option value="Chicken">Chicken</option>
                      <option value="Duck">Duck</option>
                      <option value="Quail">Quail</option>
                      <option value="Goose">Goose</option>
                      <option value="Turkey">Turkey</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="incubated" className="block text-amber-800 font-medium mb-2">For Incubation</label>
                      <input 
                        type="number" 
                        id="incubated" 
                        value={formData.incubated === 0 ? "" : formData.incubated}
                        onChange={handleInputChange}
                        placeholder="0" 
                        min="0"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                      />
                    </div>
                    <div>
                      <label htmlFor="broken" className="block text-amber-800 font-medium mb-2">Broken/Damaged</label>
                      <input 
                        type="number" 
                        id="broken" 
                        value={formData.broken === 0 ? "" : formData.broken}
                        onChange={handleInputChange}
                        placeholder="0" 
                        min="0"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="weather" className="block text-amber-800 font-medium mb-2">Weather Conditions</label>
                    <select 
                      id="weather" 
                      value={formData.weather}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                    >
                      <option value="">Select Weather</option>
                      <option value="sunny">☀️ Sunny</option>
                      <option value="cloudy">☁️ Cloudy</option>
                      <option value="rainy">🌧️ Rainy</option>
                      <option value="cold">❄️ Cold</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="notes" className="block text-amber-800 font-medium mb-2">Notes (Optional)</label>
                    <textarea 
                      id="notes" 
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3} 
                      placeholder="Any observations about the flock, egg quality, or unusual circumstances..."
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white bg-opacity-90"
                    ></textarea>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg shadow-md hover:translate-y-[-2px] hover:shadow-lg transition duration-300"
                    >
                      {isEditing ? 'Update Record' : 'Add Egg Record'}
                    </button>
                    
                    {isEditing && (
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData(initialFormState);
                          setIsEditing(false);
                          setEditingId(null);
                        }}
                        className="py-3 px-6 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 hover:translate-y-[-2px] hover:shadow-lg transition duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Production Chart */}
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-amber-700 flex items-center gap-2 mb-6">
                  📊 Production Trends
                </h2>
                <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">Select time period:</div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setChartType("7days")} 
                      className={`px-3 py-1 text-sm rounded-md transition ${chartType === "7days" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      7 Days
                    </button>
                    <button 
                      onClick={() => setChartType("30days")} 
                      className={`px-3 py-1 text-sm rounded-md transition ${chartType === "30days" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      30 Days
                    </button>
                    <button 
                      onClick={() => setChartType("weekly")} 
                      className={`px-3 py-1 text-sm rounded-md transition ${chartType === "weekly" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>
                
                <div className="h-[250px] bg-white rounded-xl p-2 border border-gray-200">
                  {chartData ? (
                    chartType === "30days" ? (
                      <Bar 
                        data={chartData as ChartData<'bar', number[], string>} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Egg Count'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Date'
                              },
                              ticks: {
                                maxRotation: 90,
                                minRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 15
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                title: function(tooltipItems) {
                                  return tooltipItems[0].label;
                                },
                                label: function(tooltipItem: TooltipItem<ChartType>) {
                                  return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y} eggs`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    ) : chartType === "weekly" ? (
                      <Bar 
                        data={chartData as ChartData<'bar', number[], string>} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Egg Count'
                              }
                            }
                          },
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: function(context: {parsed: {y: number}}) {
                                  return `${context.parsed.y} eggs`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <Bar 
                        data={chartData as ChartData<'bar', number[], string>} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Egg Count'
                              }
                            }
                          },
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: function(context: {parsed: {y: number}}) {
                                  return `${context.parsed.y} eggs`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    )
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl mb-3">📈</div>
                        <div className="text-gray-600">No production data available</div>
                        <div className="text-sm text-gray-500 mt-2">Add records to see trends</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {chartType === "7days" ? "Daily egg production for the last 7 days" : 
                   chartType === "30days" ? "Daily production with 7-day moving average" : 
                   "Total weekly egg production"}
                </div>
              </div>
              </div>
            </div>

            {/* Records Section */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  📋 Production Records
                </h2>
                <div className="flex flex-wrap gap-3">
                  <input 
                    type="text" 
                    placeholder="Search records..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border-2 border-gray-200 rounded-md text-sm bg-white bg-opacity-90"
                  />
                  <select 
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="p-2 border-2 border-gray-200 rounded-md text-sm bg-white bg-opacity-90"
                  >
                    <option>All Methods</option>
                    <option>Morning Coop Check</option>
                    <option>Evening Collection</option>
                    <option>Free Range Pickup</option>
                    <option>Nest Box Collection</option>
                  </select>
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="p-2 border-2 border-gray-200 rounded-md text-sm bg-white bg-opacity-90"
                  >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>This month</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>

              {/* Record Cards */}
              <div className="space-y-4">
                {getFilteredRecords().length > 0 ? (
                  getFilteredRecords().map((record: InventoryRecord) => (
                    <div 
                      key={record.id} 
                      className="bg-white bg-opacity-80 rounded-xl p-5 shadow-sm border-l-4 border-amber-500 hover:translate-x-1 hover:shadow-md transition duration-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-lg font-semibold text-amber-700">{record.date}</div>
                          <div className="text-2xl font-bold text-blue-700">{record.eggCount} eggs</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        <div className="text-sm"><span className="font-semibold text-gray-700">Method:</span> {record.pickupMethod}</div>
                        <div className="text-sm"><span className="font-semibold text-gray-700">Time:</span> {record.pickupTime}</div>
                        <div className="text-sm"><span className="font-semibold text-gray-700">Weather:</span> {record.weather}</div>
                        <div className="text-sm"><span className="font-semibold text-gray-700">Incubated:</span> {record.incubated}</div>
                        <div className="text-sm"><span className="font-semibold text-gray-700">Broken:</span> {record.broken}</div>
                        <div className="text-sm"><span className="font-semibold text-gray-700">For Sale:</span> {record.eggCount - record.incubated - record.broken}</div>
                      </div>
                      {record.notes && (
                        <div className="text-sm text-gray-600 mb-4">
                          <span className="font-semibold text-gray-700">Notes:</span> {record.notes}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button 
                          className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-md hover:bg-emerald-600 transition"
                          onClick={() => {
                            // Set the record data for editing
                            const recordToEdit = inventoryRecords.find(r => r.id === record.id);
                            if (recordToEdit) {
                              setFormData({
                                date: recordToEdit.date,
                                eggCount: recordToEdit.eggCount,
                                pickupTime: recordToEdit.pickupTime,
                                pickupMethod: recordToEdit.pickupMethod,
                                broken: recordToEdit.broken,
                                incubated: recordToEdit.incubated,
                                weather: recordToEdit.weather,
                                notes: recordToEdit.notes || ""
                              });
                              setEditingId(record.id);
                              setIsEditing(true);
                              
                              // Scroll to form
                              const formElement = document.getElementById("egg-form");
                              if (formElement) {
                                formElement.scrollIntoView({ behavior: 'smooth' });
                              }
                            }
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          aria-label={`Delete record ${record.id}`}
                          type="button"
                        >
                          🗑️ Delete
                        </button>
                        <button
                          onClick={() => handleIncubate(record)}
                          className="text-purple-600 hover:text-purple-900"
                          aria-label="Send to incubation"
                          title="Send to incubation"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <div className="text-5xl mb-3">🔍</div>
                    <p>No records found matching your filters</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Add Button */}
            <button 
              className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition duration-300"
              title="Quick Add Record"
              onClick={() => document.getElementById("eggCount")?.focus()}
            >
              +
            </button>
          </div>
        </main>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRecordToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Incubation Modal */}
      {showIncubationModal && recordForIncubation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Add Eggs to Incubation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                <input
                  type="text"
                  value={incubationData.name}
                  onChange={(e) => setIncubationData({...incubationData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Eggs</label>
                <input
                  type="number"
                  value={incubationData.eggCount}
                  onChange={(e) => setIncubationData({...incubationData, eggCount: Math.min(parseInt(e.target.value) || 0, recordForIncubation.incubated)})}
                  max={recordForIncubation.incubated}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Maximum: {recordForIncubation.incubated} eggs</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                <select
                  value={incubationData.speciesType}
                  onChange={(e) => setIncubationData({...incubationData, speciesType: e.target.value as "chicken" | "duck" | "quail" | "goose" | "turkey", speciesVariety: ""})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="chicken">Chicken</option>
                  <option value="duck">Duck</option>
                  <option value="quail">Quail</option>
                  <option value="goose">Goose</option>
                  <option value="turkey">Turkey</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                <select
                  value={incubationData.speciesVariety}
                  onChange={(e) => setIncubationData({...incubationData, speciesVariety: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a variety</option>
                  {incubationData.speciesType === "chicken" && [
                    "Rhode Island Red", "Leghorn", "Plymouth Rock", "Orpington", "Wyandotte", "Sussex", "Australorp"
                  ].map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))}
                  {incubationData.speciesType === "duck" && [
                    "Pekin", "Mallard", "Muscovy", "Runner", "Cayuga", "Swedish", "Rouen"
                  ].map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))}
                  {incubationData.speciesType === "quail" && [
                    "Coturnix", "Bobwhite", "Button", "California", "Japanese"
                  ].map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))}
                  {incubationData.speciesType === "goose" && [
                    "Embden", "Toulouse", "Chinese", "African", "Pilgrim"
                  ].map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))}
                  {incubationData.speciesType === "turkey" && [
                    "Broad Breasted White", "Broad Breasted Bronze", "Bourbon Red", "Narragansett", "Royal Palm"
                  ].map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={incubationData.notes}
                  onChange={(e) => setIncubationData({...incubationData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowIncubationModal(false);
                  setRecordForIncubation(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmIncubation}
                className="px-4 py-2 bg-purple-600 border border-transparent rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Add to Incubation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
