import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, prettyDOM, fireEvent } from '@testing-library/react';
import {  } from '@testing-library/react';
import Blog from './Blog';

const blogTitle = 'testBlog';
const blogAuthor = 'testAuthor';
const blogUrl = 'testUrl';
const blogLikes = 0;

test('renders content', () => {
  const blog = {
    title: blogTitle,
    author: blogAuthor,
    url: blogUrl,
    likes: blogLikes,
  };

  const mockHandleUpdateBlog = jest.fn();
  const mockHandleDeleteBlog = jest.fn();

  const component = render(
    <Blog
      blog={blog}
      handleUpdateBlog={mockHandleUpdateBlog}
      handleDeleteBlog={mockHandleDeleteBlog}
    />
  );

  // //  Print component HTML to console
  //  component.debug();

  expect(component.container).toHaveTextContent(blogTitle);

  const element = component.getByText(blogTitle);
  expect(element).toBeDefined();

  const div = component.container.querySelector('.blog');
  // //  Print component HTML to console
  // console.log(prettyDOM(div));
  expect(div).toHaveTextContent(blogTitle);
});

test('clicking the button calls event handler once', () => {
  const blog = {
    title: blogTitle,
    author: blogAuthor,
    url: blogUrl,
    likes: blogLikes,
  };

  const mockHandleUpdateBlog = jest.fn();
  const mockHandleDeleteBlog = jest.fn();

  const component = render(
    <Blog
      blog={blog}
      handleUpdateBlog={mockHandleUpdateBlog}
      handleDeleteBlog={mockHandleDeleteBlog}
    />
  );

  const button = component.getByText('Like');
  fireEvent.click(button);
  expect(mockHandleUpdateBlog.mock.calls).toHaveLength(1);
  fireEvent.click(button);
  expect(mockHandleUpdateBlog.mock.calls).toHaveLength(2);
});