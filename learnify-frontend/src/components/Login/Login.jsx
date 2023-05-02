import React, { useState } from "react";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.login({ email, password });
      localStorage.setItem("token", response.data);
      // redirect to protected route
      console.log(response.data);
      console.log(response);
      setTimeout(() => {
        navigate("/main");
      }, 100);
    } catch (error) {
      console.error(error);
      // display error message
      setError(error.response.data);
    }
  };

  const handleRedirect = (e) => {
    navigate("/register");
  };

  return (
    <div className="login">
      <div className="login-left">
        <h2 className="login-title">Welkom terug </h2>
        <form class="login-form" onSubmit={handleSubmit}>
          {error && <div>{error}</div>}

          <input
            type="email"
            className="email"
            value={email}
            placeholder="Voer uw e-mail in"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="password"
            value={password}
            placeholder="Voer uw wachtwoord in"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit">
            Aanmelden
          </button>
        </form>
        <p className="geenaccount">
          Heb je geen account?{" "}
          <span className="aanmelden" onClick={handleRedirect}>
            Inschrijven
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
