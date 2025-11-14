import React from 'react';
import { Pill } from 'lucide-react';
import PrescriptionCard from './PrescriptionCard';

export default function PrescriptionList({ prescriptions, onDelete }) {
  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No prescriptions yet
        </h3>
        <p className="text-gray-500 mb-6">
          Add your first prescription to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {prescriptions.map((prescription) => (
        <PrescriptionCard
          key={prescription._id}
          prescription={prescription}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
