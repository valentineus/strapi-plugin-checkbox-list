import { expect, test } from '@playwright/test';

const adminEmail = process.env.STRAPI_ADMIN_EMAIL ?? 'admin@example.com';
const adminPassword = process.env.STRAPI_ADMIN_PASSWORD ?? 'Admin12345';
const contentTypeName = 'Checkbox Item E2E';

test('custom field works in admin UI', async ({ page }) => {
  await page.goto('/admin');

  await page.getByLabel(/email/i).fill(adminEmail);
  await page.getByLabel(/password/i).fill(adminPassword);
  await page.getByRole('button', { name: /log in|sign in/i }).click();
  await page.waitForURL(/\/admin(\/)?$/);

  await page.getByRole('link', { name: /content[- ]type builder/i }).click();

  await page.getByRole('button', { name: /create new collection type/i }).click();
  await page.getByLabel(/display name/i).fill(contentTypeName);
  await page.getByRole('button', { name: /continue|next/i }).click();

  await page.getByRole('button', { name: /add (another|new) field/i }).click();
  const searchInput = page.getByPlaceholder(/search/i);
  if (await searchInput.count()) {
    await searchInput.fill('checkbox');
  }
  await page.getByRole('button', { name: /checkbox list/i }).click();

  await page.getByLabel(/name/i).fill('choices');
  await page.getByLabel(/values/i).fill('alpha\nbeta\ngamma');

  await page.getByRole('tab', { name: /advanced/i }).click();
  await page.getByLabel(/required field/i).check();
  await page.getByRole('button', { name: /select default values/i }).click();
  await page.getByRole('option', { name: 'alpha' }).click();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: /finish|save/i }).click();
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 60_000 });

  await page.getByRole('link', { name: /content[- ]type builder/i }).click();
  await page.getByText(contentTypeName).click();
  await page.getByText('choices').click();
  await page.getByLabel(/values/i).fill('alpha\nbeta\ngamma\ndelta');
  await page.getByRole('button', { name: /finish|save/i }).click();
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 60_000 });

  await page.getByRole('link', { name: /content manager/i }).click();
  await page.getByRole('link', { name: /checkbox item e2e/i }).click();
  await page.getByRole('button', { name: /create new entry/i }).click();

  const alphaCheckbox = page.getByRole('checkbox', { name: 'alpha' });
  await expect(alphaCheckbox).toBeChecked();

  await alphaCheckbox.click();
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText(/required/i)).toBeVisible();

  await page.getByRole('checkbox', { name: 'beta' }).check();
  await page.getByRole('checkbox', { name: 'delta' }).check();
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText(/saved/i)).toBeVisible();

  await page.getByRole('checkbox', { name: 'gamma' }).check();
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText(/saved/i)).toBeVisible();
});
