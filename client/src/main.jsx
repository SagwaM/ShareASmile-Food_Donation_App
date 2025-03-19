import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css" // Import Bootstrap styles
import { ThemeProviderWrapper } from "@/context/ThemeContext"; // Import ThemeProvider
import { AuthProvider } from "@/context/AuthContext"; // ✅ Import AuthProvider

createRoot(document.getElementById('root')).render(
  
    <AuthProvider> {/* ✅ Wrap entire app in AuthProvider */}
      <ThemeProviderWrapper>
        <App />
      </ThemeProviderWrapper>
    </AuthProvider>
 
)
