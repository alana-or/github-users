import { test, expect } from '@playwright/test';

test('should display initial users and handle search', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  await expect(page.getByRole('link', { name: 'mojombo Tom Preston-Werner @' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'defunkt Chris Wanstrath @' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'pjhyett PJ Hyett @pjhyett' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'wycats Yehuda Katz @wycats' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'ezmobius Ezra Zygmuntowicz @' })).toBeVisible();

  await page.getByPlaceholder('Buscar usuários...').click();

  await page.getByPlaceholder('Buscar usuários...').fill('linus torvalds');

  await expect(page.getByRole('link', { name: 'torvalds Linus Torvalds @' })).toBeVisible();
});


test('should navigate to user details and go to initial page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'mojombo Tom Preston-Werner @' }).click();

  await page.goto('http://localhost:3000/users/mojombo');

  await expect(page.getByRole('link', { name: 'Voltar' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tom Preston-Werner' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'mojombo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Repositórios' })).toBeVisible();
  await expect(page.getByRole('link', { name: '30daysoflaptops.github.io' })).toBeVisible();

  await page.getByRole('link', { name: 'Voltar' }).click();
  await expect(page.getByRole('link', { name: 'mojombo Tom Preston-Werner @' })).toBeVisible();
});