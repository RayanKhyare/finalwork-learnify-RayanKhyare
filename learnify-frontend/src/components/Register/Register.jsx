import React, { useState } from "react";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.register({
        role: parseInt(role),
        username,
        email,
        password,
      });
      console.log(response.data);

      console.log(response);
      navigate("/login");
      // redirect to protected route
    } catch (error) {
      console.error(error);
      // display error message
      setError(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      <label htmlFor="role">Select your role:</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Choose a role</option>
        <option value="1">Student</option>
        <option value="2">Docent</option>
      </select>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

export default Register;
