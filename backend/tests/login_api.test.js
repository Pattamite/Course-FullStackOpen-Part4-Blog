const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

const dummyUsername = helper.dummyUser.username;
const dummyName = helper.dummyUser.name;
const dummyPassword = helper.dummyUser.passwordHash;
let dummyPasswordHash = null;

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    if(!dummyPasswordHash) {
      dummyPasswordHash = await bcrypt.hash(dummyPassword, 10);
    }
    const user = new User({
      username: dummyUsername,
      name: dummyName,
      passwordHash: dummyPasswordHash });

    await user.save();
  });

  test('login succeeds with a correct username and password', async () => {
    const loginInfo = {
      username: dummyUsername,
      password: dummyPassword,
    };

    const response = await api
      .post('/api/login')
      .send(loginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = response.body;
    expect(token.username).toEqual(dummyUsername);
  });

  test('login fails with an incorrect password', async () => {
    const loginInfo = {
      username: dummyUsername,
      password: dummyPassword + 'lmaoxd',
    };

    await api
      .post('/api/login')
      .send(loginInfo)
      .expect(401);
  });

  test('login fails with an incorrect username', async () => {
    const loginInfo = {
      username: dummyUsername + 'lmaoxd',
      password: dummyPassword,
    };

    await api
      .post('/api/login')
      .send(loginInfo)
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});