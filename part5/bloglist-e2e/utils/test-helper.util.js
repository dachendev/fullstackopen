const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const logOut = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

const incrementLikes = async (page, blogElem, times = 1) => {
  const showButton = blogElem.getByRole('button', { name: 'show' })
  if (await showButton.isVisible()) {
    await showButton.click()
  }

  const likeButton = blogElem.getByRole('button', { name: 'like' })
  for (let i = 0; i < times; i++) {
    await likeButton.click()
    await page.waitForResponse(response =>
      response.url().includes('/api/blogs')
        && response.status() === 200
        && response.request().method() === 'PUT'
    )
  }
}

module.exports = { loginWith, createBlog, logOut, incrementLikes }