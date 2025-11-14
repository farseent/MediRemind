const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true },
    dosage: String,
    frequency: String,
    duration: String,
    startDate: String, // using string because frontend also sends string
    instructions: String,
    reminders: [String],  // ["08:00", "20:00"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
