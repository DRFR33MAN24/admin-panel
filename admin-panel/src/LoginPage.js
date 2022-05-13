import * as React from "react";
import { useState } from "react";
import { useLogin, useNotify, Notification } from "react-admin";

const LoginPage = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password }).catch(() => notify("Invalid email or password"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">submit</button>
    </form>
  );
};

export default LoginPage;
