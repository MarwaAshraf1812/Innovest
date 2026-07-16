import React from 'react'
import { AlertOctagon, RefreshCw } from 'lucide-react'
import Button from '../ui/Button'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 space-y-6 shadow-sm">
            
            {/* Warning Icon */}
            <div className="h-16 w-16 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-600 shadow-sm animate-bounce">
              <AlertOctagon className="h-8 w-8" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-900 leading-tight">Something Went Wrong</h1>
              <p className="text-slate-400 text-xs leading-relaxed">
                An unexpected interface error occurred. Please restart the workspace or contact the system administrator.
              </p>
              {this.state.error && (
                <pre className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-rose-600 text-left overflow-x-auto whitespace-pre-wrap max-h-32 font-mono">
                  {this.state.error.toString()}
                </pre>
              )}
            </div>

            {/* Reset Button */}
            <Button 
              variant="primary" 
              className="w-full flex items-center justify-center gap-2 font-bold py-2.5"
              onClick={this.handleReset}
            >
              <RefreshCw className="h-4 w-4" />
              Reload Application
            </Button>

          </div>
        </div>
      )
    }

    return this.props.children
  }
}
