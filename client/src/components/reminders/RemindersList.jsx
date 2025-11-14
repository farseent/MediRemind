import React from 'react';
import { Calendar } from 'lucide-react';
import ReminderItem from './ReminderItem';

export default function RemindersList({ prescriptions }) {
  const [completed, setCompleted] = React.useState([]);

  const markAsTaken = (medicineId, time) => {
    setCompleted(prev => [...prev, `${medicineId}-${time}`]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">
          Today - {new Date().toLocaleDateString()}
        </h2>
      </div>

      <div className="space-y-4">
        {prescriptions.flatMap(p =>
          p.medicines.flatMap(m =>
            (m.reminders || []).map((time) => {
              const isCompleted = completed.includes(`${m._id}-${time}`);

              return (
                <ReminderItem
                  key={`${m._id}-${time}`}
                  time={time}
                  medicineName={m.medicineName}
                  dosage={m.dosage}
                  completed={isCompleted}        // ✔ pass completed status
                  onMark={() => markAsTaken(m._id, time)}  // ✔ mark action
                />
              );
            })
          )
        )}
      </div>
    </div>
  );
}
