import { useEffect, useState, useRef } from "react";
import {
  createPrescription,
  fetchPrescriptions,
  deletePrescriptionApi,
} from "../api/prescriptionApi";
import { scheduleReminder } from "../utils/scheduleReminder";

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // NEW → Track which reminders have already been scheduled
  const scheduledReminders = useRef(new Set());

  // Load all prescriptions initially
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchPrescriptions();
        setPrescriptions(data);
      } catch (err) {
        console.error("Failed to fetch prescriptions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // NEW → Prevent duplicate scheduling
  useEffect(() => {
    prescriptions.forEach((p) => {
      if (!p.medicines) return;

      p.medicines.forEach((m) => {
        (m.reminders || []).forEach((time) => {
          const key = `${m._id}-${time}`;

          // Skip if already scheduled
          if (scheduledReminders.current.has(key)) return;

          // Schedule once
          scheduleReminder(m, time);

          // Mark as scheduled
          scheduledReminders.current.add(key);
        });
      });
    });
  }, [prescriptions]);

  // Create prescription
  const addPrescription = async (payload) => {
    try {
      const saved = await createPrescription(payload);

      // Append newly created prescription to UI
      setPrescriptions((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Failed to save prescription:", err);
    }
  };

  // Delete prescription
  const deletePrescription = async (id) => {
    try {
      await deletePrescriptionApi(id);

      // Remove from state
      setPrescriptions((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return {
    prescriptions,
    loading,
    addPrescription,
    deletePrescription,
  };
}


/*
  const updatePrescription = async (id, updatedData) => {
    try {
      const updated = await updatePrescriptionApi(id, updatedData);
      setPrescriptions((prev) =>
        prev.map((p) => (p._id === id ? updated : p))
      );
    } catch (err) {
      console.error("Failed to update prescription:", err);
    }
  };
*/ 