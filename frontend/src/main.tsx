import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./app/Router";
import "./styles/globals.css";
import { ThemeProvider } from "./theme/ThemeContext";
import { AuthProvider } from "./features/auth/AuthContext";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Toaster position="top-right" reverseOrder={false} />
      <Router />
    </ThemeProvider>
  </AuthProvider>
);

