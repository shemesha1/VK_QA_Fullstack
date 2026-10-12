Список изменений
================

Исправленные ошибки
-------------------

### 1. Тест `has correct title` падал: `Cannot read properties of undefined (reading 'click')`

Файл: `tests/widget.page.ts`, метод `getPopularArticles()`.

Популярные статьи подгружаются уже после открытия виджета, а `locator.all()` не ждёт появления элементов
и возвращал пустой массив, поэтому `articles[0]` был `undefined`.

```diff
 async getPopularArticles() {
-    return this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM).all()
+    const items = this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM);
+    await items.first().waitFor();
+    return items.all()
 }
```

### 2. Клик по кнопке «Написать нам» падал со strict mode violation

Файл: `tests/widget.page.ts`, селектор `BUTTON_WRITE_TO_US`.

На странице статьи селектор `[class^=btn]` находит 7 элементов (в том числе кнопки оценки статьи),
поэтому `click()` не может выбрать нужный. У кнопки «Написать нам» есть собственный атрибут `data-test`.

```diff
-BUTTON_WRITE_TO_US = '[class^=btn]',
+BUTTON_WRITE_TO_US = '[data-test=button_feedback_form]',
```

### 3. Проверка заголовка без ожидания

Файлы: `tests/widget.page.ts` (новый метод `title()`), `tests/widget.spec.ts`.

`expect(await widgetPage.getTitle()).toEqual(...)` читает заголовок один раз сразу после клика: если форма
не успела отрисоваться, будет получен старый заголовок «База знаний Учи.ру». Проверка заменена на
`toHaveText`, которая ждёт нужный текст. Метод `getTitle()` сохранён.

```diff
-expect(await widgetPage.getTitle()).toEqual('Связь с поддержкой');
+await expect(widgetPage.title()).toHaveText('Связь с поддержкой');
```

Дополнительный тест
-------------------

`finds articles by search query` в `tests/widget.spec.ts` проверяет поиск по базе знаний в виджете:

1. открывает виджет и вводит в поиск «пароль»;
2. проверяет, что появился заголовок вида «Нашлось N статей»;
3. проверяет, что N > 0 и в списке результатов ровно N статей;
4. проверяет, что среди результатов есть статья со словом «пароль».

Для теста в `WidgetPage` добавлены селекторы `SEARCH_INPUT`, `SEARCH_RESULTS`, `SEARCH_RESULTS_TITLE`,
`SEARCH_RESULTS_ITEM` и методы `search()`, `searchResultsTitle()`, `searchResults()`.

Результат прогона
-----------------

```
npx playwright test
  ✓ opens
  ✓ has correct title
  ✓ finds articles by search query
  3 passed
```

Иногда (примерно в каждой третьей загрузке страницы) сайт не подгружает сам виджет поддержки, и тесты
падают по таймауту на клике по кнопке открытия виджета. Это поведение сайта, а не тестов; повторный
запуск проходит.
