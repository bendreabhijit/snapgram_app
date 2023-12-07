import React from "react";
import ReactDOM from "react-dom/client"
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { QueryProvider } from "./lib/react-query/queryProvider";



ReactDOM.createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
   <QueryProvider>
   <AuthProvider>
      <App/>  
      
      </AuthProvider>
   </QueryProvider>
   
   
   </BrowserRouter>
    
)