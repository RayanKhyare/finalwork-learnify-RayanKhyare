import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import apiService from "../services/apiService";

export default function Main() {
  const [role, setRole] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiService.getRoles();
        console.log(response.data);
        setRole(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [location]);

  return (
    <div>
      <h1>Main</h1>
      <ul>
        {role.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
