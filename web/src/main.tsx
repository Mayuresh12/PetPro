import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

console.log("----> main.tsx loaded");
console.log("----> Rendering React root");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {console.log("----> BrowserRouter mounted")}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);