import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import AuthProvider from './contexts/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)