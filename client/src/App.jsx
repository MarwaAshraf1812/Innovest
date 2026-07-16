import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import AppRoutes from './routes'
import ErrorBoundary from './components/shared/ErrorBoundary'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
