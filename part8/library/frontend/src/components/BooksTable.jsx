import PropTypes from 'prop-types'

const BooksTable = ({ books }) => {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
      </thead>
      <tbody>
        {books.map((a) => (
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

BooksTable.propTypes = {
  books: PropTypes.array.isRequired,
}

export default BooksTable
