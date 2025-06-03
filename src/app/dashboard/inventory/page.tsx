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

// Types for inventory data
type InventoryRecord = {
  id: string;
  date: string;
  eggCount: number;
  pickupTime: string;
  pickupMethod: string;
  incubated: number;
  broken: number;
  weather: string;
  notes: string;
};

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
    pickupTime: "",
    pickupMethod: "",
    incubated: 0,
    broken: 0,
    weather: "",
    notes: ""
  });

  // State for records
  const [records, setRecords] = useState<InventoryRecord[]>([
    {
      id: "rec1",
      date: new Date().toISOString().split("T")[0],
      eggCount: 50,
      pickupTime: "15:37",
      pickupMethod: "Evening Collection",
      incubated: 25,
      broken: 25,
      weather: "cloudy",
      notes: "Mixed sizes, some soft shells"
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [timeFilter, setTimeFilter] = useState("Last 7 days");
  
  // State for chart display
  const [chartType, setChartType] = useState<"7days" | "30days" | "weekly">("7days");
  const [chartData, setChartData] = useState<ChartDataType | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "eggCount" || id === "incubated" || id === "broken" ? parseInt(value) || 0 : value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.eggCount || formData.eggCount <= 0) {
      alert("Please enter a valid egg count");
      return;
    }
    
    if (isEditing && editingId) {
      // Update existing record
      const updatedRecords = records.map(record => {
        if (record.id === editingId) {
          return {
            ...record,
            date: formData.date || record.date,
            eggCount: formData.eggCount || 0,
            pickupTime: formData.pickupTime || "",
            pickupMethod: formData.pickupMethod || "",
            incubated: formData.incubated || 0,
            broken: formData.broken || 0,
            weather: formData.weather || "",
            notes: formData.notes || ""
          };
        }
        return record;
      });
      
      setRecords(updatedRecords);
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Create new record
      const newRecord: InventoryRecord = {
        id: `rec${Date.now()}`,
        date: formData.date || new Date().toISOString().split("T")[0],
        eggCount: formData.eggCount || 0,
        pickupTime: formData.pickupTime || "",
        pickupMethod: formData.pickupMethod || "",
        incubated: formData.incubated || 0,
        broken: formData.broken || 0,
        weather: formData.weather || "",
        notes: formData.notes || ""
      };
      
      // Add to records
      setRecords([newRecord, ...records]);
    }
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split("T")[0],
      eggCount: 0,
      pickupTime: "",
      pickupMethod: "",
      incubated: 0,
      broken: 0,
      weather: "",
      notes: ""
    });
  };

  // Handle record deletion
  const handleDelete = useCallback((id: string) => {
    try {
      // Show confirmation dialog
      if (window.confirm("Are you sure you want to delete this record?")) {
        console.log("Deleting record with ID:", id);
        
        // Update records state by filtering out the deleted record
        setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
        
        // If deleting the record being edited, reset the form
        if (editingId === id) {
          setEditingId(null);
          setIsEditing(false);
          setFormData({
            date: new Date().toISOString().split("T")[0],
            eggCount: 0,
            pickupTime: "",
            pickupMethod: "",
            incubated: 0,
            broken: 0,
            weather: "",
            notes: ""
          });
        }
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("There was an error deleting the record. Please try again.");
    }
  }, [editingId]);
  
  // Handle record editing
  const handleEdit = (id: string) => {
    const recordToEdit = records.find(record => record.id === id);
    if (recordToEdit) {
      setFormData({
        date: recordToEdit.date,
        eggCount: recordToEdit.eggCount,
        pickupTime: recordToEdit.pickupTime,
        pickupMethod: recordToEdit.pickupMethod,
        incubated: recordToEdit.incubated,
        broken: recordToEdit.broken,
        weather: recordToEdit.weather,
        notes: recordToEdit.notes
      });
      setEditingId(id);
      setIsEditing(true);
      
      // Scroll to form and focus on first input
      const formElement = document.getElementById("egg-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      eggCount: 0,
      pickupTime: "",
      pickupMethod: "",
      incubated: 0,
      broken: 0,
      weather: "",
      notes: ""
    });
  };

  // Calculate statistics
  const thisWeekRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    return recordDate >= weekAgo && recordDate <= today;
  });

  const totalThisWeek = thisWeekRecords.reduce((sum, record) => sum + record.eggCount, 0);
  const dailyAverage = thisWeekRecords.length > 0 ? (totalThisWeek / thisWeekRecords.length).toFixed(1) : "0";
  const brokenThisWeek = thisWeekRecords.reduce((sum, record) => sum + record.broken, 0);

  // Calculate trend vs last week
  const lastWeekRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const weekAgo = new Date();
    const twoWeeksAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return recordDate >= twoWeeksAgo && recordDate < weekAgo;
  });

  const totalLastWeek = lastWeekRecords.reduce((sum, record) => sum + record.eggCount, 0);
  const trend = totalLastWeek > 0 
    ? Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100) 
    : 0;
  const trendDirection = trend >= 0 ? "up" : "down";

  // Function to generate dates for the last n days
  const generateDateRange = useCallback((days: number) => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }, []);
  
  // Function to group records by week
  const groupRecordsByWeek = useCallback(() => {
    const weeks: Record<string, number> = {};
    const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedRecords.forEach(record => {
      const date = new Date(record.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = 0;
      }
      weeks[weekKey] += record.eggCount;
    });
    
    return weeks;
  }, [records]);
  
  // Function to prepare chart data based on the selected chart type
  const prepareChartData = useCallback((): ChartDataType | null => {
    if (records.length === 0) return null;
    
    let labels: string[] = [];
    let data: number[] = [];
    let backgroundColor = 'rgba(217, 119, 6, 0.2)';
    let borderColor = 'rgb(217, 119, 6)';
    let title = '';
    
    if (chartType === '7days') {
      title = 'Last 7 Days Production';
      labels = generateDateRange(7);
      data = labels.map(date => {
        const dayRecords = records.filter(record => record.date === date);
        return dayRecords.reduce((sum, record) => sum + record.eggCount, 0);
      });
      
      return {
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor,
            borderColor,
            borderWidth: 1
          }
        ]
      };
    } else if (chartType === '30days') {
      title = 'Last 30 Days Production';
      labels = generateDateRange(30);
      data = labels.map(date => {
        const dayRecords = records.filter(record => record.date === date);
        return dayRecords.reduce((sum, record) => sum + record.eggCount, 0);
      });
      
      // For 30 days, we'll show a 7-day moving average
      const movingAvg: number[] = [];
      for (let i = 0; i < data.length; i++) {
        if (i < 6) {
          movingAvg.push(0); // Not enough data for 7-day average yet
        } else {
          const avg = data.slice(i-6, i+1).reduce((sum, val) => sum + val, 0) / 7;
          movingAvg.push(parseFloat(avg.toFixed(1)));
        }
      }
      
      return {
        labels,
        datasets: [
          {
            label: 'Daily Production',
            data,
            backgroundColor: 'rgba(217, 119, 6, 0.2)',
            borderColor: 'rgb(217, 119, 6)',
            borderWidth: 1,
            type: 'bar'
          },
          {
            label: '7-Day Moving Average',
            data: movingAvg,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderWidth: 2,
            type: 'line',
            tension: 0.1
          }
        ]
      };
    } else {
      // Weekly chart
      title = 'Weekly Production';
      const weeks = groupRecordsByWeek();
      labels = Object.keys(weeks).sort();
      data = labels.map(week => weeks[week]);
      backgroundColor = 'rgba(16, 185, 129, 0.2)';
      borderColor = 'rgb(16, 185, 129)';
      
      // Format week labels to be more readable
      labels = labels.map(week => {
        const date = new Date(week);
        return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      });
      
      return {
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor,
            borderColor,
            borderWidth: 1
          }
        ]
      };
    }
  }, [records, chartType, groupRecordsByWeek, generateDateRange]);
  
  // Update chart data when records or chart type changes
  useEffect(() => {
    const data = prepareChartData();
    setChartData(data);
  }, [prepareChartData]);
  
  // Filter records based on search and filters
  const filteredRecords = records.filter(record => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      record.pickupMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Method filter
    const matchesMethod = methodFilter === "All Methods" || 
      record.pickupMethod === methodFilter;
    
    // Time filter
    let matchesTime = true;
    const recordDate = new Date(record.date);
    const today = new Date();
    
    if (timeFilter === "Last 7 days") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      matchesTime = recordDate >= weekAgo;
    } else if (timeFilter === "Last 30 days") {
      const monthAgo = new Date();
      monthAgo.setDate(today.getDate() - 30);
      matchesTime = recordDate >= monthAgo;
    } else if (timeFilter === "This month") {
      matchesTime = recordDate.getMonth() === today.getMonth() && 
                   recordDate.getFullYear() === today.getFullYear();
    }
    
    return matchesSearch && matchesMethod && matchesTime;
  });

  // Weather emoji mapping
  const weatherEmoji: Record<string, string> = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    cold: "❄️"
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

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">{totalThisWeek}</div>
                <div className="text-sm font-medium uppercase tracking-wide text-amber-800">This Week</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">{dailyAverage}</div>
                <div className="text-sm font-medium uppercase tracking-wide text-amber-800">Daily Average</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className={`text-4xl font-bold mb-2 ${trendDirection === "up" ? "text-emerald-600" : "text-red-600"}`}>
                  {trendDirection === "up" ? "↗" : "↘"} {Math.abs(trend)}%
                </div>
                <div className="text-sm font-medium uppercase tracking-wide text-amber-800">vs Last Week</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-white border-opacity-30 transform transition hover:translate-y-[-5px] hover:shadow-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">{brokenThisWeek}</div>
                <div className="text-sm font-medium uppercase tracking-wide text-amber-800">Broken This Week</div>
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
                        onClick={handleCancelEdit}
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
                        data={chartData as ChartData<'bar'>} 
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
                        data={chartData as ChartData<'bar'>} 
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
                                label: function(context: any) {
                                  return `${context.parsed.y} eggs`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <Bar 
                        data={chartData as ChartData<'bar'>} 
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
                                label: function(context: any) {
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
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
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
                        <div className="text-sm"><span className="font-semibold text-gray-700">Weather:</span> {weatherEmoji[record.weather]} {record.weather.charAt(0).toUpperCase() + record.weather.slice(1)}</div>
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
                          onClick={() => handleEdit(record.id)}
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
    </div>
  );
}
