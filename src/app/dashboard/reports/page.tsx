"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

// Icons
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('production');
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<{
    id: string;
    name: string;
    type: string;
    date: string;
    downloadUrl: string;
  }[]>([
    {
      id: '1',
      name: 'Production Report - May 2025',
      type: 'production',
      date: '2025-05-30',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Sales Report - May 2025',
      type: 'sales',
      date: '2025-05-30',
      downloadUrl: '#'
    },
    {
      id: '3',
      name: 'Inventory Report - May 2025',
      type: 'inventory',
      date: '2025-05-30',
      downloadUrl: '#'
    }
  ]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const dateLabel = showCustomDateRange 
        ? `${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d, yyyy')}`
        : dateRange === 'week' 
          ? 'Weekly' 
          : dateRange === 'month' 
            ? 'Monthly' 
            : 'Annual';
      
      const reportTypeLabel = reportType === 'production' 
        ? 'Production' 
        : reportType === 'sales' 
          ? 'Sales' 
          : reportType === 'inventory' 
            ? 'Inventory' 
            : 'Health';
      
      const newReport = {
        id: Date.now().toString(),
        name: `${reportTypeLabel} Report - ${dateLabel}`,
        type: reportType,
        date: format(new Date(), 'yyyy-MM-dd'),
        downloadUrl: '#'
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownloadReport = (reportId: string) => {
    const report = generatedReports.find(r => r.id === reportId);
    if (!report) return;
    
    // Create sample CSV data
    const csvData = createSampleCsvData(report.type);
    
    // Create and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.name.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const createSampleCsvData = (type: string) => {
    let csvContent = '';
    
    if (type === 'production') {
      csvContent = `Date,Species,Variety,Count,Rejected,Notes
${format(new Date(), 'yyyy-MM-dd')},Chicken,Rhode Island Red,24,2,"Morning collection"
${format(new Date(), 'yyyy-MM-dd')},Chicken,Leghorn,18,1,"Afternoon collection"
${format(new Date(), 'yyyy-MM-dd')},Duck,Pekin,8,0,"Morning collection"
${format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')},Chicken,Rhode Island Red,22,1,"Morning collection"
${format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')},Chicken,Leghorn,16,2,"Afternoon collection"
${format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')},Duck,Pekin,7,1,"Morning collection"}`;
    } else if (type === 'sales') {
      csvContent = `Date,Customer,Product,Quantity,Price,Total
${format(new Date(), 'yyyy-MM-dd')},"Local Market","Large Brown Eggs",5,4.50,22.50
${format(new Date(), 'yyyy-MM-dd')},"John Smith","Medium White Eggs",3,3.75,11.25
${format(new Date(), 'yyyy-MM-dd')},"Farm Shop","Duck Eggs",2,6.00,12.00
${format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')},"Local Market","Large Brown Eggs",4,4.50,18.00
${format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')},"Sarah Johnson","Medium White Eggs",2,3.75,7.50
${format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')},"Farm Shop","Duck Eggs",3,6.00,18.00}`;
    } else if (type === 'inventory') {
      csvContent = `Date,Category,Item,Quantity,Unit,Value
${format(new Date(), 'yyyy-MM-dd')},"Feed","Layer Pellets",250,"kg",125.00
${format(new Date(), 'yyyy-MM-dd')},"Eggs","Large Brown",48,"dozen",216.00
${format(new Date(), 'yyyy-MM-dd')},"Eggs","Medium White",36,"dozen",135.00
${format(new Date(), 'yyyy-MM-dd')},"Eggs","Duck Eggs",12,"dozen",72.00
${format(new Date(), 'yyyy-MM-dd')},"Supplies","Egg Cartons",100,"units",25.00
${format(new Date(), 'yyyy-MM-dd')},"Equipment","Incubator",1,"unit",150.00}`;
    } else {
      csvContent = `Date,Species,Variety,Health Issue,Treatment,Notes
${format(new Date(), 'yyyy-MM-dd')},"Chicken","Rhode Island Red","Respiratory issue","Antibiotics","Isolating affected birds"
${format(new Date(), 'yyyy-MM-dd')},"Duck","Pekin","Leg injury","Bandage","Monitoring progress"
${format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')},"Chicken","Leghorn","Mites","Treatment spray","Follow-up in 7 days"
${format(new Date(Date.now() - 172800000), 'yyyy-MM-dd')},"Chicken","Rhode Island Red","Routine check","None","All healthy"}`;
    }
    
    return csvContent;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Farm Reports</h2>
                <button 
                  className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  onClick={() => window.location.href = '/dashboard/incubation'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add New Batch
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Generate and download reports for your farm&apos;s production, sales, inventory, and health records.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="production">Production Report</option>
                    <option value="sales">Sales Report</option>
                    <option value="inventory">Inventory Report</option>
                    <option value="health">Health Report</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.target.value);
                      setShowCustomDateRange(e.target.value === 'custom');
                    }}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                {showCustomDateRange && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <DocumentTextIcon className="h-5 w-5 mr-1" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Generated Reports</h3>
              </div>
              
              {generatedReports.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {generatedReports.map((report) => (
                    <div key={report.id} className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <p className="text-sm text-gray-500">
                          Generated on {format(new Date(report.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="text-emerald-600 hover:text-emerald-700 flex items-center"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No reports have been generated yet.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
