import React from "react";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
                <h1 className="text-2xl font-bold text-emerald-600">
                  🏡 Farm Home Life
                </h1>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Testimonials
            </a>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Pricing
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/signin" className="text-emerald-600 hover:text-emerald-700 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Sign In
            </Link>
            <Link href="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
