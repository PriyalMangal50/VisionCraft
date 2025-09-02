@echo off
echo ===== Testing Quiz Submission and Analytics =====
echo Starting the backend server...
start cmd /k "npm start"

echo Waiting 10 seconds for the server to start...
timeout /t 10 /nobreak > nul

echo Running quiz submission test...
node --experimental-modules test-quiz-submission.js

echo Running quiz analytics test...
node --experimental-modules test-quiz-analytics.js %1

echo Done!
