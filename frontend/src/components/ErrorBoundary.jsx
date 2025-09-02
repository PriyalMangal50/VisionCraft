import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Basic logging; in dev you'll also see the overlay
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="text-center max-w-md p-8 rounded-lg bg-white shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We couldn't load this product right now. Please try again or go back.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.history.back()} className="bg-primary-700 text-white py-2 px-5 rounded-md hover:bg-primary-800 transition-colors">Go Back</button>
              <button onClick={() => window.location.reload()} className="bg-gray-200 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-300 transition-colors">Reload</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
