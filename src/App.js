import React from 'react';
import './App.css';
import Login from './components/Login';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import MainChat from './components/MainChat';
import Signup from './components/Signup';


function App() {


  return (
    <div className="app">
      <Router>
        <UserAuthContextProvider>
          <Routes>
            <Route
              path="/main-chat"
              element={
                <MainChat />

              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </UserAuthContextProvider>

      </Router>

    </div>



  );
}

export default App;
