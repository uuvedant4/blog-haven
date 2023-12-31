import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const login = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        navigate("/");
      });
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <form className="login" onSubmit={login}>
      <h2>Login to your account</h2>
      <input
        onChange={handleUsernameChange}
        type="text"
        placeholder="username"
        value={username}
        autoComplete="on"
      />
      <input
        onChange={handlePasswordChange}
        type="password"
        placeholder="password"
        value={password}
        autoComplete="on"
      />
      <button>Login</button>
    </form>
  );
};

export default LoginPage;
