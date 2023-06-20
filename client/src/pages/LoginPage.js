import React from "react";

const LoginPage = () => {
  return (
    <form className="login">
      <h2>Login to your account</h2>
      <input type="text" placeholder="username" />
      <input type="password" placeholder="password" />
      <button>Login</button>
    </form>
  );
};

export default LoginPage;
