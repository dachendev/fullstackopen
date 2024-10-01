import axios from 'axios'
const baseUrl = '/api/blogs'

let token

export const setToken = (newToken) => {
  token = newToken
}

export const getBlogs = () => axios.get(baseUrl).then((response) => response.data)

export const createBlog = (newBlog) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios.post(baseUrl, newBlog, config).then((response) => response.data)
}

export const updateBlog = (blogId, newBlog) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios.put(`${baseUrl}/${blogId}`, newBlog, config).then((response) => response.data)
}

export const removeBlog = (blogId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios.delete(`${baseUrl}/${blogId}`, config).then((response) => response.data)
}
