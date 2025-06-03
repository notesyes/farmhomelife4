"use client";

import React from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

const PricingPage = () => {

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
              <Link href="/features" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Features
              </Link>
              <Link href="/pricing" className="text-emerald-600 border-b-2 border-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>

            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/signin" 
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the plan that&apos;s right for your farm, with no hidden fees or complicated tiers.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="border rounded-lg shadow-sm p-8 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Monthly Plan</h3>
                <p className="mt-2 text-sm text-gray-500">Perfect for farms just getting started with digital management.</p>
              </div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">$6.99</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
              </div>
            </div>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Unlimited egg tracking</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Feed inventory management</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Basic reporting</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Mobile-friendly dashboard</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Email support</p>
              </li>
            </ul>
            
            <div className="mt-8">
              <a 
                href="https://buy.stripe.com/aFaeVd84meMD1pD6tVbo400" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-emerald-600 text-white text-center px-4 py-3 rounded-md font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                Get started
              </a>
            </div>
          </div>
          
          {/* Annual Plan */}
          <div className="border rounded-lg shadow-sm p-8 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Annual Plan</h3>
                <p className="mt-2 text-sm text-gray-500">Save with our annual billing option.</p>
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                Best Value
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">$69.99</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/year</span>
              </div>
              <p className="mt-1 text-sm text-emerald-600">Save 16% compared to monthly</p>
            </div>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Everything in Monthly plan</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Advanced analytics</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Priority support</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Breeding calendar</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Export data to CSV/Excel</p>
              </li>
            </ul>
            
            <div className="mt-8">
              <a 
                href="https://buy.stripe.com/4gM5kD1FY8of3xLg4vbo401" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-emerald-600 text-white text-center px-4 py-3 rounded-md font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I cancel my subscription anytime?</h3>
              <p className="mt-2 text-gray-600">Yes, you can cancel your subscription at any time from your dashboard. If you cancel, you&apos;ll still have access until the end of your billing period.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Do you offer a free trial?</h3>
              <p className="mt-2 text-gray-600">We offer a 14-day free trial so you can try out all the features before committing to a subscription.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I switch between monthly and annual plans?</h3>
              <p className="mt-2 text-gray-600">Yes, you can switch between plans at any time. If you switch from monthly to annual, we&apos;ll apply a prorated discount.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Is there a limit to how many animals I can track?</h3>
              <p className="mt-2 text-gray-600">No, all our plans include unlimited animal tracking for chickens, ducks, quail, geese, and turkeys. Whether you have 5 or 500 animals, the price remains the same.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Do you offer discounts for educational institutions?</h3>
              <p className="mt-2 text-gray-600">Yes, we offer special pricing for schools and educational institutions. Please contact our support team for more information.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">How secure is my farm data?</h3>
              <p className="mt-2 text-gray-600">We take data security seriously. All data is encrypted both in transit and at rest, and we never share your information with third parties.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-emerald-600">
              Hear from egg farmers who have transformed their business with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4" role="img" aria-label="5 out of 5 stars">
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                &ldquo;This app has completely transformed how I manage my egg production. I used to track everything in spreadsheets, but now it&apos;s all in one place and so much easier to use.&rdquo;
              </blockquote>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-800 mb-1">Sarah Johnson</div>
                <div className="text-sm text-gray-600">Small Farm Owner</div>
                <div className="text-sm text-emerald-600 font-medium">200 hens</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4" role="img" aria-label="5 out of 5 stars">
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                &ldquo;The analytics features have helped me optimize my feed costs and increase egg production by 15%. The ROI on this subscription has been incredible.&rdquo;
              </blockquote>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-800 mb-1">Michael Rodriguez</div>
                <div className="text-sm text-gray-600">Mid-size Farm Manager</div>
                <div className="text-sm text-emerald-600 font-medium">800 hens</div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4" role="img" aria-label="4 out of 5 stars">
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-gray-300" aria-hidden="true">★</span>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                &ldquo;The breeding calendar feature is a game-changer. I never miss important dates now, and our hatch rates have improved significantly.&rdquo;
              </blockquote>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-800 mb-1">Emily Chen</div>
                <div className="text-sm text-gray-600">Heritage Breed Specialist</div>
                <div className="text-sm text-emerald-600 font-medium">150 hens</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to start managing your farm more efficiently?
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
                  <Link href="#testimonials" className="text-base text-gray-300 hover:text-white">
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
                  <Link href="#faq" className="text-base text-gray-300 hover:text-white">
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

export default PricingPage;
