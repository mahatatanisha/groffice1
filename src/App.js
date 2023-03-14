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
import Home from './components/Home';
import Documents from './components/Documents';
import Notifications from './components/Notifications';
import DataAnalysis from './components/DataAnalysis';
import ChartSlider from './components/ChartSlider';


function App() {


  return (
    <div className="app min-h-screen bg-gray-50">
      <Router>
        <UserAuthContextProvider>
          <Routes>
            <Route
              path="/home"
              element={
                <Home />

              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<MainChat />} />
            <Route path="/home" element={<Home />} />
            <Route path="/documents" element={<Documents/>}/>
            {/* <Route path="/notifications" element={<Notifications/>}/> */}
            {/* <Route path="/analysis" element={<DataAnalysis/>}/> */}
            <Route path="/analysis" element={<ChartSlider/>}/>
          
            

          </Routes>
        </UserAuthContextProvider>

      </Router>

    </div>



  );
}

export default App;
