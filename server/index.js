const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

dotenv.config();
const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/prescriptions", prescriptionRoutes);

app.get("/", (req, res) => {
  res.send("CareConnect Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
