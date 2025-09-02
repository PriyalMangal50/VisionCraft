// Test script for quiz analytics
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test the analytics endpoint
async function testQuizAnalytics() {
  try {
    console.log('\n=== Testing Quiz Analytics API ===');
    
    // Get backend URL from environment or use default
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    console.log(`Using backend URL: ${backendUrl}`);
    
    // Test token - this should be a valid admin token
    // For testing, you can use the token from local storage if you have one
    let adminToken = "YOUR_ADMIN_TOKEN_HERE";
    
    // Try to use token from command line arguments
    if (process.argv.length > 2) {
      adminToken = process.argv[2];
      console.log(`Using admin token from command line: ${adminToken.substring(0, 5)}...`);
    }
    
    console.log('Making request to /api/quiz/analytics...');
    
    const response = await fetch(`${backendUrl}/api/quiz/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'token': adminToken,
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Error details:', errorJson);
      } catch (e) {
        console.error('Error response:', errorText);
      }
      return;
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n=== Analytics Summary ===');
      console.log(`Total Quizzes: ${data.analytics.totalQuizzes}`);
      console.log(`Clicked Quizzes: ${data.analytics.clickedQuizzes}`);
      console.log(`Purchased Quizzes: ${data.analytics.purchasedQuizzes}`);
      console.log(`Click-through Rate: ${data.analytics.clickThroughRate.toFixed(2)}%`);
      console.log(`Conversion Rate: ${data.analytics.conversionRate.toFixed(2)}%`);
    } else {
      console.error('Analytics request failed:', data.message || 'Unknown error');
    }
    
    // Also try the debug endpoint (no authentication required)
    console.log('\n=== Testing Debug Analytics API ===');
    
    const debugResponse = await fetch(`${backendUrl}/api/quiz/debug-analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const debugData = await debugResponse.json();
    console.log('Debug response:', JSON.stringify(debugData, null, 2));
    
  } catch (error) {
    console.error('Error testing analytics:', error);
  }
}

// Run the tests
testQuizAnalytics();
