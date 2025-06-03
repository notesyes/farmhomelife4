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
  BarElement
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
  type?: 'bar';
  tension?: number;
};

type ChartDataType = {
  labels: string[];
  datasets: ChartDataset[];
};

export default function InventoryPage() {
  // State for form data
  const [formData, setFormData] = useState<Omit<InventoryRecord, "id">>({    
    date: new Date().toISOString().split("T")[0],
    eggCount: 0,
    pickupTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    pickupMethod: "",
    incubated: 0,
    broken: 0,
    weather: "",
    notes: ""
  });
  
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

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
  const [dispositionChartData, setDispositionChartData] = useState<ChartDataType | null>(null);

  // Reset form function
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      eggCount: 0,
      pickupTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      pickupMethod: "",
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
    } else {
      // Add new record
      const newRecord = {
        ...formData,
        id: `record-${Date.now()}`
      };
      setRecords([...records, newRecord]);
    }
    
    // Reset form
    resetForm();
  };

  // This resetForm function has been moved above to fix the order of declarations

  // Show delete confirmation dialog
  const showDeleteConfirmation = useCallback((id: string) => {
    setRecordToDelete(id);
    setShowConfirmDialog(true);
  }, []);
  
  // Handle record deletion
  const handleDelete = useCallback((id: string) => {
    try {
      console.log("Deleting record with ID:", id);
      
      // Update records state by filtering out the deleted record
      setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
      
      // If deleting the record being edited, reset the form
      if (editingId === id) {
        resetForm();
      }
      
      // Show success message
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        successMessage.textContent = 'Record deleted successfully!';
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      
      // Show error message
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.textContent = 'There was an error deleting the record. Please try again.';
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
          errorMessage.classList.add('hidden');
        }, 3000);
      }
    } finally {
      // Close the confirmation dialog
      setShowConfirmDialog(false);
      setRecordToDelete(null);
    }
  }, [editingId]);  // resetForm is defined in the component scope, so no need to add it as a dependency
  
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
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    resetForm();
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

  // Prepare chart data for production trends
  const prepareChartData = useCallback(() => {
    // Sort records by date
    const sortedRecords = [...records].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Filter records based on chart type
    let filteredRecords;
    let dateFormat;

    if (chartType === "7days") {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      
      filteredRecords = sortedRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= last7Days;
      });
      dateFormat = { month: 'short' as const, day: 'numeric' as const };
    } else if (chartType === "30days") {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      
      filteredRecords = sortedRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= last30Days;
      });
      dateFormat = { month: 'short' as const, day: 'numeric' as const };
    } else {
      // Weekly aggregation
      // This is a simplified implementation
      filteredRecords = sortedRecords.slice(-28); // Last 4 weeks of data
      dateFormat = { month: 'short' as const, day: 'numeric' as const };
    }

    // Group by date
    const eggsByDate: {[key: string]: number} = {};
    
    filteredRecords.forEach(record => {
      const date = record.date;
      if (!eggsByDate[date]) {
        eggsByDate[date] = 0;
      }
      eggsByDate[date] += record.eggCount;
    });

    // Prepare chart data
    const labels = Object.keys(eggsByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const formattedLabels = labels.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', dateFormat as Intl.DateTimeFormatOptions);
    });

    const data = labels.map(date => eggsByDate[date]);

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Egg Production',
          data: data,
          backgroundColor: 'rgba(16, 185, 129, 0.5)', // emerald-500 with opacity
          borderColor: 'rgb(16, 185, 129)', // emerald-500
          borderWidth: 1
        }
      ]
    };
  }, [records, chartType]);

  // Prepare chart data for egg disposition (broken vs incubated)
  const prepareDispositionChartData = useCallback(() => {
    // Sort records by date
    const sortedRecords = [...records].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Get the last 7 days of records
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const filteredRecords = sortedRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= last7Days;
    });

    // Group by date for broken and incubated
    const brokenByDate: {[key: string]: number} = {};
    const incubatedByDate: {[key: string]: number} = {};
    
    filteredRecords.forEach(record => {
      const date = record.date;
      
      if (!brokenByDate[date]) {
        brokenByDate[date] = 0;
      }
      if (!incubatedByDate[date]) {
        incubatedByDate[date] = 0;
      }
      
      brokenByDate[date] += record.broken;
      incubatedByDate[date] += record.incubated;
    });

    // Prepare chart data
    const labels = Object.keys(brokenByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const formattedLabels = labels.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short' as const, day: 'numeric' as const });
    });

    const brokenData = labels.map(date => brokenByDate[date]);
    const incubatedData = labels.map(date => incubatedByDate[date]);

    setDispositionChartData({
      labels: formattedLabels,
      datasets: [
        {
          label: 'Broken Eggs',
          data: brokenData,
          backgroundColor: 'rgba(239, 68, 68, 0.5)', // red-500 with opacity
          borderColor: 'rgb(239, 68, 68)', // red-500
          borderWidth: 1
        },
        {
          label: 'Incubated Eggs',
          data: incubatedData,
          backgroundColor: 'rgba(59, 130, 246, 0.5)', // blue-500 with opacity
          borderColor: 'rgb(59, 130, 246)', // blue-500
          borderWidth: 1
        }
      ]
    });
  }, [records]);

  // Prepare chart data when records change
  useEffect(() => {
    prepareDispositionChartData();
    setChartData(prepareChartData());
  }, [prepareChartData, prepareDispositionChartData]);

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      
      {/* Main content */}
      {showConfirmDialog ? (
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={() => recordToDelete && handleDelete(recordToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main className="flex-1 p-8 overflow-y-auto">
          <DashboardHeader />
          
          {/* Success and error messages */}
          <div id="success-message" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 hidden" role="alert">
            <span className="block sm:inline"></span>
          </div>
          <div id="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 hidden" role="alert">
            <span className="block sm:inline"></span>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-amber-700">{totalThisWeek}</h2>
              <p className="text-gray-600">Eggs collected this week</p>
              <p className="text-xs text-gray-500 mt-2">{dailyAverage} eggs daily average</p>
            </div>
            
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-amber-700">{brokenThisWeek}</h2>
              <p className="text-gray-600">Broken eggs this week</p>
              <p className="text-xs text-gray-500 mt-2">{brokenThisWeek > 0 ? ((brokenThisWeek / totalThisWeek) * 100).toFixed(1) : 0}% breakage rate</p>
            </div>
            
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-amber-700">{totalThisWeek - totalLastWeek > 0 ? '+' : ''}{totalThisWeek - totalLastWeek}</h2>
              <p className="text-gray-600">Change from last week</p>
              <p className="text-xs text-gray-500 mt-2">
                {totalLastWeek > 0 ? ((totalThisWeek - totalLastWeek) / totalLastWeek * 100).toFixed(1) : 0}% 
                {totalThisWeek >= totalLastWeek ? 'increase' : 'decrease'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-amber-700 mb-6">{isEditing ? 'Edit Record' : 'Add New Record'}</h2>
                
                <form id="egg-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="eggCount" className="block text-sm font-medium text-gray-700 mb-1">Egg Count</label>
                    <input
                      type="number"
                      id="eggCount"
                      name="eggCount"
                      value={formData.eggCount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="incubated" className="block text-sm font-medium text-gray-700 mb-1">Incubated Eggs</label>
                    <input
                      type="number"
                      id="incubated"
                      name="incubated"
                      value={formData.incubated}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="broken" className="block text-sm font-medium text-gray-700 mb-1">Broken Eggs</label>
                    <input
                      type="number"
                      id="broken"
                      name="broken"
                      value={formData.broken}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pickupMethod" className="block text-sm font-medium text-gray-700 mb-1">Pickup Method</label>
                    <select
                      id="pickupMethod"
                      name="pickupMethod"
                      value={formData.pickupMethod}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      <option value="">Select method</option>
                      <option value="manual">Manual Collection</option>
                      <option value="automated">Automated System</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="weather" className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
                    <select
                      id="weather"
                      name="weather"
                      value={formData.weather}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      <option value="">Select weather</option>
                      <option value="sunny">Sunny</option>
                      <option value="cloudy">Cloudy</option>
                      <option value="rainy">Rainy</option>
                      <option value="stormy">Stormy</option>
                      <option value="snowy">Snowy</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          Update Record
                        </button>
                      </>
                    ) : (
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add Record
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            {/* Charts and Records */}
            <div className="lg:col-span-2 space-y-6">
              {/* Production Trends Chart */}
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-amber-700 flex items-center gap-2 mb-6">📊 Production Trends</h2>
                
                <div className="flex mb-4 space-x-2">
                  <button 
                    className={`px-3 py-1 rounded-lg text-sm ${chartType === "7days" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setChartType("7days")}
                  >
                    Last 7 Days
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-lg text-sm ${chartType === "30days" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setChartType("30days")}
                  >
                    Last 30 Days
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-lg text-sm ${chartType === "weekly" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setChartType("weekly")}
                  >
                    Weekly
                  </button>
                </div>
                
                <div className="h-[250px] bg-white rounded-xl p-2 border border-gray-200">
                  {chartData ? (
                    <Bar 
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Eggs'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.parsed.y} eggs`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Egg Disposition Chart (Broken vs Incubated) */}
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20 mt-6">
                <h2 className="text-xl font-semibold text-amber-700 flex items-center gap-2 mb-6">🥚 Egg Disposition</h2>
                
                <div className="mb-4">
                  <div className="h-[250px] bg-white rounded-xl p-2 border border-gray-200">
                    {dispositionChartData ? (
                      <Bar 
                        data={dispositionChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Eggs'
                              },
                              stacked: true
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Date'
                              },
                              stacked: true
                            }
                          },
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.dataset.label}: ${context.parsed.y} eggs`;
                                }
                              }
                            },
                            legend: {
                              display: true,
                              position: 'top'
                            },
                            title: {
                              display: true,
                              text: 'Broken vs Incubated Eggs'
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Loading chart data...</p>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Comparison of broken eggs vs eggs placed for incubation over the last 7 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
