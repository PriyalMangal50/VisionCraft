import fetch from 'node-fetch';
import 'dotenv/config';

// Helper function to make API requests
async function testEndpoint(url, method = 'GET', token = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.token = token;
    }
    
    console.log(`Testing ${method} ${url}`);
    console.log('Headers:', headers);
    
    const response = await fetch(url, {
      method,
      headers
    });
    
    const status = response.status;
    let data;
    
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }
    
    return {
      url,
      method,
      status,
      data,
      success: response.ok
    };
  } catch (error) {
    console.error(`Error testing ${url}:`, error.message);
    return {
      url,
      method,
      status: 'ERROR',
      data: error.message,
      success: false
    };
  }
}

async function runTests() {
  // Define variables
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';
  // Use the actual admin token or a test token
  const adminToken = process.env.ADMIN_PASSWORD || 'admin-test-token';
  
  console.log('Starting API tests...');
  console.log(`Base URL: ${baseUrl}`);
  
  // Test endpoints
  const tests = [
    await testEndpoint(`${baseUrl}/`, 'GET'),
    await testEndpoint(`${baseUrl}/api/quiz/test`, 'GET'),
    await testEndpoint(`${baseUrl}/api/quiz/analytics`, 'GET', adminToken),
    await testEndpoint(`${baseUrl}/api/quiz/check-auth`, 'GET', adminToken)
  ];
  
  // Print results
  console.log('\n=== Test Results ===');
  tests.forEach((result, index) => {
    console.log(`\nTest #${index + 1}: ${result.method} ${result.url}`);
    console.log(`Status: ${result.status}`);
    console.log(`Success: ${result.success}`);
    console.log('Response:', result.data);
  });
}

// Run the tests
runTests().catch(err => {
  console.error('Test script error:', err);
});
