"use client";

import React from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

const FeaturesPage = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-emerald-600">🏡 Farm Home Life</span>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Home
              </Link>
              <Link href="/features" className="text-emerald-600 border-b-2 border-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div id="features-hero" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Powerful Features for Egg Farmers
            </h2>
            <p className="text-xl text-emerald-600 mb-2">
              Everything you need to manage your egg production business in one place
            </p>
            <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
              NEW FEATURES
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="border rounded-lg shadow-sm p-8 transition-all duration-200 hover:shadow-md">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Egg Production Tracking</h3>
            <p className="text-gray-600 mb-4">
              Track daily egg production by breed, coop, or individual bird. Generate reports and visualize trends over time.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Daily collection logs</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Production analytics</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Bird-specific tracking</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="border rounded-lg shadow-sm p-8 transition-all duration-200 hover:shadow-md">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Feed Inventory Management</h3>
            <p className="text-gray-600 mb-4">
              Track feed inventory, consumption rates, and costs. Set up automatic alerts for low inventory levels.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Feed usage tracking</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Cost analysis</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Low inventory alerts</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="border rounded-lg shadow-sm p-8 transition-all duration-200 hover:shadow-md">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Management</h3>
            <p className="text-gray-600 mb-4">
              Track egg sales, manage customers, and generate invoices. Analyze sales data to optimize pricing.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Customer database</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Invoice generation</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">Sales analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* More Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            More Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 4 */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Breeding Calendar</h3>
                <p className="text-gray-600">
                  Keep track of breeding schedules, incubation periods, and hatch dates. Set reminders for important events.
                </p>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-gray-600">
                  Gain insights into your farm&apos;s performance with detailed analytics and customizable reports.
                </p>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Expense Tracking</h3>
                <p className="text-gray-600">
                  Track all farm expenses and categorize them for better financial management and tax reporting.
                </p>
              </div>
            </div>
            
            {/* Feature 7 */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mobile App</h3>
                <p className="text-gray-600">
                  Access your farm data on the go with our mobile app. Add egg collections, check inventory, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to streamline your farm management?
          </h2>
          <p className="mt-4 text-xl text-emerald-100">
            Join thousands of farmers who have transformed their operations with Farm Home Life.
          </p>
          <div className="mt-8">
            <Link 
              href="/signup" 
              className="inline-block bg-white text-emerald-700 px-6 py-3 rounded-md text-base font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Start your free trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-white">🏡 Farm Home Life</span>
              </Link>
              <p className="mt-4 text-gray-400 text-sm">
                The complete management solution for modern farmers.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/features" className="text-base text-gray-300 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-base text-gray-300 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-base text-gray-300 hover:text-white">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/help" className="text-base text-gray-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base text-gray-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/pricing#faq" className="text-base text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/privacy" className="text-base text-gray-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-base text-gray-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Farm Home Life. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
