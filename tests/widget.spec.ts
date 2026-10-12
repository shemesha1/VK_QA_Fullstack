import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page}) => {
    widgetPage = new WidgetPage(page);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup
    await page.click('._UCHI_COOKIE__button');
  });

  test('opens', async ({page}) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async ({ page }) => {
    await widgetPage.openWidget();

    const articles = await widgetPage.getPopularArticles();

    await articles[0].click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.title()).toHaveText('Связь с поддержкой');
  });

  test('finds articles by search query', async () => {
    await widgetPage.openWidget();

    await widgetPage.search('пароль');

    const resultsTitle = widgetPage.searchResultsTitle();
    await expect(resultsTitle).toHaveText(/^Нашл\S* \d+ стат/);

    const found = Number((await resultsTitle.textContent())!.match(/\d+/)![0]);
    expect(found).toBeGreaterThan(0);
    await expect(widgetPage.searchResults()).toHaveCount(found);

    await expect(widgetPage.searchResults().filter({ hasText: /пароль/i }).first()).toBeVisible();
  });
});
