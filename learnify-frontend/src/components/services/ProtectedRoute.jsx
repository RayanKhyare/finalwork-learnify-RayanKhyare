import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ element: Component, ...rest }) {
  const hasJWT = () => {
    return !!localStorage.getItem("token");
  };

  return hasJWT() ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
