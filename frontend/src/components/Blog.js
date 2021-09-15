import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Blog({
  blog,
  handleUpdateBlog,
  handleDeleteBlog })
{
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? '' : 'none' };
  const buttonLabel = visible ? 'hide' : 'show';

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  function toggleVisibility (){
    setVisible(!visible);
  }

  function handleLike(){
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    };
    handleUpdateBlog(updatedBlog);
  }

  function handleDelete(){
    const result = window.confirm(`Delete ${blog.title}?`);
    if(!result){
      return;
    }

    handleDeleteBlog(blog.id);
  }

  return (
    <div style={blogStyle}>
      <h3>{`${blog.title} `}
        <button onClick={toggleVisibility}>{buttonLabel}</button>
        <button onClick={handleDelete}>delete</button>
      </h3>
      <div style={showWhenVisible}>
        <p>Author: {blog.author}</p>
        <p>URL: {blog.url}</p>
        <p>Likes: {blog.likes} <button onClick={handleLike}>Like</button></p>
      </div>
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleUpdateBlog: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
};

export default Blog;