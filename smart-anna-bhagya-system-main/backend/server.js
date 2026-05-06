import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import Tesseract from "tesseract.js";
import stringSimilarity from "string-similarity";

const app = express();
app.use(cors());
app.use(express.json());

// ===== FILE UPLOAD =====
const upload = multer({ dest: "uploads/" });

// ===== SIMPLE DATABASE =====
let users = [];

// ===== USER HISTORY (for recommendation) =====
let userHistory = {};

// ===== ML DATA =====
let distributionData = [120, 150, 130, 170, 160];

// ===== FRAUD TRACKING =====
let loginAttempts = {};

// ===== LOAD USERS =====
if (fs.existsSync("users.json")) {
  try {
    users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  } catch (e) {
    users = [];
  }
}

// ===== ML MODEL: RECOMMENDATION =====
function recommendItems(rationNumber) {
  const history = userHistory[rationNumber] || [];

  const itemCount = {};

  history.forEach((item) => {
    itemCount[item] = (itemCount[item] || 0) + 1;
  });

  const sortedItems = Object.keys(itemCount).sort(
    (a, b) => itemCount[b] - itemCount[a]
  );

  if (sortedItems.length === 0) {
    return ["Rice", "Wheat", "Sugar"];
  }

  return sortedItems.slice(0, 3);
}

// ===== ML MODEL: DEMAND PREDICTION =====
function predictNextDayDemand(data) {
  if (!data || data.length < 3) return 0;

  const last3 = data.slice(-3);

  const avg =
    last3.reduce((sum, val) => sum + val, 0) / last3.length;

  return Math.round(avg);
}

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ===== REGISTER =====
app.post("/api/register", upload.single("rationCard"), async (req, res) => {
  try {
    const { headName, rationNumber, password } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    // ===== OCR =====
    const result = await Tesseract.recognize(req.file.path, "eng");
    const text = result.data.text.toLowerCase();

    console.log("OCR TEXT:", text);

    // ===== MATCHING =====
    const nameScore = stringSimilarity.compareTwoStrings(
      headName.toLowerCase(),
      text
    );

    const numberMatch = text.includes(rationNumber.toLowerCase());

    // ===== FRAUD SCORE =====
    let fraudScore = 0;
    if (nameScore < 0.2) fraudScore++;
    if (!numberMatch) fraudScore++;
    if (text.length < 20) fraudScore++;

    console.log("Fraud Score:", fraudScore);

    if (fraudScore >= 2) {
      return res.status(400).json({
        message: "Fraud detected: Suspicious document",
      });
    }

    // ===== DUPLICATE CHECK =====
    const existingUser = users.find(
      (u) => u.rationNumber === rationNumber
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ===== SAVE USER =====
    users.push({ headName, rationNumber, password });

    // update ML data
    distributionData.push(Math.floor(Math.random() * 50) + 100);

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    return res.json({
      success: true,
      message: "Registration successful",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ===== LOGIN =====
app.post("/api/login", (req, res) => {
  try {
    const { rationNumber, password } = req.body;

    // Initialize fraud tracking
    if (!loginAttempts[rationNumber]) {
      loginAttempts[rationNumber] = {
        count: 0,
        lastAttempt: Date.now(),
      };
    }

    const user = users.find(
      (u) =>
        u.rationNumber === rationNumber &&
        u.password === password
    );

    // ❌ FAILED LOGIN
    if (!user) {
      loginAttempts[rationNumber].count += 1;

      if (loginAttempts[rationNumber].count >= 3) {
        return res.status(403).json({
          message: "Fraud detected: Too many failed attempts",
        });
      }

      return res.status(400).json({
        message: "Invalid ration card number or password",
      });
    }

    // ✅ SUCCESS LOGIN

    // Reset fraud count
    loginAttempts[rationNumber] = { count: 0, lastAttempt: Date.now() };
    // ===== OPTIONAL: BETTER PERSONALIZATION INPUT =====
const { item } = req.body; // coming from frontend (optional)

if (!userHistory[rationNumber]) {
  userHistory[rationNumber] = [];
}

// If frontend sends item → use it
if (item) {
  userHistory[rationNumber].push(item);
} else {
  // fallback (your existing logic)
  const items = ["Rice", "Wheat", "Sugar", "Oil"];
  const randomItem = items[Math.floor(Math.random() * items.length)];
  userHistory[rationNumber].push(randomItem);
}

    // ===== ADD USER HISTORY =====
    if (!userHistory[rationNumber]) {
      userHistory[rationNumber] = [];
    }

    const items = ["Rice", "Wheat", "Sugar", "Oil"];
    const randomItem = items[Math.floor(Math.random() * items.length)];

    userHistory[rationNumber].push(randomItem);

    return res.json({
      success: true,
      message: "Login successful",
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ===== ML API: DEMAND PREDICTION =====
app.get("/api/predict-demand", (req, res) => {
  try {
    const prediction = predictNextDayDemand(distributionData);

    res.json({
      success: true,
      prediction,
      message: "Predicted next-day demand",
    });
  } catch (err) {
    res.status(500).json({ message: "Prediction failed" });
  }
});

// ===== ML API: RECOMMENDATION =====
app.get("/api/recommend/:rationNumber", (req, res) => {
  const { rationNumber } = req.params;

  const recommendations = recommendItems(rationNumber);

  res.json({
    success: true,
    recommendedItems: recommendations,
  });
});

// ===== START SERVER =====
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});