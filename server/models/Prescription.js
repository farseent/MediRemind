const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    doctor: String,
    dateIssued: String,               // “2025-11-13”
    notes: String,                    // doctor’s advice text
    imagePath: String,                // optional uploaded image
    medicines: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
