import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

function getAll(){
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
}

function setToken(newToken) {
  token = `bearer ${newToken}`;
}

async function create(newBlog) {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
}

async function update(updatedBlog) {
  const config = {
    headers: { Authorization: token },
  };

  const blogId = updatedBlog.id;

  const response = await axios.put(`${baseUrl}/${blogId}`, updatedBlog, config);
  return response.data;
}

async function remove(blogId) {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response.data;
}

const blogs = {
  getAll,
  setToken,
  create,
  update,
  remove
};

export default blogs;