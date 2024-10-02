import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useResourceService from '../hooks/useResourceService'

const baseUrl = '/api/blogs'
const queryKey = 'blogs'

export const useBlogsQuery = () => {
  const { getAll } = useResourceService(baseUrl)

  return useQuery({
    queryKey: [queryKey],
    queryFn: getAll,
  })
}

export const useCreateBlogMutation = () => {
  const { create } = useResourceService(baseUrl)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData([queryKey])
      queryClient.setQueryData([queryKey], blogs.concat(newBlog))
    },
  })
}

export const useUpdateBlogMutation = () => {
  const { update } = useResourceService(baseUrl)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey])
    },
  })
}

export const useRemoveBlogMutation = () => {
  const { remove } = useResourceService(baseUrl)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey])
    },
  })
}
