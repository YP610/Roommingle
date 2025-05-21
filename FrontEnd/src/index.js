import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from "./pages/login";
import SignUp from "./pages/signup";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Login/>
      <SignUp/>
    </BrowserRouter>
   
  </React.StrictMode>
);


