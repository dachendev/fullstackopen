import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const style = {
    marginBottom: 10
  }

  const dispatch = useDispatch()

  const setFilter = (text) => {
    console.log('filter:', text)
    dispatch(filterChange(text))
  }

  return (
    <div style={style}>
      filter
      <input onChange={(e) => setFilter(e.target.value)} />
    </div>
  )
}

export default Filter