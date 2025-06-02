"use client";

import AuthContext from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

const LoginPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin: React.FormEventHandler = async (event) => {
    event.preventDefault();
    const result = await authContext.authenticate(username, password);
    setUsername("");
    setPassword("");
    if (result) {
      router.push("/");
    }
  };

  if (authContext.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
