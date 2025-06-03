"use client";

import { useState } from "react";
import Link from "next/link";

const SubscriptionCard: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Farm Home Life Premium</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="text-gray-600">
          <p className="mb-2">Upgrade to our premium service for advanced features:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Automated inventory tracking</li>
            <li>Advanced reporting and analytics</li>
            <li>Customer relationship management</li>
            <li>Mobile app access</li>
            <li>Priority support</li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-800">$9.99</span>
            <span className="text-gray-600 ml-1">/month</span>
          </div>
          
          <Link 
            href="https://buy.stripe.com/aFaeVd84meMD1pD6tVbo400"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center justify-center px-5 py-2 border border-transparent 
              text-base font-medium rounded-md text-white 
              ${isHovered ? 'bg-emerald-700' : 'bg-emerald-600'} 
              hover:bg-emerald-700 transition-colors duration-200
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Subscribe Now
          </Link>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Secure payment processed by Stripe. Cancel anytime.
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
