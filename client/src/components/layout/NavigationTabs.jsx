import React from 'react';
import { FileText, Bell } from 'lucide-react';

export default function NavigationTabs({ activeTab, onTabChange }) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
        <button
          onClick={() => onTabChange('prescriptions')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'prescriptions'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-5 h-5" />
          My Prescriptions
        </button>
        <button
          onClick={() => onTabChange('reminders')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'reminders'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bell className="w-5 h-5" />
          Today's Reminders
        </button>
      </div>
    </div>
  );
}
