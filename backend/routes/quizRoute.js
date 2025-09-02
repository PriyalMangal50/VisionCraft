import express from "express";
import { submitQuiz, trackQuizInteraction } from "../controllers/quizController.js";
import adminAuth from "../middleware/adminAuth.js";

const quizRouter = express.Router();

// Diagnostic routes with enhanced logging
quizRouter.get('/test', (req, res) => {
  console.log("=== Quiz test route accessed ===");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Query params:", req.query);
  console.log("Remote address:", req.ip);
  
  res.json({ 
    success: true, 
    message: "Quiz API is working", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug route to check token handling with detailed logging
quizRouter.get('/check-auth', adminAuth, (req, res) => {
  console.log("=== Auth check passed successfully ===");
  console.log("User info:", req.user || 'No user info available');
  console.log("Token received:", req.headers.token ? `${req.headers.token.substring(0, 5)}...` : 'No token');
  console.log("Auth header:", req.headers.authorization ? `${req.headers.authorization.substring(0, 10)}...` : 'No auth header');
  
  res.json({ 
    success: true, 
    message: "Authentication successful",
    timestamp: new Date().toISOString(),
    tokenReceived: !!req.headers.token || !!req.headers.authorization
  });
});

// Debug analytics route has been removed

// Echo endpoint for testing
quizRouter.get('/echo', (req, res) => {
  console.log("=== Echo endpoint accessed ===");
  res.json({
    success: true,
    message: "Echo endpoint working",
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    path: req.path
  });
});

// Public routes
quizRouter.post('/submit', submitQuiz);
quizRouter.post('/track', trackQuizInteraction);

// Admin route to delete specific imports by category or batch ID
quizRouter.delete('/delete-import', adminAuth, (req, res) => {
  console.log("=== Delete import request received ===");
  console.log("Request body:", req.body);
  
  // This is a placeholder - we'll need to implement actual deletion logic
  // in the importController and call it here
  
  res.json({
    success: true,
    message: "Delete import endpoint is set up. Implementation pending.",
    timestamp: new Date().toISOString()
  });
});

// Admin analytics routes have been removed

export default quizRouter;
