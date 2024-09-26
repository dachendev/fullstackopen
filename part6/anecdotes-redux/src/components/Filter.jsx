import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const setFilter = (text) => {
    console.log('filter:', text)
    dispatch(filterChange(text))
  }

  return (
    <div>
      filter
      <input onChange={(e) => setFilter(e.target.value)} />
    </div>
  )
}

export default Filter