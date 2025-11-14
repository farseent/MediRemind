import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import NavigationTabs from './components/layout/NavigationTabs';
import PrescriptionList from './components/prescriptions/PrescriptionList';
import RemindersList from './components/reminders/RemindersList';
import AddPrescriptionModal from './components/prescriptions/AddPrescriptionModal';
import { usePrescriptions } from './hooks/usePrescriptions';
import { requestNotificationPermission } from "./utils/notificationPermission";
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [showAddModal, setShowAddModal] = useState(false);
  const { prescriptions, addPrescription, deletePrescription } = usePrescriptions();

  useEffect(() => {
  requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onAddClick={() => setShowAddModal(true)} />
      
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'prescriptions' && (
          <PrescriptionList 
            prescriptions={prescriptions} 
            onDelete={deletePrescription}
          />
        )}
        
        {activeTab === 'reminders' && (
          <RemindersList prescriptions={prescriptions} />
        )}
      </main>

      {showAddModal && (
        <AddPrescriptionModal
          onClose={() => setShowAddModal(false)}
          onSave={addPrescription}
        />
      )}
    </div>
  );
}

export default App;
