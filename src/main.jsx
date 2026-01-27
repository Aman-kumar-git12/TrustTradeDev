import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { UIProvider } from './context/UIContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { MarketplaceProvider } from './context/MarketplaceContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <UIProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <MarketplaceProvider>
                            <App />
                        </MarketplaceProvider>
                    </ThemeProvider>
                </AuthProvider>
            </UIProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
