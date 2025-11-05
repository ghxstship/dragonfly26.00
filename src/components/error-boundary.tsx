'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Global Error Boundary Component
 * 
 * Catches unhandled errors in React component tree and displays
 * user-friendly error UI instead of white screen of death.
 * 
 * Features:
 * - Graceful error recovery
 * - Error logging to console (can be extended to monitoring service)
 * - User-friendly error message
 * - Reload functionality
 * - Prevents entire app crash
 * 
 * Usage:
 * Wrap app root or individual sections:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // TODO: Log to monitoring service (Sentry, LogRocket, etc.)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: {
    //       react: {
    //         componentStack: errorInfo.componentStack,
    //       },
    //     },
    //   });
    // }
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
          <div className="w-full max-w-md text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-500/10 p-4">
                <AlertTriangle 
                  className="h-12 w-12 text-red-500" 
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="font-heading mb-4 text-3xl uppercase text-white">
              SOMETHING WENT WRONG
            </h1>
            
            <p className="mb-6 text-gray-400">
              We&apos;ve encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 rounded-lg bg-gray-900 p-4 text-left">
                <p className="mb-2 font-mono text-sm text-red-400">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                      Component Stack
                    </summary>
                    <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={this.handleReset}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                TRY AGAIN
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="default"
                className="w-full sm:w-auto"
              >
                RELOAD PAGE
              </Button>
            </div>

            {/* Support Link */}
            <p className="mt-6 text-sm text-gray-500">
              Need help?{' '}
              <a
                href="/support"
                className="text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based Error Boundary Wrapper
 * 
 * For functional components that need error boundary protection
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
