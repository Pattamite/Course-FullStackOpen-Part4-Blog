const Blog = require('../models/blog');

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

const test_helper = {
  initialSingleBlogArr,
  initialMultipleBlogArr,
  getNonExistingId,
  getBlogsInDb
};

module.exports = test_helper;