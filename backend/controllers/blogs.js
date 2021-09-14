const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', {
        username: 1,
        name: 1
      });
    response.json(blogs);
  } catch(exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    const user = await User.findById(request.userId);
    if(!user) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = new Blog({
      title: body.title,
      author: user.name,
      url: body.url,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.notes = user.notes.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch(exception) {
    next(exception);
  }
});

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if(blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch(exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.userId);
    if(!(user)) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = await Blog.findById(request.params.id);
    if(!blog) {
      response.status(404).end();
    }

    if(blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'permission denied' });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch(exception) {
    console.log(exception);
    next(exception);
  }
});

module.exports = blogsRouter;