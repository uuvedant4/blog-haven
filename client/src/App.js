import "./App.css";
import Post from "./Post";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <>
              <Post />
              <Post />
              <Post />
              <Post />
            </>
          }
        />
        <Route path="/login" element={<div>Login</div>} />
      </Route>
    </Routes>
  );
}

export default App;
