import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useResourceService from '../hooks/useResourceService'
import axios from 'axios'
import { useToken } from '../contexts/UserContext'

const baseUrl = '/api/blogs'
const queryKey = 'blogs'

export const useBlogService = () => useResourceService(baseUrl)

export const useBlogsQuery = () => {
  const { getAll } = useBlogService()

  return useQuery({
    queryKey: [queryKey],
    queryFn: getAll,
  })
}

export const useCreateBlogMutation = () => {
  const { create } = useBlogService()
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
  const { update } = useBlogService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey])
    },
  })
}

export const useRemoveBlogMutation = () => {
  const { remove } = useBlogService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey])
    },
  })
}

export const useAddCommentMutation = (blogId) => {
  const token = useToken()
  const queryClient = useQueryClient()

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const addComment = (blogId, newComment) => axios.post(`${baseUrl}/${blogId}/comments`, newComment, config)

  return useMutation({
    mutationFn: (newComment) => addComment(blogId, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey, blogId])
    },
  })
}
