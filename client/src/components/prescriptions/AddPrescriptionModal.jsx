import React, { useState } from "react";
import { Camera, FileText, Upload, Loader2, Trash2, Plus } from "lucide-react";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { usePrescriptions } from "../../hooks/usePrescriptions";

export default function AddPrescriptionModal({ onClose }) {
  const { addPrescription } = usePrescriptions();
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW — store detected doctor
  const [doctorName, setDoctorName] = useState("Unknown");

  const [formList, setFormList] = useState([
    {
      medicineName: "",
      dosage: "",
      frequency: "Once daily",
      duration: "",
      startDate: new Date().toISOString().split("T")[0],
      instructions: "",
      reminderTimes: ["08:00"],
    },
  ]);

  const addNewMedicine = () => {
    setFormList((prev) => [
      ...prev,
      {
        medicineName: "",
        dosage: "",
        frequency: "Once daily",
        duration: "",
        startDate: new Date().toISOString().split("T")[0],
        instructions: "",
        reminderTimes: ["08:00"],
      },
    ]);
  };

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  // 🔥 UPDATED: Extract doctor + medicines
  const parseWithGemini = async (rawText) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const schema = {
      type: "object",
      properties: {
        doctor: { type: "string" },
        medicines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              medicineName: { type: "string" },
              dosage: { type: "string" },
              frequency: { type: "string" },
              duration: { type: "string" },
              instructions: { type: "string" },
            },
            required: ["medicineName", "dosage", "frequency", "duration"],
          },
        },
      },
      required: ["doctor", "medicines"],
    };

    const prompt = `
      Extract DOCTOR NAME and MEDICINES from this prescription.
      Return JSON ONLY exactly like this:

      {
        "doctor": "",
        "medicines": [
          {
            "medicineName": "",
            "dosage": "",
            "frequency": "",
            "duration": "",
            "instructions": ""
          }
        ]
      }

      Prescription:
      """${rawText}"""
    `;

    const result = await model.generateContent(prompt, {
      responseMimeType: "application/json",
      responseSchema: schema,
    });

    const response = result.response.text();
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("Invalid JSON format");

    return JSON.parse(jsonMatch[0]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng");

      const parsed = await parseWithGemini(text);

      // SET DOCTOR NAME
      setDoctorName(parsed.doctor || "Unknown");

      const getReminderTimes = (freq = "") => {
        const t = freq.toLowerCase();
        if (t.includes("morning") && t.includes("night")) return ["08:00", "20:00"];
        if (t.includes("twice")) return ["08:00", "20:00"];
        if (t.includes("night")) return ["20:00"];
        if (t.includes("morning")) return ["08:00"];
        return ["08:00"];
      };

      // SET MEDICINES
      const formatted = parsed.medicines.map((item) => ({
        ...item,
        startDate: new Date().toISOString().split("T")[0],
        reminderTimes: getReminderTimes(item.frequency || ""),
      }));

      setFormList(formatted);
      alert("Prescription analyzed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze prescription.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, e) => {
    const updated = [...formList];
    updated[index][e.target.name] = e.target.value;
    setFormList(updated);
  };

  const addReminderTime = (index) => {
    const updated = [...formList];
    updated[index].reminderTimes.push("12:00");
    setFormList(updated);
  };

  const updateReminderTime = (index, timeIndex, value) => {
    const updated = [...formList];
    updated[index].reminderTimes[timeIndex] = value;
    setFormList(updated);
  };

  const removeReminderTime = (index, timeIndex) => {
    const updated = [...formList];
    updated[index].reminderTimes = updated[index].reminderTimes.filter((_, i) => i !== timeIndex);
    setFormList(updated);
  };

  // 🔥 UPDATED: include doctorName instead of "Unknown"
  const handleSubmit = async () => {
    const incomplete = formList.some(
      (f) => !f.medicineName || !f.dosage || !f.duration || !f.startDate
    );
    if (incomplete) {
      alert("Fill all required fields");
      return;
    }

    const payload = {
      doctor: doctorName || "Unknown",
      dateIssued: new Date().toISOString().split("T")[0],
      notes: "",
      medicines: formList.map((f) => ({
        medicineName: f.medicineName,
        dosage: f.dosage,
        frequency: f.frequency,
        duration: f.duration,
        startDate: f.startDate,
        instructions: f.instructions,
        reminders: f.reminderTimes,
      })),
    };

    await addPrescription(payload);

    alert("Prescription saved!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Add New Prescription</h2>
          <p className="text-gray-500">Choose how you want to add it</p>
        </div>

        <div className="p-6 space-y-6">

          {!mode && (
            <div className="flex gap-4">
              <button onClick={() => setMode("image")} className="flex-1 px-6 py-4 border-2 border-blue-300 rounded-xl">
                <Camera className="w-5 h-5" /> Scan Prescription
              </button>

              <button onClick={() => setMode("manual")} className="flex-1 px-6 py-4 border rounded-xl">
                <FileText className="w-5 h-5" /> Manual Input
              </button>
            </div>
          )}

          {doctorName !== "Unknown" && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-700">
                Detected Doctor: {doctorName}
              </p>
            </div>
          )}

          {mode === "image" && (
            <div className="text-center space-y-3">
              <label className="cursor-pointer flex flex-col items-center border-2 border-dashed border-blue-300 rounded-xl p-6">
                <Upload className="w-6 h-6 text-blue-500 mb-2" />
                Upload Prescription Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>

              {loading && (
                <div className="flex justify-center gap-2 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                </div>
              )}
            </div>
          )}

          {(mode === "manual" || formList[0].medicineName) && (
            <>
              {formList.map((formData, index) => (
                <div key={index} className="border rounded-xl p-4 bg-gray-50 space-y-4">

                  <h3 className="text-lg font-semibold">Medicine {index + 1}</h3>

                  <input
                    type="text"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Medicine Name"
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Dosage"
                      className="px-4 py-3 border rounded-lg"
                    />

                    <input
                      type="text"
                      name="frequency"
                      value={formData.frequency}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Frequency"
                      className="px-4 py-3 border rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Duration"
                      className="px-4 py-3 border rounded-lg"
                    />

                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange(index, e)}
                      className="px-4 py-3 border rounded-lg"
                    />
                  </div>

                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Instructions"
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Reminder Times
                    </label>

                    {formData.reminderTimes.map((time, timeIndex) => (
                      <div key={timeIndex} className="flex gap-2 mb-2">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) =>
                            updateReminderTime(index, timeIndex, e.target.value)
                          }
                          className="flex-1 px-4 py-3 border rounded-lg"
                        />

                        {formData.reminderTimes.length > 1 && (
                          <button
                            onClick={() => removeReminderTime(index, timeIndex)}
                            className="p-2 text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => addReminderTime(index)}
                      className="text-blue-600 text-sm font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add another time
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addNewMedicine}
                className="flex items-center gap-2 px-4 py-2 mt-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-5 h-5" /> Add Another Medicine
              </button>
            </>
          )}

          <div className="flex gap-3 pt-6">
            <button onClick={onClose} className="flex-1 px-6 py-3 border rounded-lg">
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Processing..." : "Save Prescription"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
