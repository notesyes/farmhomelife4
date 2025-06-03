"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useSearchParams } from 'next/navigation';

export default function SubscriptionPage() {
  // Define subscription type
  type Subscription = {
    plan: string;
    status: string;
    price: string;
    billingPeriod: string;
    nextBillingDate: string;
    canceledAt?: string;
    endDate?: string;
    paymentMethod: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
  
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setIsLoading(true);
      setCheckoutMessage(null); // Clear previous messages
      const sessionIdFromQuery = searchParams.get('session_id');
      
      let apiUrl = '/api/user/get-subscription-status';
      if (sessionIdFromQuery) {
        apiUrl += `?session_id=${sessionIdFromQuery}`;
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch subscription status.');
        }

        setSubscription(data.subscription);
        if (data.message) {
          setCheckoutMessage(data.message);
        }
        
        // Optional: If a session_id was processed and you want to clean the URL,
        // you would use router.replace(pathname, { scroll: false }) here.
        // This requires importing and using useRouter from 'next/navigation'.

      } catch (error: unknown) {
        let errorMessage = 'Could not load your subscription details. Please try again later.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        setCheckoutMessage(errorMessage);
        setSubscription(null); // Clear subscription data on error
        console.error("Failed to fetch subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [searchParams]); // Re-fetch if searchParams change

  const handleCancelSubscription = () => {
    // In a real implementation, this would call your backend API
    // which would then use Stripe's API to cancel the subscription
    if (window.confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        if (subscription) {
          setSubscription({
            ...subscription,
            status: "canceled",
            canceledAt: "June 3, 2025",
            endDate: "July 3, 2025"
          });
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleUpdatePaymentMethod = () => {
    // In a real implementation, this would redirect to Stripe's customer portal
    // or a custom payment method update form
    window.open("https://billing.stripe.com/p/login/test_28o5nC8Qs3Yl5LW288", "_blank");
  };

  const handleReactivateSubscription = () => {
    // In a real implementation, this would call your backend API
    // which would then use Stripe's API to reactivate the subscription
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (subscription) {
        setSubscription({
          ...subscription,
          status: "active",
          canceledAt: undefined,
          endDate: undefined
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleUpgradeSubscription = async (priceId: string) => {
    if (!priceId || priceId.includes("_xxxx")) { // Basic check for placeholder
      setCheckoutMessage("Annual plan Price ID is not configured. Please contact support or check configuration.");
      console.error("Annual plan Price ID is a placeholder or missing:", priceId);
      return;
    }
    setIsProcessingUpgrade(true);
    setCheckoutMessage(null); // Clear previous messages

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }), // Assuming your API takes priceId. Add email if available and needed.
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create checkout session.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout session URL not found in API response:', data);
        throw new Error('Checkout session URL not found. Please try again.');
      }
    } catch (error: unknown) {
      let errorMessage = 'Could not initiate plan upgrade. Please try again later.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setCheckoutMessage(errorMessage);
      console.error("Failed to upgrade subscription:", error);
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1">
          <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Subscription</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your Farm Home Life subscription
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          {checkoutMessage && (
            <div className={`mb-6 p-4 rounded-lg text-base ${checkoutMessage.toLowerCase().includes('success') || checkoutMessage.toLowerCase().includes('activated') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`} role="alert">
              {checkoutMessage}
            </div>
          )}
          {isLoading ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <svg className="animate-spin h-8 w-8 mx-auto text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Loading your subscription details...</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Subscription Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your current plan and billing information
                </p>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Current Plan</dt>
                    <dd className="mt-1 text-sm text-gray-900">Farm Home Life {subscription?.plan}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm">
                      {subscription?.status === "active" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : subscription?.status === "canceled" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Canceled (Ends on {subscription?.endDate})
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subscription?.price} / {subscription?.billingPeriod}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {subscription?.status === "canceled" ? "N/A" : subscription?.nextBillingDate}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      {subscription?.paymentMethod?.brand === "visa" && (
                        <svg className="h-6 w-8 mr-2" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="20" rx="2" fill="#F7F9FC"/>
                          <path d="M12.223 7.012H9.451L7.893 12.992H10.665L12.223 7.012Z" fill="#00579F"/>
                          <path d="M18.315 7.215C17.784 7.012 16.99 6.797 16.026 6.797C14.098 6.797 12.752 7.797 12.741 9.203C12.73 10.227 13.707 10.801 14.445 11.156C15.205 11.52 15.455 11.754 15.455 12.074C15.444 12.566 14.844 12.789 14.28 12.789C13.505 12.789 13.095 12.684 12.431 12.395L12.145 12.266L11.837 14.617C12.464 14.883 13.639 15.117 14.855 15.129C16.905 15.129 18.218 14.141 18.239 12.629C18.25 11.812 17.752 11.191 16.647 10.664C15.973 10.332 15.562 10.109 15.562 9.766C15.573 9.453 15.919 9.129 16.69 9.129C17.327 9.117 17.784 9.254 18.132 9.398L18.325 9.488L18.632 7.215H18.315Z" fill="#00579F"/>
                          <path d="M21.04 7.012C20.565 7.012 20.208 7.16 20.004 7.617L17.232 12.992H19.282L19.67 11.977H22.055L22.27 12.992H24.106L22.483 7.012H21.04ZM20.197 10.367C20.347 9.988 20.885 8.695 20.885 8.695C20.874 8.719 21.019 8.355 21.104 8.129L21.222 8.66C21.222 8.66 21.544 10.035 21.619 10.367H20.197Z" fill="#00579F"/>
                          <path d="M8.697 7.012L6.8 10.988L6.622 10.059C6.324 9.027 5.401 7.91 4.361 7.395L6.118 12.98H8.19L11.237 7.012H8.697Z" fill="#00579F"/>
                          <path d="M5.508 7.012H2.278L2.246 7.172C4.693 7.777 6.335 9.254 6.958 11.059L6.335 7.629C6.206 7.148 5.897 7.023 5.508 7.012Z" fill="#FAA61A"/>
                        </svg>
                      )}
                      •••• {subscription?.paymentMethod?.last4} | Expires {subscription?.paymentMethod?.expMonth}/{subscription?.paymentMethod?.expYear}
                      <button 
                        onClick={handleUpdatePaymentMethod}
                        className="ml-4 text-sm text-emerald-600 hover:text-emerald-500"
                      >
                        Update
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  {subscription?.status === "active" ? (
                    <>
                      {subscription?.plan === "Monthly" && (
                        <button
                          onClick={handleUpgradeSubscription}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          Upgrade to Annual Plan
                        </button>
                      )}
                      <button
                        onClick={handleCancelSubscription}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Cancel Subscription
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleReactivateSubscription}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Reactivate Subscription
                      </button>
                      <Link
                        href="/dashboard/billing"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        View Billing History
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Plan Comparison
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Compare our available subscription plans
              </p>
            </div>
            
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Monthly Plan */}
                  <div className={`border rounded-lg p-6 ${subscription?.plan === "Monthly" && subscription?.status === "active" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Monthly Plan</h3>
                        <p className="mt-1 text-sm text-gray-500">Perfect for getting started</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$6.99</p>
                        <p className="text-sm text-gray-500">per month</p>
                      </div>
                    </div>
                    
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-emerald-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">Full access to all features</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-emerald-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">Priority customer support</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-emerald-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">Cancel any&nbsp;time</span>
                      </li>
                    </ul>
                    
                    {subscription?.plan !== "Monthly" || subscription?.status !== "active" ? (
                      <a 
                        href="https://buy.stripe.com/aFaeVd84meMD1pD6tVbo400" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-6 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Subscribe Monthly
                      </a>
                    ) : (
                      <div className="mt-6 text-center px-4 py-2 border border-emerald-500 text-sm font-medium rounded-md text-emerald-700 bg-emerald-50">
                        Your Current Plan
                      </div>
                    )}
                  </div>
                  
                  {/* Annual Plan */}
                  <div className={`border rounded-lg p-6 ${subscription?.plan === "Annual" && subscription?.status === "active" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">Annual Plan</h3>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Save 16%
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Best value for serious farmers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$69.99</p>
                        <p className="text-sm text-gray-500">per year</p>
                      </div>
                    </div>
                    
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-emerald-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">Everything in monthly plan</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-emerald-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">Advanced analytics and reporting</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-emerald-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">Dedicated account manager</span>
                      </li>
                    </ul>
                    
                    {subscription?.plan !== "Annual" || subscription?.status !== "active" ? (
                      <button
                        onClick={() => handleUpgradeSubscription("price_xxxxxxxxxxxxxx_annual")} // IMPORTANT: Replace with your actual Annual Plan Price ID from Stripe
                        disabled={isProcessingUpgrade || isLoading}
                        className="mt-6 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isProcessingUpgrade ? "Processing..." : "Subscribe Annually"}
                      </button>
                    ) : (
                      <div className="mt-6 text-center px-4 py-2 border border-emerald-500 text-sm font-medium rounded-md text-emerald-700 bg-emerald-50">
                        Your Current Plan
                      </div>
                    )}
                  </div>
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
