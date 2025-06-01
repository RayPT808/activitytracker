import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./assets/css/style.css";
import "./components/ActivityForm.css";
import { UserProvider } from "./context/UserContext"; // Import the UserProvider
import { BrowserRouter } from "react-router-dom"; // Import 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
    
      <UserProvider>
        {" "}
        
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
