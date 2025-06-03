"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Script from "next/script";

// Add type declaration for jspdf on window object
declare global {
  interface Window {
    jspdf: {
      jsPDF: new () => any;
    };
  }
}

// Types for our customer data
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dozensPurchased: number;
  totalSales: number;
};

type Sale = {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  dozens: number;
  pricePerDozen: number;
  total: number;
};

export default function CustomersPage() {
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
      { id: "1", name: "juan", email: "juan@example.com", phone: "555-123-4567", dozensPurchased: 3.00, totalSales: 18.00 },
      { id: "2", name: "Juan Sanchez's", email: "jsanchez@example.com", phone: "555-234-5678", dozensPurchased: 0.00, totalSales: 0.00 },
      { id: "3", name: "machelle", email: "machelle@example.com", phone: "555-345-6789", dozensPurchased: 0.00, totalSales: 0.00 },
      { id: "4", name: "michael", email: "michael@example.com", phone: "555-456-7890", dozensPurchased: 3.00, totalSales: 18.00 },
      { id: "5", name: "natasha", email: "natasha@example.com", phone: "555-567-8901", dozensPurchased: 0.00, totalSales: 0.00 },
      { id: "6", name: "Peter", email: "peter@example.com", phone: "555-678-9012", dozensPurchased: 0.00, totalSales: 0.00 },
      { id: "7", name: "sage", email: "sage@example.com", phone: "555-789-0123", dozensPurchased: 1.00, totalSales: 6.00 },
    ];
  });

  // Mock data for recent sales
  const [recentSales, setRecentSales] = useState<Sale[]>([
    { 
      id: "1", 
      date: "2025-06-02", 
      customerId: "4", 
      customerName: "michael", 
      dozens: 3.00, 
      pricePerDozen: 6.00, 
      total: 18.00 
    },
    { 
      id: "2", 
      date: "2025-04-23", 
      customerId: "7", 
      customerName: "sage", 
      dozens: 1.00, 
      pricePerDozen: 6.00, 
      total: 6.00 
    },
    { 
      id: "3", 
      date: "2025-04-23", 
      customerId: "1", 
      customerName: "juan", 
      dozens: 3.00, 
      pricePerDozen: 6.00, 
      total: 18.00 
    },
  ]);

  // State for the new customer form
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  // Save customers to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmhomelife-customers', JSON.stringify(customers));
    }
  }, [customers]);

  // State for editing customer
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // State for the new sale form
  const [isAddingSale, setIsAddingSale] = useState(false);
  const [newSale, setNewSale] = useState({
    customerId: "",
    dozens: 0,
    pricePerDozen: 6.00
  });

  // Function to handle adding a new customer
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCustomer.name.trim() === "") {
      alert("Please enter a customer name");
      return;
    }
    
    const newCustomerId = (customers.length + 1).toString();
    
    setCustomers([
      ...customers,
      {
        id: newCustomerId,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        dozensPurchased: 0,
        totalSales: 0
      }
    ]);
    
    setNewCustomer({ name: "", email: "", phone: "" });
    setIsAddingCustomer(false);
  };

  // Function to start editing a customer
  const handleStartEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditingCustomer(true);
  };

  // Function to handle editing a customer
  const handleEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCustomer) return;
    
    if (editingCustomer.name.trim() === "") {
      alert("Please enter a customer name");
      return;
    }
    
    setCustomers(customers.map(customer => 
      customer.id === editingCustomer.id ? editingCustomer : customer
    ));
    
    setEditingCustomer(null);
    setIsEditingCustomer(false);
  };

  // Function to handle adding a new sale
  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newSale.customerId === "") {
      alert("Please select a customer");
      return;
    }
    
    if (newSale.dozens <= 0) {
      alert("Please enter a valid number of dozens");
      return;
    }
    
    const selectedCustomer = customers.find(c => c.id === newSale.customerId);
    
    if (!selectedCustomer) {
      alert("Invalid customer selected");
      return;
    }
    
    const saleTotal = newSale.dozens * newSale.pricePerDozen;
    const newSaleId = (recentSales.length + 1).toString();
    const today = new Date().toISOString().split('T')[0];
    
    // Add the new sale
    const sale: Sale = {
      id: newSaleId,
      date: today,
      customerId: newSale.customerId,
      customerName: selectedCustomer.name,
      dozens: newSale.dozens,
      pricePerDozen: newSale.pricePerDozen,
      total: saleTotal
    };
    
    setRecentSales([sale, ...recentSales]);
    
    // Update the customer's purchase data
    setCustomers(customers.map(customer => {
      if (customer.id === newSale.customerId) {
        return {
          ...customer,
          dozensPurchased: customer.dozensPurchased + newSale.dozens,
          totalSales: customer.totalSales + saleTotal
        };
      }
      return customer;
    }));
    
    setNewSale({
      customerId: "",
      dozens: 0,
      pricePerDozen: 6.00
    });
    
    setIsAddingSale(false);
  };

  // Function to generate and download an invoice PDF for a specific customer
  const handleDownloadInvoice = (customer: Customer) => {
    // Check if jsPDF is available
    if (typeof window !== 'undefined' && window.jspdf) {
      try {
        // Get customer's sales
        const customerSales = recentSales.filter(sale => sale.customerId === customer.id);
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add invoice header
        doc.setFontSize(20);
        doc.text('INVOICE', 105, 20, { align: 'center' });
        
        // Add Farm Home Life info
        doc.setFontSize(12);
        doc.text('Farm Home Life', 14, 30);
        doc.setFontSize(10);
        doc.text('123 Farm Road', 14, 35);
        doc.text('Countryside, CA 94123', 14, 40);
        doc.text('support@farmhomelife.com', 14, 45);
        doc.text('(555) 123-4567', 14, 50);
        
        // Add invoice details
        doc.setFontSize(10);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 140, 30);
        doc.text(`Invoice #: INV-${customer.id}-${Date.now().toString().substr(-6)}`, 140, 35);
        doc.text(`Due Date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`, 140, 40);
        
        // Add customer details
        doc.setFontSize(12);
        doc.text('Bill To:', 14, 60);
        doc.setFontSize(10);
        doc.text(customer.name, 14, 65);
        if (customer.email) doc.text(customer.email, 14, 70);
        if (customer.phone) doc.text(customer.phone, 14, 75);
        
        // Add table headers
        const startY = 85;
        doc.setFillColor(240, 240, 240);
        doc.rect(14, startY, 182, 10, 'F');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Date', 16, startY + 7);
        doc.text('Description', 50, startY + 7);
        doc.text('Quantity', 110, startY + 7);
        doc.text('Unit Price', 140, startY + 7);
        doc.text('Amount', 175, startY + 7);
        
        // Add sale items
        let yPos = startY + 15;
        let total = 0;
        
        if (customerSales.length === 0) {
          doc.text('No sales records found', 14, yPos);
          yPos += 10;
        } else {
          customerSales.forEach((sale, index) => {
            doc.text(sale.date, 16, yPos);
            doc.text(`Farm Fresh Eggs (${sale.dozens.toFixed(1)} dozen)`, 50, yPos);
            doc.text(sale.dozens.toFixed(2), 110, yPos);
            doc.text(`$${sale.pricePerDozen.toFixed(2)}`, 140, yPos);
            doc.text(`$${sale.total.toFixed(2)}`, 175, yPos);
            
            total += sale.total;
            yPos += 10;
            
            // Add a light line between rows
            if (index < customerSales.length - 1) {
              doc.setDrawColor(200, 200, 200);
              doc.line(14, yPos - 5, 196, yPos - 5);
            }
          });
        }
        
        // Add total
        yPos += 10;
        doc.setDrawColor(0, 0, 0);
        doc.line(140, yPos - 5, 196, yPos - 5);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Total:', 140, yPos + 5);
        doc.text(`$${total.toFixed(2)}`, 175, yPos + 5);
        
        // Add payment terms
        yPos += 20;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Payment Terms: Net 30', 14, yPos);
        yPos += 10;
        doc.text('Please make checks payable to Farm Home Life', 14, yPos);
        
        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for your business!', 105, 280, { align: 'center' });
        
        // Save the PDF
        doc.save(`invoice-${customer.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      } catch (error) {
        console.error('Error generating invoice PDF:', error);
        alert('There was an error generating the invoice. Please try again.');
      }
    } else {
      alert('PDF generation library is loading. Please try again in a moment.');
    }
  };

  // Function to handle downloading customer data as PDF
  const handleDownloadPDF = () => {
    // Check if jsPDF is available
    if (typeof window !== 'undefined' && window.jspdf) {
      try {
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Farm Home Life - Customer Report', 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Add table headers
        doc.setFontSize(12);
        doc.setTextColor(0, 128, 0); // Green color for headers
        doc.text('Customer Name', 14, 45);
        doc.text('Dozens Purchased', 90, 45);
        doc.text('Total Sales ($)', 150, 45);
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        
        // Add customer data
        let yPos = 55;
        customers.forEach((customer, index) => {
          if (yPos > 270) { // Check if we need a new page
            doc.addPage();
            yPos = 20;
            // Add headers on new page
            doc.setFontSize(12);
            doc.setTextColor(0, 128, 0);
            doc.text('Customer Name', 14, yPos);
            doc.text('Dozens Purchased', 90, yPos);
            doc.text('Total Sales ($)', 150, yPos);
            doc.setTextColor(0, 0, 0);
            yPos += 10;
          }
          
          doc.text(customer.name, 14, yPos);
          doc.text(customer.dozensPurchased.toFixed(2), 90, yPos);
          doc.text(customer.totalSales.toFixed(2), 150, yPos);
          yPos += 10;
          
          // Add a light line between rows (except last)
          if (index < customers.length - 1) {
            doc.setDrawColor(200, 200, 200);
            doc.line(14, yPos - 5, 190, yPos - 5);
          }
        });
        
        // Add summary
        const totalDozens = customers.reduce((sum, customer) => sum + customer.dozensPurchased, 0);
        const totalSales = customers.reduce((sum, customer) => sum + customer.totalSales, 0);
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Total:', 14, yPos);
        doc.text(totalDozens.toFixed(2), 90, yPos);
        doc.text(totalSales.toFixed(2), 150, yPos);
        
        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Farm Home Life Dashboard - Confidential', 14, 285);
        
        // Save the PDF
        doc.save('farm-home-life-customers.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
      }
    } else {
      alert('PDF generation library is loading. Please try again in a moment.');
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />

          {/* Customer Management Content */}
          <main className="flex-1 overflow-y-auto p-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-amber-900">Customer Management</h1>
                <p className="text-amber-800">Track customer purchases and sales</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">Customer Management</h2>
                <button
                  onClick={() => setIsAddingCustomer(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Add New Customer
                </button>
              </div>

              {/* Add Customer Form */}
              {isAddingCustomer && (
                <div className="p-4 bg-amber-50 border-b border-amber-100">
                  <form onSubmit={handleAddCustomer} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-amber-700 mb-1">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <label htmlFor="customerEmail" className="block text-sm font-medium text-amber-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="customerEmail"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label htmlFor="customerPhone" className="block text-sm font-medium text-amber-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="customerPhone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomer(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Customer Form */}
              {isEditingCustomer && editingCustomer && (
                <div className="p-4 bg-amber-50 border-b border-amber-100">
                  <form onSubmit={handleEditCustomer} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="editCustomerName" className="block text-sm font-medium text-amber-700 mb-1">
                          Edit Customer Name
                        </label>
                        <input
                          type="text"
                          id="editCustomerName"
                          value={editingCustomer.name}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="editCustomerEmail" className="block text-sm font-medium text-amber-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="editCustomerEmail"
                          value={editingCustomer.email || ''}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label htmlFor="editCustomerPhone" className="block text-sm font-medium text-amber-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="editCustomerPhone"
                          value={editingCustomer.phone || ''}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCustomer(null);
                          setIsEditingCustomer(false);
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Add Sale Form */}
              {isAddingSale && (
                <div className="p-4 bg-amber-50 border-b border-amber-100">
                  <form onSubmit={handleAddSale} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="saleCustomer" className="block text-sm font-medium text-amber-700 mb-1">
                          Customer
                        </label>
                        <select
                          id="saleCustomer"
                          value={newSale.customerId}
                          onChange={(e) => setNewSale({ ...newSale, customerId: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select a customer</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="saleDozens" className="block text-sm font-medium text-amber-700 mb-1">
                          Dozens
                        </label>
                        <input
                          type="number"
                          id="saleDozens"
                          value={newSale.dozens}
                          onChange={(e) => setNewSale({ ...newSale, dozens: parseFloat(e.target.value) })}
                          min="0"
                          step="0.5"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="salePrice" className="block text-sm font-medium text-amber-700 mb-1">
                          Price per Dozen ($)
                        </label>
                        <input
                          type="number"
                          id="salePrice"
                          value={newSale.pricePerDozen}
                          onChange={(e) => setNewSale({ ...newSale, pricePerDozen: parseFloat(e.target.value) })}
                          min="0"
                          step="0.5"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Add Sale
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingSale(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Customer Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Dozens Purchased
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Total Sales
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {customer.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {customer.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {customer.dozensPurchased.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          ${customer.totalSales.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleStartEditCustomer(customer)}
                              className="px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
                            >
                              <span className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Edit
                              </span>
                            </button>
                            <Link
                              href={`/dashboard/sales?customerId=${customer.id}`}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Sales
                              </span>
                            </Link>
                            <button
                              onClick={() => handleDownloadInvoice(customer)}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Invoice
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Add Sale Button */}
              <div className="p-4 border-t border-amber-200 bg-amber-50">
                <button
                  onClick={() => setIsAddingSale(true)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Add New Sale
                </button>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-amber-900">Recent Sales</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Dozens
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Price/Dozen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          {sale.dozens.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                          ${sale.pricePerDozen.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                          ${sale.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </main>
        </div>
      </div>
      
      {/* Load jsPDF library */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" 
        strategy="lazyOnload"
        onLoad={() => {
          console.log('jsPDF library loaded');
        }}
      />
    </>
  );
}
