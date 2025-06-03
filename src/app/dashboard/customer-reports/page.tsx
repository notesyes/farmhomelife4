"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Script from "next/script";

// Add type declaration for jspdf on window object
declare global {
  interface Window {
    jspdf?: {
      jsPDF: new () => {
        setFontSize: (size: number) => void;
        text: (
          text: string,
          x: number,
          y: number,
          options?: { align?: string }
        ) => void;
        setFillColor: (r: number, g: number, b: number) => void;
        rect: (
          x: number,
          y: number,
          width: number,
          height: number,
          style?: string
        ) => void;
        setTextColor: (r: number, g: number, b: number) => void;
        setDrawColor: (r: number, g: number, b: number) => void;
        line: (x1: number, y1: number, x2: number, y2: number) => void;
        setFont: (font?: string, style?: string) => void;
        addPage: () => void;
        save: (filename: string) => void;
      };
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

function CustomerReportsPageContent() {
  const searchParams = useSearchParams();
  const selectedCustomerId = searchParams.get("customerId");

  // Customer data with localStorage persistence
  const [customers, setCustomers] = useState<Customer[]>(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const savedCustomers = localStorage.getItem("farmhomelife-customers");
      if (savedCustomers) {
        try {
          return JSON.parse(savedCustomers);
        } catch (e) {
          console.error("Error parsing saved customers:", e);
        }
      }
    }
    // Start with empty customer list
    return [];
  });

  // Mock data for recent sales
  const [recentSales, setRecentSales] = useState<Sale[]>(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const savedSales = localStorage.getItem("farmhomelife-sales");
      if (savedSales) {
        try {
          return JSON.parse(savedSales);
        } catch (e) {
          console.error("Error parsing saved sales:", e);
        }
      }
    }

    // Start with empty sales list
    return [];
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCustomers = localStorage.getItem("farmhomelife-customers");
      if (savedCustomers) {
        try {
          setCustomers(JSON.parse(savedCustomers));
        } catch (e) {
          console.error("Error parsing saved customers:", e);
        }
      }

      const savedSales = localStorage.getItem("farmhomelife-sales");
      if (savedSales) {
        try {
          setRecentSales(JSON.parse(savedSales));
        } catch (e) {
          console.error("Error parsing saved sales:", e);
        }
      }
    }
  }, []);

  // State for selected customer
  const [selectedCustomer, setSelectedCustomer] = useState<string>(
    selectedCustomerId || ""
  );

  // Get filtered sales for the selected customer
  const filteredSales = selectedCustomer
    ? recentSales.filter((sale) => sale.customerId === selectedCustomer)
    : [];

  // Get the customer object
  const customer = customers.find((c) => c.id === selectedCustomer);

  // Function to handle generating a detailed customer report as PDF
  const handleGenerateReport = () => {
    if (!selectedCustomer) {
      alert("Please select a customer first");
      return;
    }

    // Check if jsPDF is available
    if (typeof window !== "undefined" && window.jspdf) {
      try {
        // Get customer's sales
        const customerSales = recentSales.filter(
          (sale) => sale.customerId === selectedCustomer
        );
        const customerData = customers.find((c) => c.id === selectedCustomer);

        if (!customerData) {
          alert("Customer data not found");
          return;
        }

        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text("Customer Purchase Report", 105, 20, { align: "center" });

        // Add Farm Home Life info
        doc.setFontSize(12);
        doc.text("Farm Home Life", 14, 30);
        doc.setFontSize(10);
        doc.text(
          `Report Generated: ${new Date().toLocaleDateString()}`,
          14,
          35
        );

        // Add customer details
        doc.setFontSize(14);
        doc.text("Customer Information", 14, 45);
        doc.setFontSize(10);
        doc.text(`Name: ${customerData.name}`, 14, 55);
        if (customerData.email)
          doc.text(`Email: ${customerData.email}`, 14, 60);
        if (customerData.phone)
          doc.text(`Phone: ${customerData.phone}`, 14, 65);
        doc.text(
          `Total Purchases: $${customerData.totalSales.toFixed(2)}`,
          14,
          70
        );
        doc.text(
          `Total Dozens Purchased: ${customerData.dozensPurchased.toFixed(2)}`,
          14,
          75
        );

        // Add purchase history title
        doc.setFontSize(14);
        doc.text("Purchase History", 14, 90);

        // Add table headers
        const startY = 100;
        doc.setFillColor(240, 240, 240);
        doc.rect(14, startY, 182, 10, "F");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Date", 16, startY + 7);
        doc.text("Description", 50, startY + 7);
        doc.text("Quantity (Dozens)", 110, startY + 7);
        doc.text("Unit Price", 150, startY + 7);
        doc.text("Total", 180, startY + 7);

        // Add sale items
        let yPos = startY + 15;
        let total = 0;

        if (customerSales.length === 0) {
          doc.text("No purchase records found", 14, yPos);
          yPos += 10;
        } else {
          customerSales.forEach((sale, index) => {
            doc.text(sale.date, 16, yPos);
            doc.text("Farm Fresh Eggs", 50, yPos);
            doc.text(sale.dozens.toFixed(2), 110, yPos);
            doc.text(`$${sale.pricePerDozen.toFixed(2)}`, 150, yPos);
            doc.text(`$${sale.total.toFixed(2)}`, 180, yPos);

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
        doc.setFont(undefined, "bold");
        doc.text("Total:", 150, yPos + 5);
        doc.text(`$${total.toFixed(2)}`, 180, yPos + 5);

        // Add purchase summary
        yPos += 25;
        doc.setFontSize(14);
        doc.setFont(undefined, "normal");
        doc.text("Purchase Summary", 14, yPos);

        // Add purchase summary details
        yPos += 15;
        doc.setFontSize(10);

        // Calculate some statistics
        const firstPurchase =
          customerSales.length > 0
            ? customerSales.reduce(
                (earliest, sale) =>
                  new Date(sale.date) < new Date(earliest.date)
                    ? sale
                    : earliest,
                customerSales[0]
              )
            : null;

        const lastPurchase =
          customerSales.length > 0
            ? customerSales.reduce(
                (latest, sale) =>
                  new Date(sale.date) > new Date(latest.date) ? sale : latest,
                customerSales[0]
              )
            : null;

        const avgPurchaseValue =
          customerSales.length > 0 ? total / customerSales.length : 0;

        if (firstPurchase) {
          doc.text(`First Purchase: ${firstPurchase.date}`, 14, yPos);
          yPos += 10;
        }

        if (lastPurchase) {
          doc.text(`Most Recent Purchase: ${lastPurchase.date}`, 14, yPos);
          yPos += 10;
        }

        doc.text(`Number of Purchases: ${customerSales.length}`, 14, yPos);
        yPos += 10;

        if (customerSales.length > 0) {
          doc.text(
            `Average Purchase Value: $${avgPurchaseValue.toFixed(2)}`,
            14,
            yPos
          );
        }

        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Farm Home Life - Customer Purchase Report", 105, 280, {
          align: "center",
        });

        // Save the PDF
        doc.save(
          `customer-report-${customerData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}.pdf`
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating the PDF. Please try again.");
      }
    } else {
      alert("PDF generation library is loading. Please try again in a moment.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <div className="flex">
          <DashboardSidebar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Customer Purchase Reports
              </h1>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-amber-900 mb-4">
                    Generate Customer Purchase Report
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Select a customer to generate a detailed report of their
                    purchase history.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="customerSelect"
                        className="block text-sm font-medium text-amber-700 mb-2"
                      >
                        Select Customer
                      </label>
                      <select
                        id="customerSelect"
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">-- Select a customer --</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}{" "}
                            {customer.dozensPurchased > 0
                              ? `(${customer.dozensPurchased.toFixed(
                                  1
                                )} dozens purchased)`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleGenerateReport}
                        disabled={!selectedCustomer}
                        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                          selectedCustomer
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Generate PDF Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCustomer && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-amber-900">
                      Purchase History: {customer?.name}
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-amber-200">
                      <thead className="bg-amber-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                          >
                            Dozens
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                          >
                            Price/Dozen
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-amber-100">
                        {filteredSales.length > 0 ? (
                          filteredSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-amber-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                                {sale.date}
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
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No purchase records found for this customer.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredSales.length > 0 && (
                    <div className="p-4 border-t border-amber-200 bg-amber-50">
                      <div className="flex justify-end">
                        <div className="text-right">
                          <p className="text-sm text-amber-800">
                            <span className="font-medium">Total Dozens:</span>{" "}
                            {filteredSales
                              .reduce((sum, sale) => sum + sale.dozens, 0)
                              .toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-amber-900 mt-1">
                            <span className="font-medium">Total Amount:</span> $
                            {filteredSales
                              .reduce((sum, sale) => sum + sale.total, 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Load jsPDF library */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("jsPDF library loaded");
        }}
      />
    </>
  );
}

export default function CustomerReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerReportsPageContent />
    </Suspense>
  );
}
