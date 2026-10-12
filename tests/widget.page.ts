import {Locator, Page} from "@playwright/test";

enum WidgetPageSelectors {
    WRAPPER = '[class^=widget__]:has([data-test=openWidget])',
    WIDGET_BODY = '[class^=widgetWrapper] > [class^=widget__]',
    HEADER_TEXT = 'header h5',
    BUTTON_OPEN = '[data-test=openWidget]',
    BUTTON_WRITE_TO_US = '[data-test=button_feedback_form]',
    ARTICLE_POPULAR_TITLE = '[class^=popularTitle__]',
    ARTICLE_POPULAR_LIST = `${ARTICLE_POPULAR_TITLE} + ul[class^=articles__]`,
    ARTICLE_POPULAR_LIST_ITEM = `${ARTICLE_POPULAR_LIST} > li`,
    SEARCH_INPUT = 'header [class^=search__] input',
    SEARCH_RESULTS = '[class^=found__]',
    SEARCH_RESULTS_TITLE = `${SEARCH_RESULTS} > [class^=title__]`,
    SEARCH_RESULTS_ITEM = `${SEARCH_RESULTS} > ul[class^=articles__] > li`,
}

export class WidgetPage {
    static selector = WidgetPageSelectors;

    constructor(protected page: Page) {}

    wrapper() {
        return this.page.locator(WidgetPage.selector.WRAPPER)
    }

    async openWidget() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_OPEN).click();
    }

    async getPopularArticles() {
        const items = this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM);
        await items.first().waitFor();
        return items.all()
    }

    async clickWriteToUs() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_WRITE_TO_US).click();
    }

    title(): Locator {
        return this.wrapper().locator(WidgetPage.selector.HEADER_TEXT);
    }

    async getTitle() {
        return this.title().textContent();
    }

    getWidgetBody() {
        return this.page.locator(WidgetPage.selector.WIDGET_BODY);
    }

    async search(query: string) {
        return this.wrapper().locator(WidgetPage.selector.SEARCH_INPUT).fill(query);
    }

    searchResultsTitle(): Locator {
        return this.wrapper().locator(WidgetPage.selector.SEARCH_RESULTS_TITLE);
    }

    searchResults(): Locator {
        return this.wrapper().locator(WidgetPage.selector.SEARCH_RESULTS_ITEM);
    }
}
