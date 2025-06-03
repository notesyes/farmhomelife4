"use client";

import React from "react";
import Link from "next/link";

export default function AboutUsPage() {
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
              <Link href="/about" className="text-emerald-600 border-b-2 border-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Contact
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
            Our Story
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Building the future of farm management, one egg at a time.
          </p>
        </div>
      </div>

      {/* About Us Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-600 mb-4">
              Welcome to Farm Home Life, a web app born from a simple household need and grown into a comprehensive solution for poultry management. It all started when we decided to keep a couple of chickens at home. Before we knew it, &quot;chicken math&quot; took over, and our small flock grew into a bustling operation with over a hundred chickens. As we began selling eggs to local businesses, we quickly realized the need for a better way to manage our inventory, track sales, and monitor feed consumption.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Farm Home Life offers a user-friendly customer database, detailed feed tracking, and comprehensive sales reporting. Not only can you use it for your chickens, but also for your ducks, quails, geese, and turkeys. Whether you&apos;re managing a small flock or a larger operation, our app helps you streamline every aspect of your poultry business. From tracking how much feed you&apos;re using to knowing exactly who your customers are, we give you the tools to succeed.
            </p>
            <p className="text-lg text-gray-600">
              What started as a personal project for our family is now a solution for anyone dealing with the delightful chaos of poultry management. We hope you enjoy using Farm Home Life as much as we enjoyed creating it!
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
              <div className="text-6xl">🧑‍🌾 👩‍🌾</div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We believe in sustainable farming practices and build our tools to help farmers make environmentally conscious decisions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We foster a supportive community of farmers who share knowledge, experiences, and best practices with each other.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate and improve our platform based on real farmer feedback and emerging agricultural technologies.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl">👨</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Founder & CEO</h3>
              <p className="text-gray-600">Leadership & Strategy</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl">👩</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">CTO</h3>
              <p className="text-gray-600">Technology & Development</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl">👨</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Head of Product</h3>
              <p className="text-gray-600">Product Development</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl">👩</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Success Lead</h3>
              <p className="text-gray-600">Support & Training</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Join the Farm Home Life community
          </h2>
          <p className="mt-4 text-xl text-emerald-100">
            Start managing your farm more efficiently today.
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
                  <Link href="/#testimonials" className="text-base text-gray-300 hover:text-white">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/about" className="text-base text-gray-300 hover:text-white">
                    About Us
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
}
