import React, { useEffect, useState } from "react";
import Post from "../Post";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/post").then((response) => {
      response.json().then((posts) => setPosts(posts));
    });
  }, []);

  return (
    <>
      {posts.length > 0 && posts.map((post, id) => <Post key={id} {...post} />)}
    </>
  );
};

export default IndexPage;
