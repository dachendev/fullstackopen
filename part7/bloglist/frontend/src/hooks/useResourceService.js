import axios from 'axios'
import { useToken } from '../contexts/UserContext'

const useResourceService = (baseUrl) => {
  const token = useToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const getAll = () => axios.get(baseUrl, config).then((response) => response.data)

  const create = (newBlog) => axios.post(baseUrl, newBlog, config).then((response) => response.data)

  const update = (newBlog) => axios.put(`${baseUrl}/${newBlog.id}`, newBlog, config).then((response) => response.data)

  const remove = (blogId) => axios.delete(`${baseUrl}/${blogId}`, config)

  return {
    getAll,
    create,
    update,
    remove,
  }
}

export default useResourceService
