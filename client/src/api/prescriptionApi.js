import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
});

// Create prescription + medicines
export const createPrescription = async (data) => {
  const res = await API.post("/prescriptions", data);
  return res.data;
};

// Fetch all prescriptions
export const fetchPrescriptions = async () => {
  const res = await API.get("/prescriptions");
  return res.data;
};

// Delete prescription (auto deletes medicines)
export const deletePrescriptionApi = async (id) => {
  const res = await API.delete(`/prescriptions/${id}`);
  return res.data;
};


// --- UPDATE ---
export const updatePrescriptionApi = async (id, updatedData) => {
  const res = await API.put(`/prescriptions/${id}`, updatedData);
  return res.data;
};