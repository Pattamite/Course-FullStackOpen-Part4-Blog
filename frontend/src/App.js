import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
  const loggedBlogAppUserKey = 'loggedBlogAppUser';
  const notificationClassError = 'error';
  const notificationClassConfirm = 'confirm';
  const notificationClassHide = 'hide';

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationClass, setNotificationClass] = useState(notificationClassHide);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(loggedBlogAppUserKey);
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  async function handleLogin(newLoginRequest) {
    try {
      const user = await loginService.login(newLoginRequest);

      window.localStorage.setItem(
        loggedBlogAppUserKey, JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setNotification(`Login success. Welcome, ${user.name}`, notificationClassConfirm);
    } catch (exception) {
      setNotification('Login fail.', notificationClassError);
      console.log(exception);
    }
  }

  async function handleLogout() {
    let username = user.name;
    window.localStorage.removeItem(loggedBlogAppUserKey);
    blogService.setToken('');
    setUser(null);
    setNotification(`Logout success. Goodbye, ${username}`, notificationClassConfirm);
  }

  async function handleNewBlog(newBlogRequest) {
    try {
      blogFormRef.current.toggleVisibility();
      const newBlog = await blogService.create(newBlogRequest);
      setBlogs(blogs.concat(newBlog));
      setNotification(`Created a new blog. ${newBlog.title}`, notificationClassConfirm);
    } catch (exception) {
      setNotification(`Error. ${exception}`, notificationClassError);
      console.log(exception);
    }
  }

  async function handleUpdateBlog(updateBlogRequest) {
    try {
      const newBlog = await blogService.update(updateBlogRequest);
      setBlogs(blogs.map( (blog) => {
        return blog.id === newBlog.id ? newBlog : blog;
      }));
      setNotification(`Blog updated. ${newBlog.title}`, notificationClassConfirm);
    } catch (exception) {
      setNotification(`Error. ${exception}`, notificationClassError);
      console.log(exception);
    }
  }

  async function handleDeleteBlog(blogId) {
    try {
      const targetBlog = blogs.find( (blog) => {
        return blog.id === blogId;
      });
      await blogService.remove(blogId);
      setBlogs(blogs.filter( (blog) => {
        return blog.id !== blogId;
      }));
      setNotification(`Blog deleted. ${targetBlog.title}`, notificationClassConfirm);
    } catch (exception) {
      setNotification(`Error. ${exception}`, notificationClassError);
      console.log(exception);
    }
  }

  function setNotification(message, className, timeout = 5000) {
    setNotificationMessage(message);
    setNotificationClass(className);
    setTimeout(() => {
      setNotificationMessage('');
      setNotificationClass(notificationClassHide);
    }, timeout);
  }

  function loginForm(){
    return (
      <div>
        <Togglable buttonLabel='log in'>
          <LoginForm
            handleLogin={handleLogin}
          />
        </Togglable>
      </div>
    );
  }

  function blogForm() {
    return (
      <div>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm
            handleNewBlog={handleNewBlog}
          />
        </Togglable>
      </div>
    );
  }

  return (
    <div>
      <Notification
        message={notificationMessage}
        className={notificationClass}
      />
      {user === null ?
        loginForm() :
        <div>
          <p>
            {`${user.name} logged-in. `}
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
        </div>
      }
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleUpdateBlog={handleUpdateBlog}
          handleDeleteBlog={handleDeleteBlog}
        />
      )}
    </div>
  );
}

export default App;