"use client";

import AuthContext from "@/contexts/AuthContext";
import React, { useContext, useState } from "react";

const LoginPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await authContext.authenticate(username, password);
    setUsername("");
    setPassword("");
  };

  const handleLogout = () => {
    authContext.deauthenticate();
  };

  if (authContext.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        Logged in: {authContext.authenticated ? "yes" : "no"}
        {authContext.authenticated && <button onClick={handleLogout}>Logout</button>}
      </div>
      <div>
        <label>
          Username
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
