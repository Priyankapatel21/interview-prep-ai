require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

// Connect to Database
connectDB();

// CORS Configuration - Updated with your frontend URL
const corsOptions = {
    origin: [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://127.0.0.1:3000", 
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:5174",
        "https://interview-prep-frontend-g8fd.onrender.com", // Your frontend URL
        process.env.CORS_ORIGIN // Additional environment variable if needed
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ROOT ROUTE - Fixes "Cannot GET /" error
app.get("/", (req, res) => {
    res.json({
        message: "Interview Prep AI Backend API",
        status: "running",
        version: "1.0.0",
        frontend: "https://interview-prep-frontend-g8fd.onrender.com",
        endpoints: {
            auth: "/api/auth",
            sessions: "/api/sessions", 
            questions: "/api/questions",
            ai: "/api/ai"
        },
        timestamp: new Date().toISOString()
    });
});

// Health check route
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        database: "connected",
        server: "running",
        timestamp: new Date().toISOString()
    });
});

// Test route for AI debugging
app.get("/api/test-ai", (req, res) => {
    console.log("--- TRIGGERING AI TEST ROUTE ---");
    const mockReq = {
        body: {
            role: "Software Engineer",
            experience: "5",
            topicsToFocus: "React, Node.js",
            numberOfQuestions: 2
        }
    };
    const mockRes = {
        status: (code) => ({
            json: (data) => {
                console.log(`--- AI TEST ROUTE RESPONSE [${code}] ---`, data);
                res.status(code).json(data);
            }
        })
    };
    generateInterviewQuestions(mockReq, mockRes);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// AI Routes
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// REMOVED: Frontend serving code (not needed for separate deployments)
// Your frontend is deployed separately as a static site

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Something went wrong!",
        status: "error",
        error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.stack,
        timestamp: new Date().toISOString()
    });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: https://interview-prep-frontend-g8fd.onrender.com`);
    console.log(`📡 CORS Origins:`, corsOptions.origin);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
});