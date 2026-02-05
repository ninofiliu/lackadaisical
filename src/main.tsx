import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./main.css";
import { x } from "./utils";

// Register service worker for caching baseline videos
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

createRoot(x(document.getElementById("root"))).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
