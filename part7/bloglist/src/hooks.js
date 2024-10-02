import { useEffect, useState } from 'react'
import axios from 'axios'
import { useToken } from './contexts/UserContext'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const field = {
    type,
    value,
    onChange,
  }

  return [field, setValue]
}

export const useApiService = (baseUrl) => {
  const token = useToken()

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const getAll = () => axios.get(baseUrl, config).then((response) => response.data)

  const getById = (id) => axios.get(`${baseUrl}/${id}`, config).then((response) => response.data)

  const create = (newObject) => axios.post(baseUrl, newObject, config).then((response) => response.data)

  const update = (newObject) =>
    axios.put(`${baseUrl}/${newObject.id}`, newObject, config).then((response) => response.data)

  const removeById = (id) => axios.delete(`${baseUrl}/${id}`, config)

  return {
    getAll,
    getById,
    create,
    update,
    removeById,
  }
}
