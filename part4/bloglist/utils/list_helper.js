const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce(
    (favorite, current) =>
      current.likes > favorite.likes ? current : favorite,
    blogs[0]
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = _.countBy(blogs, 'author')
  const max = _.maxBy(Object.keys(counts), key => counts[key])

  return {
    author: max,
    blogs: counts[max]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Lodash is great but we can handle both of these in one step pretty easily
  // const groups = _.groupBy(blogs, 'author')
  // const sums = groups.map(group => _.sumBy(group, 'likes'))

  const sums = blogs.reduce(
    (map, { author, likes }) => {
      if (!map[author]) {
        map[author] = 0
      }

      map[author] += likes

      return map
    },
    {}
  )

  const max = _.maxBy(Object.keys(sums), key => sums[key])

  return {
    author: max,
    likes: sums[max]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}