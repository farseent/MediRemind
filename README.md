
# 💊 MediRemind – Smart Prescription & Medication Reminder App  
AI-powered medical assistant built using the MERN stack.

MediRemind helps users scan prescriptions, extract medicines using AI, organize doses, and receive medication reminders with notifications and alarm sounds.

---

## 🚀 Features

### 🔍 AI Prescription Scanning  
Automatically extract:
- Doctor name  
- Medicines  
- Dosage  
- Duration  
- Frequency  
- Instructions  

Uses **Google Gemini AI** and optional **Google Document AI** for handwritten prescriptions.

---

### 🧠 Smart AI Parsing  
Gemini converts extracted text into structured JSON:
```json
{
  "doctor": "Dr. Example",
  "medicines": [
    {
      "medicineName": "Paracetamol",
      "dosage": "1",
      "frequency": "Morning, Night",
      "duration": "5 Days",
      "instructions": "After food"
    }
  ]
}
````

---

### ⏰ Medication Reminder System

The reminder engine supports:

* Browser notifications
* Alarm sound alerts
* Auto-rescheduling daily
* “Mark Taken” UI
* Multiple reminder times per medicine

Works even if the app is not open.

---

### 💾 Prescription Management

* Add prescriptions manually
* AI auto-fill mode
* Multiple medicines per prescription
* Expand/Collapse card view
* Delete prescription
* Daily reminders dashboard

---

## 🛠 Tech Stack

### **Frontend**

* React.js
* Tailwind CSS
* Lucide Icons
* Google Gemini AI
* Tesseract.js (optional)
* Browser Notifications + Audio API

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* Google Document AI (optional)

---

## 📁 Project Structure

```
careconnect/
 ├── client/
 │   ├── src/
 │   │   ├── components/
 │   │   ├── hooks/
 │   │   └── utils/
 │   └── public/
 │
 ├── server/
 │   ├── config/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   └── utils/
 │
 └── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/MediRemind.git
cd MediRemind
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

## 🔧 Environment Variables

### Frontend **client/.env**

```
REACT_APP_GEMINI_API_KEY=your_gemini_key_here
```

### Backend **server/.env**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 🧾 Optional: Document AI Setup

To use Google Document AI Handwriting OCR:

1. Create a Google Cloud Project
2. Enable **Document AI API**
3. Create a **Handwriting OCR Processor**
4. Create a **Service Account**
5. Download JSON key → place in:

   ```
   server/config/document-ai.json
   ```
6. Install SDK:

   ```bash
   npm install @google-cloud/documentai
   ```

Backend calling endpoint:

```
POST /api/ocr
```

---

## 🎵 Reminder Alarm Audio

Add your alarm sound in:

```
client/public/alarm.mp3
```

The reminder system automatically plays it when a reminder triggers.

---

## ▶️ Run the App

### Start backend:

```bash
cd server
npm start
```

### Start frontend:

```bash
cd client
npm start
```

Frontend will run at:
👉 [http://localhost:3000](http://localhost:3000)

Backend at:
👉 [http://localhost:5000](http://localhost:5000)


## 🤝 Contributing

Pull requests and feature suggestions are welcome.
Open an issue for bugs or improvements.

---

## 📜 License

MIT License

---

## 👤 Author

**Farseen T**
Developed as part of a MERN learning journey and real-world health-tech prototype.

```


Just tell me!
```
