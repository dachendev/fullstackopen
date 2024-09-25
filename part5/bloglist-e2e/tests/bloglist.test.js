const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, logOut, incrementLikes } = require('../utils/test-helper.util')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/test/reset')

    await request.post('/api/users', {
      data: {
        name: 'Jacob Dachenhaus',
        username: 'dachendev',
        password: 'dachendev'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'otheruser'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'dachendev', 'dachendev')
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'dachendev', 'oops')

      const errorElem = page.locator('.error')
      await expect(errorElem).toContainText('invalid username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'dachendev', 'dachendev')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, '1984', 'George Orwell', 'https://en.wikipedia.org/wiki/Nineteen_Eighty-Four')
      await expect(page.getByText('1984 George Orwell')).toBeVisible()
    })

    test('user can log out', async ({ page }) => {
      await logOut(page)
      await expect(page.getByText('log in to application')).toBeVisible()
    })

    describe('and many blogs exist', () => {
      const blogs = [
        { title: 'Pride and Prejudice', author: 'Jane Austen', url: 'https://en.wikipedia.org/wiki/Pride_and_Prejudice' },
        { title: 'Lolita', author: 'Vladimir Nabokov', url: 'https://en.wikipedia.org/wiki/Lolita' },
        { title: 'Moby-Dick', author: 'Herman Melville', url: 'https://en.wikipedia.org/wiki/Moby-Dick' }
      ]

      beforeEach(async ({ page }) => {
        for await (const b of blogs) {
          await createBlog(page, b.title, b.author, b.url),
            await page.waitForResponse(response =>
              response.url().includes('/api/blogs')
              && response.status() === 201
              && response.request().method() === 'POST'
            )
        }
      })

      test('a blog can be liked', async ({ page }) => {
        const blogElem = page.locator('.blog', { hasText: blogs[0].title })

        await incrementLikes(page, blogElem)
        await expect(blogElem).toContainText('likes 1')

        await incrementLikes(page, blogElem)
        await expect(blogElem).toContainText('likes 2')
      })

      test('user who added the blog can delete the blog', async ({ page }) => {
        const blogElem = page.locator('.blog', { hasText: blogs[0].title })
        await blogElem.getByRole('button', { name: 'show' }).click()

        page.on('dialog', dialog => dialog.accept())
        await blogElem.getByRole('button', { name: 'remove' }).click()

        const successElem = page.locator('.success')
        await expect(successElem).toContainText('Removed blog successfuly')
        await expect(page.getByText(`${blogs[0].title} ${blogs[0].author}`)).toHaveCount(0)
      })

      test('only the user who created it sees the remove button', async ({ page }) => {
        await logOut(page)
        await loginWith(page, 'otheruser', 'otheruser')

        const blogElem = page.getByText('Pride and Prejudice').locator('..')
        await blogElem.getByRole('button', { name: 'show' }).click()
        await expect(blogElem.getByRole('button', { name: 'remove' })).toHaveCount(0)
      })

      test('blogs are sorted by most likes', async ({ page }) => {
        const blog1 = page.locator('.blog', { hasText: blogs[0].title })
        const blog2 = page.locator('.blog', { hasText: blogs[1].title })
        const blog3 = page.locator('.blog', { hasText: blogs[2].title })

        await incrementLikes(page, blog1, 1)
        await incrementLikes(page, blog2, 3)
        await incrementLikes(page, blog3, 5)

        const blogElems = page.locator('.blog')
        const counts = []

        for (let i = 0; i < await blogElems.count(); i++) {
          const textContent = await blogElems.nth(i).getByText('likes').textContent()
          const n = parseInt(textContent.replace(/\D/g, ''))
          counts.push(n)
        }

        const inDescOrder = counts.every((value, index) => index === 0 || value <= counts[index - 1])
        expect(inDescOrder).toBe(true)
      })
    })
  })
})