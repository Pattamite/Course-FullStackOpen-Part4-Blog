import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const handleNewBlog = jest.fn();

  const component = render(
    <BlogForm handleNewBlog={handleNewBlog} />
  );

  const titleInput = component.container.querySelector('.titleInput');
  const urlInput = component.container.querySelector('.urlInput');
  const form = component.container.querySelector('form');

  const testTitle = 'testTitle';
  const testUrl = 'testUrl';
  fireEvent.change(titleInput, {
    target: { value: testTitle }
  });
  fireEvent.change(urlInput, {
    target: { value: testUrl }
  });
  fireEvent.submit(form);

  expect(handleNewBlog.mock.calls).toHaveLength(1);
  expect(handleNewBlog.mock.calls[0][0].title).toBe(testTitle);
  expect(handleNewBlog.mock.calls[0][0].url).toBe(testUrl);
});