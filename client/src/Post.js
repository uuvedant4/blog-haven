import React from "react";

const Post = () => {
  return (
    <div className="post">
      <div className="image">
        <img src="https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/12/techcrunch-website-homepage.webp" />
      </div>
      <div className="texts">
        <h2>Cristiano scores again!</h2>
        <p className="info">
          <span className="author">Vedant Yetekar</span>
          <time>2023-02-02 02:00</time>
        </p>
        <p className="summary">
          TechCrunch is a blog that provides technology and startup news, from
          the latest developments in Silicon Valley to venture capital funding.
        </p>
      </div>
    </div>
  );
};

export default Post;
