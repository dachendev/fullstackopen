import axios from 'axios'

const baseUrl = 'http://localhost:3000/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (content) => {
  const newObject = {
    id: getId(),
    content,
    votes: 0
  }

  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const patchById = async (id, patch) => {
  const response = await axios.patch(`${baseUrl}/${id}`, patch)
  return response.data
}

export default {
  getAll,
  create,
  patchById
}