const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const config = require('../utils/config');

const initialSingleBlogArr = [
  {
    title: 'test1',
    author: 'tester',
    url: 'https://pattamite.com',
    likes: 1
  }
];

const initialMultipleBlogArr = [
  {
    title: 'test1',
    author: 'testerA',
    url: 'https://pattamite.com',
    likes: 1
  },
  {
    title: 'test2',
    author: 'testerA',
    url: 'https://pattamite.com',
    likes: 5
  },
  {
    title: 'test3',
    author: 'testerB',
    url: 'https://pattamite.com',
    likes: 7
  }
];

const dummyUser = {
  username: 'dummy',
  name: 'dummy',
  passwordHash: 'passwordHash',
};

async function getNonExistingId() {
  const blog = new Blog(initialSingleBlogArr[0]);
  await blog.save();
  await blog.remove();

  return blog._id.toString();
}

async function getBlogsInDb() {
  const blogs = await Blog.find({});
  return blogs.map((blog) => {return blog.toJSON();});
}

async function getUsersInDb() {
  const users = await User.find({});
  return users.map((user) => {return user.toJSON();});
}

async function generateLoginTokenFromUser(user) {
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  return jwt.sign(
    userForToken,
    config.SECRET,
  );
}

const test_helper = {
  initialSingleBlogArr,
  initialMultipleBlogArr,
  dummyUser,
  getNonExistingId,
  getBlogsInDb,
  getUsersInDb,
  generateLoginTokenFromUser,
};

module.exports = test_helper;