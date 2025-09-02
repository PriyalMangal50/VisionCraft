@echo off
echo Running API Connection Test Script
cd backend
echo Setting environment variables for testing...
set BACKEND_URL=http://localhost:4000
set ADMIN_PASSWORD=admin123
echo Installing required package...
npm install node-fetch --no-save
echo Running the test script...
node test-quiz-api.js
pause