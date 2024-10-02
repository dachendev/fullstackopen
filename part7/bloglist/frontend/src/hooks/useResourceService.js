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

  const get = (id) => axios.get(`${baseUrl}/${id}`, config).then((response) => response.data)

  const create = (newObject) => axios.post(baseUrl, newObject, config).then((response) => response.data)

  const update = (newObject) =>
    axios.put(`${baseUrl}/${newObject.id}`, newObject, config).then((response) => response.data)

  const remove = (id) => axios.delete(`${baseUrl}/${id}`, config)

  return {
    getAll,
    get,
    create,
    update,
    remove,
  }
}

export default useResourceService
