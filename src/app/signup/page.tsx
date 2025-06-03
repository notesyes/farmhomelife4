"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";


export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: User info, Step 2: Subscription options
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Move to subscription selection step
      setStep(2);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration delay
    setTimeout(() => {
      // In a real app, you would create the user account here and handle subscription
      // For now, we'll just redirect to the dashboard
      router.push("/dashboard");
    }, 1000);
  };
  
  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };
  
  const handleBack = () => {
    setStep(1);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header />
      <main className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:py-16">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <Link href="/" className="block hover:opacity-80 transition-opacity duration-200">
            <h1 className="text-2xl font-bold text-center text-emerald-600 mb-8">
              {step === 1 ? "Create Your Account" : "Choose Your Plan"}
            </h1>
          </Link>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      required
                      placeholder="Enter your full name"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email address"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="new-password"
                      required
                      placeholder="Create a password"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your password"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-emerald-600 hover:text-emerald-500">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:text-emerald-500">Privacy Policy</a>
                  </label>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 mb-4">
                  Choose a subscription plan that works for you. You can upgrade or downgrade at any time.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Monthly Plan */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}
                    onClick={() => handlePlanSelect('monthly')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Monthly Plan</h3>
                        <p className="text-sm text-gray-500 mt-1">Perfect for getting started</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$6.99</p>
                        <p className="text-sm text-gray-500">per month</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Full access to all features
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Priority customer support
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Cancel anytime
                      </li>
                    </ul>
                    <a 
                      href="https://buy.stripe.com/aFaeVd84meMD1pD6tVbo400" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 block text-xs text-emerald-600 hover:underline"
                    >
                      View payment details
                    </a>
                  </div>
                  
                  {/* Annual Plan */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPlan === 'annual' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}
                    onClick={() => handlePlanSelect('annual')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">Annual Plan</h3>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Save 16%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Best value for serious farmers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$69.99</p>
                        <p className="text-sm text-gray-500">per year</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Everything in monthly plan
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Advanced analytics and reporting
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Dedicated account manager
                      </li>
                    </ul>
                    <a 
                      href="https://buy.stripe.com/4gM5kD1FY8of3xLg4vbo401" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 block text-xs text-emerald-600 hover:underline"
                    >
                      View payment details
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {step === 1 ? (
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Continue to Select Plan
                </button>
              </div>
            ) : (
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  disabled={isLoading || !selectedPlan}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Back to Account Details
                </button>
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="font-medium text-emerald-600 hover:text-emerald-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
