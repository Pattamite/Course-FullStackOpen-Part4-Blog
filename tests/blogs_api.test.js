const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for(let blog of helper.initialMultipleBlogArr) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const blogs = await helper.getBlogsInDb();
  expect(blogs).toHaveLength(helper.initialMultipleBlogArr.length);
});

test('a specific blog is within the returned blogs', async () => {
  const blogs = await helper.getBlogsInDb();
  const contents = blogs.map(r => r.title);
  expect(contents).toContain('test1');
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'testnew',
    author: 'tester',
    url: 'https://pattamite.com',
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await helper.getBlogsInDb();
  expect(blogs).toHaveLength(helper.initialMultipleBlogArr.length + 1);

  const title = blogs.map(r => r.title);
  expect(title).toContain(newBlog.title);

  const returnedBlog = response.body;
  expect(returnedBlog.likes).toEqual(0);
});

test('an invalid blog can\'t be added', async () => {
  const newBlog = {
    title: 'testnew',
    author: 'tester',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const blogs = await helper.getBlogsInDb();
  expect(blogs).toHaveLength(helper.initialMultipleBlogArr.length);
});

test('a specific blog can be viewed', async () => {
  const blogs = await helper.getBlogsInDb();
  const targetBlog = blogs[0];

  const queriedTargetBlog = await api
    .get(`/api/blogs/${targetBlog.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(queriedTargetBlog.body).toEqual(targetBlog);
});

test('a blog can be deleted', async () => {
  const blogs = await helper.getBlogsInDb();
  const targetBlog = blogs[0];

  await api
    .delete(`/api/blogs/${targetBlog.id}`)
    .expect(204);

  const currentBlogs = await helper.getBlogsInDb();
  expect(currentBlogs).toHaveLength(blogs.length - 1);

  const blogsId = currentBlogs.map((blog) => {return blog.id;});
  expect(blogsId).not.toContain(targetBlog.id);
});

afterAll(() => {
  mongoose.connection.close();
});