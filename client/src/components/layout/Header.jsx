import React from 'react';
import { Plus, Pill } from 'lucide-react';

export default function Header({ onAddClick }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">MediRemind</h1>
              <p className="text-sm text-gray-500">Never miss a dose</p>
            </div>
          </div>
          <button
            onClick={onAddClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Prescription
          </button>
        </div>
      </div>
    </header>
  );
}
