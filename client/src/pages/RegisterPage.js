import React from "react";

const RegisterPage = () => {
  return (
    <form className="register">
      <h2>Create an account</h2>
      <input type="text" placeholder="username" />
      <input type="password" placeholder="password" />
      <button>Register</button>
    </form>
  );
};

export default RegisterPage;
