// Simple test script to verify the backend API
import axios from 'axios';

const backendUrl = 'http://localhost:4000';
const productId = '687504f3f71c98ac52e39788'; // The product ID that's causing issues

async function testProductAPI() {
  try {
    console.log(`Testing API: ${backendUrl}/api/product/single with productId: ${productId}`);
    
    const response = await axios.post(
      `${backendUrl}/api/product/single`,
      { productId },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('Response status:', response.status);
    console.log('Success flag:', response.data.success);
    
    if (response.data.success) {
      console.log('Product found:', response.data.product.name);
      console.log('Product images:', response.data.product.image?.length || 0);
    } else {
      console.log('API returned error:', response.data.message);
    }
  } catch (error) {
    console.error('Error calling API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testProductAPI();
