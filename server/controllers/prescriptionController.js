const Medicine = require("../models/Medicine");
const Prescription = require("../models/Prescription");
const Tesseract = require("tesseract.js");
const fs = require("fs");

// ======================================
// CREATE PRESCRIPTION (AI Parsed JSON)
// ======================================
exports.createPrescription = async (req, res) => {
  try {
    const { doctor, dateIssued, notes, medicines } = req.body;

    if (!medicines || medicines.length === 0) {
      return res.status(400).json({ error: "No medicines provided" });
    }

    // Step 1: Create all medicine documents
    const savedMedicines = await Medicine.insertMany(
      medicines.map((m) => ({
        medicineName: m.medicineName,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        startDate: m.startDate,
        instructions: m.instructions || "",
        reminders: m.reminders || m.reminderTimes || [],
      }))
    );

    // Extract the IDs
    const medicineIds = savedMedicines.map((m) => m._id);

    // Step 2: Create prescription
    const newPrescription = new Prescription({
      doctor,
      dateIssued,
      notes,
      imagePath: null,
      medicines: medicineIds,
    });

    // Save prescription
    const savedPrescription = await newPrescription.save();

    // 💥 IMPORTANT: Populate it so frontend gets full data immediately
    const populatedPrescription = await Prescription.findById(savedPrescription._id)
      .populate("medicines");

    // Send only the populated prescription
    res.status(201).json(populatedPrescription);

  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ======================================
// IMAGE UPLOAD + OCR (OPTIONAL FEATURE)
// ======================================
exports.uploadPrescriptionImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No image uploaded" });

    const result = await Tesseract.recognize(req.file.path, "eng");
    const extractedText = result.data.text;

    res.status(200).json({
      message: "Image processed",
      text: extractedText,
      imagePath: req.file.path,
    });
  } catch (err) {
    res.status(500).json({ error: "OCR failed" });
  }
};

// ======================================
// FETCH ALL (Basic list of prescriptions)
// ======================================
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("medicines")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching prescriptions" });
  }
};

// ======================================
// FETCH SINGLE PRESCRIPTION
// ======================================
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate(
      "medicines"
    );

    if (!prescription)
      return res.status(404).json({ error: "Not found" });

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: "Error fetching prescription" });
  }
};

// ======================================
// UPDATE PRESCRIPTION (metadata only)
// nested medicine editing done separately
// ======================================
exports.updatePrescription = async (req, res) => {
  try {
    const updated = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating prescription" });
  }
};

// ======================================
// DELETE PRESCRIPTION + LINKED MEDICINES
// ======================================
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription)
      return res.status(404).json({ error: "Not found" });

    // delete medicines referenced
    await Medicine.deleteMany({ _id: { $in: prescription.medicines } });

    // delete image if exists
    if (prescription.imagePath && fs.existsSync(prescription.imagePath)) {
      fs.unlinkSync(prescription.imagePath);
    }

    // delete prescription
    await prescription.deleteOne();

    res.json({ message: "Prescription deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting prescription" });
  }
};
