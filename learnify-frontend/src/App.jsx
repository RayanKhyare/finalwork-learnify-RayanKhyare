import "./App.scss";
import React, { useContext, useEffect } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header/Header";
import Landing from "./components/Landing/Landing";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import AddStream from "./components/AddStream/AddStream";

import ProtectedRoute from "./components/services/ProtectedRoute";
import IfLoggedRoute from "./components/services/IfLoggedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<IfLoggedRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/register" element={<IfLoggedRoute />}>
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/main" element={<ProtectedRoute />}>
            <Route path="/main" element={<Main />} />
          </Route>
          <Route path="/startstream" element={<ProtectedRoute />}>
            <Route path="/startstream" element={<AddStream />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
