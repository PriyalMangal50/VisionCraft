import fetch from 'node-fetch';

// Test the real analytics endpoint to make sure it works
// This should be run from the backend directory

const token = process.env.ADMIN_PASSWORD || '12345678'; // Default admin password from .env
const baseUrl = 'http://localhost:4000';
const analyticsUrl = `${baseUrl}/api/quiz/analytics`;

async function testRealAnalytics() {
  console.log('=== Testing Real Analytics API ===');
  console.log(`URL: ${analyticsUrl}`);
  console.log(`Using token: ${token ? token.substring(0, 2) + '*'.repeat(token.length-2) : 'No token'}\n`);

  try {
    const response = await fetch(analyticsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'token': token
      }
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      console.error('Error response:', await response.text());
      console.log('\n=== RESULT: FAILED ===');
      process.exit(1);
    }

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n=== RESULT: SUCCESS ===');
      console.log(`Total quizzes: ${data.analytics.totalQuizzes}`);
      console.log(`Click-through rate: ${data.analytics.clickThroughRate}%`);
      console.log(`Conversion rate: ${data.analytics.conversionRate}%`);
      console.log(`Most popular face shape: ${data.analytics.faceShapeDistribution[0]?._id || 'N/A'}`);
    } else {
      console.log('\n=== RESULT: API RETURNED ERROR ===');
      console.error('API Error:', data.message);
      process.exit(1);
    }
  } catch (error) {
    console.log('\n=== RESULT: EXCEPTION OCCURRED ===');
    console.error('Exception:', error.message);
    process.exit(1);
  }
}

testRealAnalytics();
