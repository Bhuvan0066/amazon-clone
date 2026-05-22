import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We've encountered an unexpected error. Our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center w-full gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              <RefreshCw size={18} />
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 text-left bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto text-xs text-red-600 dark:text-red-400 font-mono">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
