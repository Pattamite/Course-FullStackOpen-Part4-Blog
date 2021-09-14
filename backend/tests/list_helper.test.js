const listHelper = require('../utils/list_helper');

const singleBlogArr = [
  {
    title: 'test1',
    author: 'tester',
    url: '',
    likes: 1
  }
];

const multipleBlogArr = [
  {
    title: 'test1',
    author: 'testerA',
    url: '',
    likes: 1
  },
  {
    title: 'test2',
    author: 'testerA',
    url: '',
    likes: 5
  },
  {
    title: 'test3',
    author: 'testerB',
    url: '',
    likes: 7
  }
];

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);

  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list', () => {
    expect(listHelper.totalLikes([]))
      .toBe(0);
  });

  test('when list has only one blog', () => {
    expect(listHelper.totalLikes(singleBlogArr))
      .toBe(singleBlogArr[0].likes);
  });

  test('of manay', () => {
    expect(listHelper.totalLikes(multipleBlogArr))
      .toBe(multipleBlogArr[0].likes + multipleBlogArr[1].likes + multipleBlogArr[2].likes);
  });
});

describe('favorite blog', () => {
  test('of empty list', () => {
    expect(listHelper.favoriteBlog([]))
      .toEqual({});
  });

  test('when list has only one blog', () => {
    expect(listHelper.favoriteBlog(singleBlogArr))
      .toEqual(singleBlogArr[0]);
  });

  test('of manay', () => {
    expect(listHelper.favoriteBlog(multipleBlogArr))
      .toEqual(multipleBlogArr[2]);
  });
});

describe('author with most blogs', () => {
  test('of empty list', () => {
    expect(listHelper.mostBlogsAuthor([]))
      .toEqual({});
  });

  test('when list has only one blog', () => {
    const expectedAns = {
      author: 'tester',
      blogs: 1
    };
    expect(listHelper.mostBlogsAuthor(singleBlogArr))
      .toEqual(expectedAns);
  });

  test('of manay', () => {
    const expectedAns = {
      author: 'testerA',
      blogs: 2
    };
    expect(listHelper.mostBlogsAuthor(multipleBlogArr))
      .toEqual(expectedAns);
  });
});

describe('author with most likes', () => {
  test('of empty list', () => {
    expect(listHelper.mostBlogsAuthor([]))
      .toEqual({});
  });

  test('when list has only one blog', () => {
    const expectedAns = {
      author: 'tester',
      likes: 1
    };
    expect(listHelper.mostLikesAuthor(singleBlogArr))
      .toEqual(expectedAns);
  });

  test('of manay', () => {
    const expectedAns = {
      author: 'testerB',
      likes: 7
    };
    expect(listHelper.mostLikesAuthor(multipleBlogArr))
      .toEqual(expectedAns);
  });
});