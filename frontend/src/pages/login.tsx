import { authenticate, deauthenticate, isAuthenticated } from "@/services/backend";
import React, { useEffect, useState } from "react";

const LoginPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogin = async () => {
    const result = await authenticate({ username, password });
    setAuthenticated(result);
    setUsername("");
    setPassword("");
  };

  const handleLogout = async () => {
    deauthenticate();
    setAuthenticated(false);
  };

  return (
    <div>
      <div>
        Logged in: {authenticated ? "yes" : "no"}
        {authenticated && <button onClick={handleLogout}>Logout</button>}
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
