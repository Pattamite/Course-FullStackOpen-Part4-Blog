const blog = require("../models/blog");

function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  function reducer(sum, item) {
    return sum + item.likes;
  }

  return blogs.reduce(reducer, 0);
}

function favoriteBlog(blogs) {
  if(blogs.length === 0) {
    return {};
  }

  let maxLikes = blogs[0].likes;

  blogs.forEach((blog) => {
    maxLikes = blog.likes > maxLikes ? blog.likes : maxLikes;
  });

  return blogs.find((blog) => {
    return blog.likes === maxLikes;
  });
}

function mostBlogsAuthor(blogs) {
  if(blogs.length === 0) {
    return {};
  }

  let authorData = {};

  blogs.forEach((blog) => {
    if(blog.author in authorData) {
      authorData[blog.author] += 1;
    } else {
      authorData[blog.author] = 1;
    }
  });

  let maxBlogs = 0;
  let maxAuthor = '';

  for(let author in authorData) {
    if(authorData[author] > maxBlogs){
      maxBlogs = authorData[author];
      maxAuthor = author;
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  };
}

function mostLikesAuthor(blogs) {
  if(blogs.length === 0) {
    return {};
  }

  let authorData = {};

  blogs.forEach((blog) => {
    if(blog.author in authorData) {
      authorData[blog.author] += blog.likes;
    } else {
      authorData[blog.author] = blog.likes;
    }
  });

  let maxLikes = 0;
  let maxAuthor = '';

  for(let author in authorData) {
    if(authorData[author] > maxLikes){
      maxLikes = authorData[author];
      maxAuthor = author;
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  };
}

const listHelper = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogsAuthor,
  mostLikesAuthor
};

module.exports = listHelper;
