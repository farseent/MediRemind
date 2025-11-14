import React from 'react';
import { Clock } from 'lucide-react';

export default function ReminderItem({ time, medicineName, dosage, completed, onMark }) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all 
        ${completed 
          ? "bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed" 
          : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100"
        }`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>

        <div>
          <p className="font-bold text-gray-800">{time}</p>
          <p className="text-gray-600">{medicineName}</p>
          <p className="text-sm text-gray-500">{dosage}</p>
        </div>
      </div>

      <button
        disabled={completed}
        onClick={onMark}
        className={`px-4 py-2 rounded-lg transition-all 
          ${completed
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
          }`}
      >
        {completed ? "Taken" : "Mark Taken"}
      </button>
    </div>
  );
}
