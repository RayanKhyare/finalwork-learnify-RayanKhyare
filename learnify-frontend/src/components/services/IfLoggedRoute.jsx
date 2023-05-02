import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function IfLoggedRoute() {
  const hasJWT = () => {
    return localStorage.getItem("token");
  };

  return hasJWT() ? <Navigate to="/main" /> : <Outlet />;
}
