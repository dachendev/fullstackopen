import { useGetUsersQuery } from '../api/userHooks'
import { Card, Typography } from '@material-tailwind/react'
import { Link } from 'react-router-dom'

const UsersTable = () => {
  const usersQuery = useGetUsersQuery()

  if (usersQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const users = usersQuery.data

  const tableHead = ['name', 'blogs created']

  return (
    <Card className="w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isLast = index === user.length - 1
            const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'

            return (
              <tr key={user.id}>
                <td className={classes}>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    <Link to={`/users/${user.id}`} className="font-medium text-blue-600 hover:underline">
                      {user.name}
                    </Link>
                  </Typography>
                </td>
                <td className={classes}>{user.blogs.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}

export default UsersTable
