const express = require("express");
const multer = require("multer");
const {
  createPrescription,
  uploadPrescriptionImage,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} = require("../controllers/prescriptionController");

const router = express.Router();

// FILE STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// AI-parsed JSON prescription
router.post("/", createPrescription);

// Optional: image upload for OCR
router.post("/upload-image", upload.single("image"), uploadPrescriptionImage);

// Get all prescriptions
router.get("/", getPrescriptions);

// Get one prescription (with medicines)
router.get("/:id", getPrescriptionById);

// Update prescription metadata
router.put("/:id", updatePrescription);

// Delete prescription + its medicines
router.delete("/:id", deletePrescription);

module.exports = router;
