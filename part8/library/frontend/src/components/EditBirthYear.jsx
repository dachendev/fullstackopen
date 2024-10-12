import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

export const EditBirthYear = () => {
  const [selectedName, setSelectedName] = useState('')
  const [born, setBorn] = useState('')

  const { loading, error, data } = useQuery(ALL_AUTHORS)

  useEffect(() => {
    if (data) {
      setSelectedName(data.allAuthors[0].name)
    }
  }, [data, setSelectedName])

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const onSubmit = (event) => {
    event.preventDefault()

    console.log('edit birth year')

    editAuthor({
      variables: {
        name: selectedName,
        setBornTo: Number(born),
      },
    })

    setSelectedName('')
    setBorn('')
  }

  if (loading) return <p>loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          name{' '}
          <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
            {data.allAuthors.map((obj) => (
              <option key={obj.name} value={obj.name}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born <input type="number" value={born} onChange={(e) => setBorn(e.target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditBirthYear
