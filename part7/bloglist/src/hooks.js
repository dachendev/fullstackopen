import { useState } from 'react'

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
