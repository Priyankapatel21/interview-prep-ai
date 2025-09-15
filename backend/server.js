require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes")
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");


const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "*"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

connectDB();

// Middleware
app.use(express.json());

// Temporary test route for debugging AI errors
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);


// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname,"uploads"), {}));

// Start Server 
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 