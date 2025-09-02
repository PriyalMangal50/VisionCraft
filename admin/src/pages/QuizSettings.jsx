import React, { useState, useEffect } from 'react';
import { backendUrl } from '../App';

const QuizSettings = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // First test the connection to the quiz API endpoint
    testQuizEndpoint().then(() => {
      fetchAnalytics();
    });
  }, []);

  // Test function to check if quiz API is accessible
  const testQuizEndpoint = async () => {
    try {
      // Log environment information for debugging
      console.log(`Backend URL: ${backendUrl}`);
      console.log(`Token available: ${token ? 'Yes' : 'No'}`);
      
      // First test the base API to ensure connectivity
      console.log(`Testing base API endpoint: ${backendUrl}/api-test`);
      try {
        const baseResponse = await fetch(`${backendUrl}/api-test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (baseResponse.ok) {
          const baseData = await baseResponse.json();
          console.log("Base API test result:", baseData);
        } else {
          console.error(`Base API test failed: ${baseResponse.status}`);
        }
      } catch (baseError) {
        console.error("Base API test error:", baseError);
      }
      
      console.log(`Testing quiz endpoint: ${backendUrl}/api/quiz/test`);
      
      // Using full options for fetch to ensure correct CORS handling
      const testResponse = await fetch(`${backendUrl}/api/quiz/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'token': token
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error(`Quiz API test failed - Status: ${testResponse.status}, Response:`, errorText);
        throw new Error(`Quiz API test failed: ${testResponse.status}`);
      }
      
      const testData = await testResponse.json();
      console.log("Quiz API test result:", testData);
      
      // Also test the auth endpoint
      try {
        console.log(`Testing auth endpoint: ${backendUrl}/api/quiz/check-auth`);
        const authResponse = await fetch(`${backendUrl}/api/quiz/check-auth`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'token': token
          },
          mode: 'cors',
          cache: 'no-cache',
        });
        
        const authData = await authResponse.json();
        console.log("Auth test result:", authData);
        
        if (!authResponse.ok) {
          console.warn("Authentication test failed, analytics may not work");
        }
      } catch (authError) {
        console.warn("Auth test error:", authError);
      }
      
      // Also check the analytics URL directly
      console.log(`Would fetch analytics from: ${backendUrl}/api/quiz/analytics`);
      
      return true;
    } catch (error) {
      console.error("Quiz API test error:", error);
      return false;
    }
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      
      let analyticsUrl = `${backendUrl}/api/quiz/analytics?${params.toString()}`;
      console.log(`Attempting to fetch analytics from: ${analyticsUrl}`);
      console.log(`Using token:`, token ? `${token.substring(0, 5)}...` : 'No token');
      
      // Try both the normal endpoint and the debug endpoint
      const endpoints = [
        { url: `${backendUrl}/api/quiz/analytics`, auth: true },
        { url: `${backendUrl}/api/quiz/debug-analytics`, auth: false }
      ];
      
      let response = null;
      let successfulEndpoint = null;
      
      // Try each endpoint until one succeeds
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint.url}`);
          
          const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          };
          
          // Only add auth headers if this endpoint requires them
          if (endpoint.auth && token) {
            headers.token = token;
            headers.Authorization = `Bearer ${token}`;
          }
          
          const tempResponse = await fetch(endpoint.url, {
            method: 'GET',
            headers,
            mode: 'cors',
            cache: 'no-cache'
          });
          
          console.log(`${endpoint.url} response status: ${tempResponse.status}`);
          
          if (tempResponse.ok) {
            response = tempResponse;
            successfulEndpoint = endpoint.url;
            console.log(`Successfully connected to ${successfulEndpoint}`);
            break;
          }
        } catch (endpointError) {
          console.error(`Error trying ${endpoint.url}:`, endpointError);
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`All endpoints failed. Could not retrieve analytics data.`);
      }
      
      console.log(`Using data from endpoint: ${successfulEndpoint}`);
      
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          try {
            // Try to parse as JSON
            const errorJson = JSON.parse(errorText);
            errorDetails = errorJson.message || errorText;
          } catch (e) {
            // Use as text if not JSON
            errorDetails = errorText;
          }
        } catch (e) {
          errorDetails = 'Could not read error details';
        }
        
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
      }
      
      const data = await response.json();
      console.log('Analytics response:', data);
      
      if (data.success) {
        setAnalytics(data.analytics);
        console.log('Analytics loaded successfully');
      } else {
        console.error('API returned failure:', data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      // Provide more detailed error information
      let errorMessage = error.message;
      
      // Check for specific error types to provide better user feedback
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Network error: The backend server might be unreachable. Please check if the server is running at ${backendUrl}.`;
      } else if (error.message.includes('404')) {
        errorMessage = `Endpoint not found (404): The analytics endpoint may not exist or is misconfigured. URL: ${backendUrl}/api/quiz/analytics`;
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = `Authentication error: Your admin token might be invalid or expired. Please try logging out and back in.`;
      }
      
      console.error(`Failed to load quiz analytics: ${errorMessage}`);
      setAnalytics(null); // Ensure no stale or demo data is displayed
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAnalytics();
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Frame Finder Quiz Analytics</h1>
      
      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Date Range Filter</h2>
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div className="flex items-end">
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Apply Filter'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Analytics Overview */}
      {analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Quizzes</h3>
            <p className="text-3xl font-bold">{analytics.totalQuizzes}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Click-through Rate</h3>
            <p className="text-3xl font-bold">{(analytics.clickThroughRate || 0).toFixed(1)}%</p>
            <p className="text-sm text-gray-500">{analytics.clickedQuizzes} clicks</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="text-3xl font-bold">{(analytics.conversionRate || 0).toFixed(1)}%</p>
            <p className="text-sm text-gray-500">{analytics.purchasedQuizzes} purchases</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Most Popular Face Shape</h3>
            <p className="text-3xl font-bold capitalize">
              {analytics.faceShapeDistribution[0]?._id || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              {analytics.faceShapeDistribution[0]?.count || 0} selections
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center my-8">
          {isLoading ? (
            <p className="text-gray-500">Loading analytics...</p>
          ) : (
            <p className="text-gray-500">No analytics data available</p>
          )}
        </div>
      )}
      
      {/* Detailed Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Face Shape Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Face Shape Distribution</h2>
            <div className="space-y-3">
              {analytics.faceShapeDistribution.map(item => (
                <div key={item._id || 'unknown'} className="flex items-center">
                  <div className="w-32 capitalize">{item._id || 'Unknown'}</div>
                  <div className="flex-grow">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-blue-600 h-4 rounded-full" 
                        style={{ width: `${(item.count / analytics.totalQuizzes) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Frame Style Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Frame Style Distribution</h2>
            <div className="space-y-3">
              {analytics.frameStyleDistribution.map(item => (
                <div key={item._id || 'unknown'} className="flex items-center">
                  <div className="w-32">{item._id || 'Unknown'}</div>
                  <div className="flex-grow">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-green-600 h-4 rounded-full" 
                        style={{ width: `${(item.count / analytics.totalQuizzes) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Usage Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Usage Distribution</h2>
            <div className="space-y-3">
              {analytics.usageDistribution.map(item => (
                <div key={item._id || 'unknown'} className="flex items-center">
                  <div className="w-32 capitalize">{item._id || 'Unknown'}</div>
                  <div className="flex-grow">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-purple-600 h-4 rounded-full" 
                        style={{ width: `${(item.count / analytics.totalQuizzes) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Feature Distribution</h2>
            <div className="space-y-3">
              {analytics.featureDistribution.map(item => (
                <div key={item._id || 'unknown'} className="flex items-center">
                  <div className="w-32">{item._id || 'Unknown'}</div>
                  <div className="flex-grow">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-orange-600 h-4 rounded-full" 
                        style={{ width: `${(item.count / analytics.totalQuizzes) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSettings;
