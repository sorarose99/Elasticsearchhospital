import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/migrateLocalStorage"; // Auto-migrate old Supabase data

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('🔴 Unhandled Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    timestamp: new Date().toISOString()
  });
  
  // Prevent default browser error handling for better UX
  if (event.error?.message?.includes('Cannot read properties of undefined')) {
    console.error('💡 Hint: This is likely a missing null/undefined check on an array or object');
  }
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 Unhandled Promise Rejection:', {
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date().toISOString()
  });
});

createRoot(document.getElementById("root")!).render(<App />);
