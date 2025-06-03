"use client";

import React from "react";
import Link from "next/link";

const TestimonialsPage = () => {
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
              <Link href="/pricing" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>
              <Link href="/testimonials" className="text-emerald-600 border-b-2 border-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Testimonials
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Success Stories from Our Users
            </h2>
            <p className="text-xl text-emerald-600 mb-2">
              See how Farm Home Life has helped egg farmers across the country
            </p>
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

            {/* Testimonial 4 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4" role="img" aria-label="5 out of 5 stars">
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                &ldquo;The customer management system has helped me build better relationships with my regular buyers. The automated invoicing saves me hours every week.&rdquo;
              </blockquote>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-800 mb-1">David Williams</div>
                <div className="text-sm text-gray-600">Farm-to-Table Business Owner</div>
                <div className="text-sm text-emerald-600 font-medium">350 hens</div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4" role="img" aria-label="5 out of 5 stars">
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                &ldquo;I&apos;ve tried several farm management apps, but Farm Home Life is by far the most intuitive and comprehensive. The mobile app is perfect for recording data while I&apos;m in the coop.&rdquo;
              </blockquote>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-800 mb-1">Jessica Thompson</div>
                <div className="text-sm text-gray-600">Organic Egg Producer</div>
                <div className="text-sm text-emerald-600 font-medium">500 hens</div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4" role="img" aria-label="4 out of 5 stars">
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-yellow-400" aria-hidden="true">★</span>
                <span className="text-lg text-gray-300" aria-hidden="true">★</span>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                &ldquo;The expense tracking feature has made tax season so much easier. I can generate reports with just a few clicks and my accountant loves it.&rdquo;
              </blockquote>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-800 mb-1">Robert Garcia</div>
                <div className="text-sm text-gray-600">Family Farm Owner</div>
                <div className="text-sm text-emerald-600 font-medium">250 hens</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Join our satisfied customers
          </h2>
          <p className="mt-4 text-xl text-emerald-100">
            Start your free trial today and see the difference for yourself.
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
                  <Link href="/testimonials#testimonials" className="text-base text-gray-300 hover:text-white">
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

export default TestimonialsPage;
