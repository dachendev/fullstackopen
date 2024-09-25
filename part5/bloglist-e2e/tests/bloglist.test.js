const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('../utils/test-helper.util')

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

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Pride and Prejudice', 'Jane Austen', 'https://en.wikipedia.org/wiki/Pride_and_Prejudice')
      })

      test('a blog can be liked', async ({ page }) => {
        const blogElem = page.getByText('Pride and Prejudice').locator('..')
        await blogElem.getByRole('button', { name: 'show' }).click()
        const likesButton = blogElem.getByRole('button', { name: 'like' })
        const likesElem = blogElem.getByText('likes')

        await likesButton.click()
        await expect(likesElem).toContainText('1')

        await likesButton.click()
        await expect(likesElem).toContainText('2')
      })

      test('user who added the blog can delete the blog', async ({ page }) => {
        const blogElem = page.getByText('Pride and Prejudice').locator('..')
        await blogElem.getByRole('button', { name: 'show' }).click()

        page.on('dialog', dialog => dialog.accept())
        await blogElem.getByRole('button', { name: 'remove' }).click()

        const successElem = page.locator('.success')
        await expect(successElem).toContainText('Removed blog successfuly')
        await expect(page.getByText('Pride and Prejudice')).toHaveCount(0)
      })
    })
  })
})