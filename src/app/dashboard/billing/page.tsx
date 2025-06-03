"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function BillingHistoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Define invoice type
  type Invoice = {
    id: string;
    date: string;
    amount: string;
    status: string;
    description: string;
  };
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Simulate loading invoices from Stripe
    // In a real implementation, you would fetch this from your backend API
    // that connects to Stripe's API
    setTimeout(() => {
      setInvoices([
        {
          id: "in_1234567890",
          date: "June 3, 2025",
          amount: "$6.99",
          status: "Paid",
          description: "Farm Home Life Monthly Subscription"
        },
        {
          id: "in_0987654321",
          date: "May 3, 2025",
          amount: "$6.99",
          status: "Paid",
          description: "Farm Home Life Monthly Subscription"
        },
        {
          id: "in_5678901234",
          date: "April 3, 2025",
          amount: "$6.99",
          status: "Paid",
          description: "Farm Home Life Monthly Subscription"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleViewInvoice = (invoiceId: string) => {
    // In a real implementation, this would redirect to Stripe's hosted invoice page
    // window.open(`https://dashboard.stripe.com/invoices/${invoiceId}`, '_blank');
    console.log(`View invoice: ${invoiceId}`);
  };

  const handleManageSubscription = () => {
    router.push("/dashboard/subscription");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1">
          <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Billing History</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and download your past invoices
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Invoice History
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your past 12 months of billing
                </p>
              </div>
              <button
                onClick={handleManageSubscription}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Manage Subscription
              </button>
            </div>
            
            {isLoading ? (
              <div className="px-4 py-12 text-center">
                <svg className="animate-spin h-8 w-8 mx-auto text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-500">Loading your invoice history...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Need Help?
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                If you have any questions about your billing, please contact our support team.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Support</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <a href="mailto:support@farmhomelife.com" className="text-emerald-600 hover:text-emerald-500">
                      support@farmhomelife.com
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Phone Support</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <a href="tel:+1-555-123-4567" className="text-emerald-600 hover:text-emerald-500">
                      +1 (555) 123-4567
                    </a>
                  </p>
                </div>
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
