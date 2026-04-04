import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./app/Router";
import "./styles/globals.css";
import { ThemeProvider } from "./theme/ThemeContext";
import { AuthProvider } from "./features/auth/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

// Validate the Google Client ID — reject placeholder values
const rawClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
const isValidClientId =
  rawClientId.endsWith(".apps.googleusercontent.com") &&
  !rawClientId.toLowerCase().includes("your_google") &&
  !rawClientId.toLowerCase().includes("placeholder") &&
  rawClientId.length > 30;

// Export for use in login components
export const GOOGLE_CLIENT_ID = isValidClientId ? rawClientId : "";

const App = () => (
  <AuthProvider>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1e293b',
            borderRadius: '14px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Router />
    </ThemeProvider>
  </AuthProvider>
);

// If Google Client ID is valid, wrap with GoogleOAuthProvider.
// Otherwise, render without it — GoogleLogin buttons will show a disabled fallback.
ReactDOM.createRoot(document.getElementById("root")!).render(
  isValidClientId ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  ) : (
    <App />
  )
);


