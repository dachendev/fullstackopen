import { useQuery } from '@tanstack/react-query'
import useResourceService from '../hooks/useResourceService'

const baseUrl = '/api/users'
const queryKey = 'users'

export const useGetUsersQuery = () => {
  const { getAll } = useResourceService(baseUrl)

  return useQuery({
    queryKey: [queryKey],
    queryFn: getAll,
  })
}
