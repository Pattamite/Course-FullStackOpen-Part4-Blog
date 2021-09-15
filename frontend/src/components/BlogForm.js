import React, { useState } from 'react';
import PropTypes from 'prop-types';

function BlogForm({ handleNewBlog }) {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const newBlogRequest = {
      title: blogTitle,
      url: blogUrl
    };
    handleNewBlog(newBlogRequest);
    setBlogTitle('');
    setBlogUrl('');
  }

  return (
    <form onSubmit={handleSubmit} className="formDiv">
      <div>
        Title
        <input
          type="text"
          value={blogTitle}
          name="Title"
          onChange={({ target }) => setBlogTitle(target.value)}
          className="titleInput"
        />
      </div>
      <div>
        Url
        <input
          type="text"
          value={blogUrl}
          name="Url"
          onChange={({ target }) => setBlogUrl(target.value)}
          className="urlInput"
        />
      </div>
      <button type="submit">save</button>
    </form>
  );
}

BlogForm.propTypes = {
  handleNewBlog: PropTypes.func.isRequired,
};

export default BlogForm;