const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for(let blog of helper.initialMultipleBlogArr) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('when there is initially some blogs saved', () => {
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
});

describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogs = await helper.getBlogsInDb();
    const targetBlog = blogs[0];

    const queriedTargetBlog = await api
      .get(`/api/blogs/${targetBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(queriedTargetBlog.body).toEqual(targetBlog);
  });

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexisteingId = await helper.getNonExistingId();

    await api
      .get(`/api/blogs/${validNonexisteingId}`)
      .expect(404);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const invalidNonexisteingId = 'lmaoxd';

    await api
      .get(`/api/blogs/${invalidNonexisteingId}`)
      .expect(400);
  });
});

describe('addition of a new blog', () => {
  let dummyuserId = null;
  let dummyLoginToken = null;
  let dummyAuthenType = { type: 'bearer' };

  beforeEach(async () => {
    await User.deleteMany({});
    let userObject = new User(helper.dummyUser);
    await userObject.save();

    const users = await helper.getUsersInDb();
    dummyuserId = users[0].id;
    dummyLoginToken = await helper.generateLoginTokenFromUser(users[0]);
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'testnew',
      userId: dummyuserId,
      url: 'https://pattamite.com',
    };

    const response = await api
      .post('/api/blogs')
      .auth(dummyLoginToken, dummyAuthenType)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.getBlogsInDb();
    expect(blogs).toHaveLength(helper.initialMultipleBlogArr.length + 1);

    const title = blogs.map(r => r.title);
    expect(title).toContain(newBlog.title);

    const returnedBlog = response.body;
    expect(returnedBlog.likes).toEqual(0);
    expect(returnedBlog.user).toEqual([dummyuserId]);
    expect(returnedBlog.author).toEqual(helper.dummyUser.name);
  });

  test('an invalid blog can\'t be added', async () => {
    const newBlog = {
      title: 'testnew',
      userId: dummyuserId,
    };

    await api
      .post('/api/blogs')
      .auth(dummyLoginToken, dummyAuthenType)
      .send(newBlog)
      .expect(400);

    const blogs = await helper.getBlogsInDb();
    expect(blogs).toHaveLength(helper.initialMultipleBlogArr.length);
  });
});

describe('deletion of a new blog', () => {
  let dummyuserId = null;
  let dummyLoginToken = null;
  let dummyAuthenType = { type: 'bearer' };
  let targetBlogId = null;

  beforeEach(async () => {
    await User.deleteMany({});
    let userObject = new User(helper.dummyUser);
    await userObject.save();

    const users = await helper.getUsersInDb();
    dummyuserId = users[0].id;
    dummyLoginToken = await helper.generateLoginTokenFromUser(users[0]);
  });

  test('an authorized blog can be deleted with status code 204', async () => {
    const newBlog = {
      title: 'testnew',
      userId: dummyuserId,
      url: 'https://pattamite.com',
    };

    const response = await api
      .post('/api/blogs')
      .auth(dummyLoginToken, dummyAuthenType)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    targetBlogId = response.body.id;
    const blogs = await helper.getBlogsInDb();

    await api
      .delete(`/api/blogs/${targetBlogId}`)
      .auth(dummyLoginToken, dummyAuthenType)
      .expect(204);

    const currentBlogs = await helper.getBlogsInDb();
    expect(currentBlogs).toHaveLength(blogs.length - 1);

    const blogsId = currentBlogs.map((blog) => {return blog.id;});
    expect(blogsId).not.toContain(targetBlogId);
  });

  test('an unauthorized blog can\'t be deleted then return with status code 401', async () => {
    const newBlog = {
      title: 'testnew',
      userId: dummyuserId,
      url: 'https://pattamite.com',
    };

    const response = await api
      .post('/api/blogs')
      .auth(dummyLoginToken, dummyAuthenType)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    targetBlogId = response.body.id;
    const blogs = await helper.getBlogsInDb();

    await api
      .delete(`/api/blogs/${targetBlogId}`)
      .auth(dummyLoginToken, dummyAuthenType)
      .expect(204);

    const currentBlogs = await helper.getBlogsInDb();
    expect(currentBlogs).toHaveLength(blogs.length - 1);

    const blogsId = currentBlogs.map((blog) => {return blog.id;});
    expect(blogsId).not.toContain(targetBlogId);
  });
});

afterAll(() => {
  mongoose.connection.close();
});