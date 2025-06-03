"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function NotificationSettingsPage() {
  const [formData, setFormData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,

    // Notification types
    orderUpdates: true,
    inventoryAlerts: true,
    productionAlerts: true,
    paymentReminders: true,
    weeklyReports: true,
    monthlyReports: true,
    systemUpdates: false,
    promotionalOffers: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Clear any previous success message when user makes changes
    if (success) setSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call to save notification settings
    setTimeout(() => {
      setIsSaving(false);
      setSuccess("Notification preferences updated successfully");
    }, 1000);
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
              <h1 className="text-2xl font-bold text-gray-800">
                Notification Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage how you receive notifications and updates
              </p>
            </div>

            {/* Settings Navigation */}
            <div className="flex mb-6 border-b border-gray-200">
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
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
                className="px-4 py-2 text-sm font-medium text-emerald-600 border-b-2 border-emerald-600"
              >
                Notifications
              </Link>
            </div>

            {/* Notification Settings Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                  <p className="text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-800">
                    Notification Channels
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose how you&apos;d like to receive notifications
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={formData.emailNotifications}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="emailNotifications"
                          className="font-medium text-gray-700"
                        >
                          Email Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive notifications and updates via email
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="smsNotifications"
                          name="smsNotifications"
                          type="checkbox"
                          checked={formData.smsNotifications}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="smsNotifications"
                          className="font-medium text-gray-700"
                        >
                          SMS Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive text messages for important updates
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="pushNotifications"
                          name="pushNotifications"
                          type="checkbox"
                          checked={formData.pushNotifications}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="pushNotifications"
                          className="font-medium text-gray-700"
                        >
                          Push Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive notifications in your browser or mobile app
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingEmails"
                          name="marketingEmails"
                          type="checkbox"
                          checked={formData.marketingEmails}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="marketingEmails"
                          className="font-medium text-gray-700"
                        >
                          Marketing Emails
                        </label>
                        <p className="text-gray-500">
                          Receive promotional offers and newsletters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-800">
                    Notification Types
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select which types of notifications you want to receive
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="orderUpdates"
                          name="orderUpdates"
                          type="checkbox"
                          checked={formData.orderUpdates}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="orderUpdates"
                          className="font-medium text-gray-700"
                        >
                          Order Updates
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="inventoryAlerts"
                          name="inventoryAlerts"
                          type="checkbox"
                          checked={formData.inventoryAlerts}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="inventoryAlerts"
                          className="font-medium text-gray-700"
                        >
                          Inventory Alerts
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="productionAlerts"
                          name="productionAlerts"
                          type="checkbox"
                          checked={formData.productionAlerts}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="productionAlerts"
                          className="font-medium text-gray-700"
                        >
                          Production Alerts
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="paymentReminders"
                          name="paymentReminders"
                          type="checkbox"
                          checked={formData.paymentReminders}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="paymentReminders"
                          className="font-medium text-gray-700"
                        >
                          Payment Reminders
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="weeklyReports"
                          name="weeklyReports"
                          type="checkbox"
                          checked={formData.weeklyReports}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="weeklyReports"
                          className="font-medium text-gray-700"
                        >
                          Weekly Reports
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="monthlyReports"
                          name="monthlyReports"
                          type="checkbox"
                          checked={formData.monthlyReports}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="monthlyReports"
                          className="font-medium text-gray-700"
                        >
                          Monthly Reports
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="systemUpdates"
                          name="systemUpdates"
                          type="checkbox"
                          checked={formData.systemUpdates}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="systemUpdates"
                          className="font-medium text-gray-700"
                        >
                          System Updates
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="promotionalOffers"
                          name="promotionalOffers"
                          type="checkbox"
                          checked={formData.promotionalOffers}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="promotionalOffers"
                          className="font-medium text-gray-700"
                        >
                          Promotional Offers
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
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
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
