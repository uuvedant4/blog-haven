import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const login = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <form className="login" onSubmit={login}>
      <h2>Login to your account</h2>
      <input
        onChange={handleUsernameChange}
        type="text"
        placeholder="username"
        value={username}
      />
      <input
        onChange={handlePasswordChange}
        type="password"
        placeholder="password"
        value={password}
      />
      <button>Login</button>
    </form>
  );
};

export default LoginPage;
