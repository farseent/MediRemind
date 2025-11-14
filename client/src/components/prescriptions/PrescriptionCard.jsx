import React, { useState } from 'react';
import { Pill, Clock, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function PrescriptionCard({ prescription, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Prescription
          </h2>
          <p className="text-sm text-gray-500">
            Doctor: {prescription.doctor}
          </p>
          <p className="text-sm text-gray-500">
            Date: {prescription.dateIssued}
          </p>

          {/* NEW — show count of medicines */}
          <p className="text-sm text-blue-600 mt-1">
            {prescription.medicines.length} medicines
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(prescription._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 flex items-center gap-2 text-blue-600 font-semibold hover:underline"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-5 h-5" /> Collapse
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5" /> Expand
          </>
        )}
      </button>

      {/* COLLAPSIBLE CONTENT */}
      {expanded && (
        <div className="mt-5 space-y-5 animate-fadeIn">
          {prescription.medicines.map((med) => (
            <div
              key={med._id}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50"
            >
              {/* Medicine Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {med.medicineName}
                  </h3>
                  <p className="text-sm text-gray-500">{med.dosage}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500 mb-1">Frequency</p>
                  <p className="font-semibold text-gray-800">{med.frequency}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-800">{med.duration}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-800">{med.startDate}</p>
                </div>
              </div>

              {/* Instructions */}
              {med.instructions && (
                <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Instructions:</span> {med.instructions}
                  </p>
                </div>
              )}

              {/* Reminders */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-semibold text-gray-700">Reminders</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {med.reminders?.map((time, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
