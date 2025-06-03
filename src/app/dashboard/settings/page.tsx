"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    language: "english",
    timezone: "America/New_York",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    theme: "light"
  });
  
  // Sync form data with theme provider
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      theme: theme
    }));
  }, [theme]);

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'theme') {
      // Update theme in the provider
      setTheme(value as 'light' | 'dark' | 'system');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save settings to localStorage
    try {
      localStorage.setItem('userSettings', JSON.stringify(formData));
      
      // Ensure theme is saved separately for the theme provider
      localStorage.setItem('theme', formData.theme);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsSaving(false);
        alert('Settings saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
      alert('There was an error saving your settings. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
            </div>

            {/* Settings Navigation */}
            <div className="flex mb-6 border-b border-gray-200">
              <Link 
                href="/dashboard/settings" 
                className="px-4 py-2 text-sm font-medium text-emerald-600 border-b-2 border-emerald-600"
              >
                General
              </Link>
              <Link 
                href="/dashboard/settings/password" 
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Password
              </Link>
              <Link 
                href="/dashboard/settings/notifications" 
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Notifications
              </Link>
            </div>

            {/* Settings Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-800">Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                      >
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                        <option value="CAD">Canadian Dollar (C$)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                        Date Format
                      </label>
                      <select
                        id="dateFormat"
                        name="dateFormat"
                        value={formData.dateFormat}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-700"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-800">Theme</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                        Interface Theme
                      </label>
                      <div className="mt-1 flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={formData.theme === "light"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Light</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={formData.theme === "dark"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Dark</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="system"
                            checked={formData.theme === "system"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">System</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
