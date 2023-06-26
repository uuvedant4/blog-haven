import React from "react";
import { formatISO9075 } from "date-fns";

const Post = ({ title, summary, cover, content, createdAt, author }) => {
  const coverPath = `http://localhost:5000/uploads/${cover
    .slice(8)
    .trimRight()}`;
  return (
    <div className="post">
      <div className="image">
        <img alt="article-image" src={coverPath} />
      </div>
      <div className="texts">
        <h2>{title}</h2>
        <p className="info">
          <span className="author">{author.username}</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
