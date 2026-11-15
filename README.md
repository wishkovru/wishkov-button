# Вишков: кнопка «В вишлист» для сайта

Покупатель нажал «В вишлист», и ваш товар сохранился в его вишлисте на [Вишкове](https://wishkov.ru).
Кнопка это обычная HTML-ссылка на [wishkov.ru](https://wishkov.ru): до нажатия с вашего сайта на наш сервер не
уходит ничего, ни запросов, ни скриптов, ни счётчиков.

## Как подключить
1. Вставьте разметку из [`button.html`](https://github.com/wishkovru/wishkov-button/blob/main/button.html) туда, где должна быть кнопка.
2. Подставьте адрес страницы товара вместо `{{URL}}` (или используйте веб-компонент
   `<wishkov-button url="…">` из [`wishkov-button.js`](https://github.com/wishkovru/wishkov-button/blob/main/wishkov-button.js), либо `WishkovButton::render($url)`
   из [`php/WishkovButton.php`](https://github.com/wishkovru/wishkov-button/blob/main/php/WishkovButton.php).
3. Готово. Два размера, три дизайна: fill, outline, soft, подпись меняется атрибутом `label`.

Готовые варианты кнопки лежат в [`button.html`](https://github.com/wishkovru/wishkov-button/blob/main/button.html), букмарклет в [`bookmarklet.txt`](https://github.com/wishkovru/wishkov-button/blob/main/bookmarklet.txt).

### Веб-компонент

```html
<script src="wishkov-button.js" defer></script>
<wishkov-button url="https://shop.example/tovar/1" label="В вишлист" size="m" theme="fill"></wishkov-button>
```

Атрибуты: `url` (адрес товара, по умолчанию адрес текущей страницы), `label` (подпись),
`size` (`s` или `m`), `theme` (`fill`, `outline` или `soft`; `light` и `dark` понимаются как прежние имена `fill` и `soft`), `icon-only` (только значок), `ref` (код площадки для
статистики, латиница, цифры, `_` и `-`). Без JS работает ссылка-фолбэк, положенная внутрь тега.

### PHP

```php
require 'php/WishkovButton.php';
echo \Wishkov\WishkovButton::render($productUrl, ['label' => 'В вишлист', 'size' => 'm', 'theme' => 'fill']);
```

Через Composer: `composer require wishkov/button`.

### Букмарклет

Содержимое `bookmarklet.txt` сохраните как адрес закладки с именем «В Вишков». На странице любого товара
нажмите закладку, и товар откроется в форме добавления желания на Вишкове. Работает в Safari, Firefox,
Chrome и Яндекс Браузере, на компьютере и на iPad.

## О сервисе Вишков

Вишков ([wishkov.ru](https://wishkov.ru)) это бесплатный российский сервис вишлистов: вы собираете желания в один список,
делитесь ссылкой, а друзья бронируют подарки без дублей. Кнопку сделала та же команда, что делает сайт.

## Преимущества перед другими сервисами

- Нет платных аккаунтов: все функции доступны каждому, без тарифов, карты и смс.
- Гостям регистрация не нужна: открыли ссылку, забронировали подарок, готово.
- Товар добавляется по ссылке: название, цена и фото подтягиваются сами, и не только с маркетплейсов.
- Простой интерфейс без лишних шагов: вишлист готов за полминуты, с телефона и с компьютера.
- Режим «сюрприз»: брони скрыты от владельца, подарок остаётся неожиданностью.
- Антивишлист: отдельный список «пожалуйста, не это», чтобы гостям не было неловко.
- 21 тема оформления и свои фото: вишлист выглядит как праздник, а не как таблица.
- Готовая сторис для соцсетей в один тап: дата, отсчёт до праздника и подарки уже на картинке.
- Друзья, напоминания о днях рождения и совместные вишлисты на двоих или на всю семью.
- Желание не обязано быть товаром: поход в горы или урок керамики добавляются вручную за минуту.
- Каталог «Идеи подарков» по поводам, интересам и бюджету, если не знаете, чего хотите.
- Никаких скриптов и трекеров на вашем сайте: кнопка это ссылка.

## English

Wishkov (wishkov.ru) is a free Russian wishlist service: collect wishes in one list, share
a link, friends reserve gifts without duplicates. This package renders an "Add to wishlist"
button as a plain HTML link to wishkov.ru. No scripts are loaded from our server.

## Где лежит

- Репозиторий: https://github.com/wishkovru/wishkov-button
- npm: https://www.npmjs.com/package/wishkov-button (`npm i wishkov-button`)
- Сайт сервиса: https://wishkov.ru/

Лицензия MIT. Поддержка: https://wishkov.ru/support/, info@wishkov.ru.
