import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const createPost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);

    const response = await fetch("http://localhost:5000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={createPost}>
      <input
        onChange={handleTitleChange}
        type="title"
        placeholder="Title"
        value={title}
      />
      <input
        onChange={handleSummaryChange}
        type="summary"
        placeholder="Summary"
        value={summary}
      />
      <label className="custom-file-upload">
        <input type="file" onChange={handleFileChange} />
        {files ? (
          <i className="fi fi-rr-check"></i>
        ) : (
          <i className="fi fi-rr-upload"></i>
        )}
        {files ? files[0].name : "Upload file"}
      </label>
      <ReactQuill
        onChange={handleContentChange}
        formats={formats}
        modules={modules}
        value={content}
        theme="snow"
      />
      <button style={{ marginTop: "5px" }}>Create article</button>
    </form>
  );
};

export default CreatePost;
