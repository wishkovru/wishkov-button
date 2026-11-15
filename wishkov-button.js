/* Вишков: кнопка «В вишлист» для сайта. Веб-компонент без зависимостей.
 *
 *   <script src="wishkov-button.js" defer></script>
 *   <wishkov-button url="https://shop.example/tovar/1" label="В вишлист" size="m" theme="fill">
 *     <a href="https://wishkov.ru/add/?url=https%3A%2F%2Fshop.example%2Ftovar%2F1&ref=button" rel="nofollow">В вишлист</a>
 *   </wishkov-button>
 *
 * Внутрь тега можно положить обычную ссылку-фолбэк: без JS она работает сама,
 * с JS компонент заменит её на оформленную кнопку. Разметка та же, что у
 * эталона button.html (её строит сервер Вишкова функцией render_button) и у
 * PHP-класса WishkovButton: один HTML на все площадки. Кнопка это ссылка,
 * никаких запросов к wishkov.ru до нажатия.
 *
 * Атрибуты: url (адрес товара; по умолчанию адрес текущей страницы),
 * label (подпись, до 60 знаков), size (s|m), theme (fill|outline|soft; light и dark как синонимы),
 * icon-only (только значок), ref (код площадки, [a-z0-9_-], по умолчанию button).
 *
 * В node (тесты) чистая функция доступна через module.exports.
 */
(function (root) {
  "use strict";

  var SITE = "https://wishkov.ru";
  var PLACEHOLDER_URL = "{{URL}}";
  var DEFAULT_LABEL = "В вишлист";
  var DEFAULT_REF = "button";

  // Цвета — токены static/css/wishkov.css сайта: --violet, --violet-deep, --violet-50, --white.
  var VIOLET = "#6E56E8";
  var VIOLET_DEEP = "#3E2E96";
  var PAPER = "#F7F5FF";
  var WHITE = "#ffffff";

  var SOFT = "#EFEBFF";

  var SIZES = {
    s: { height: 32, pad: 12, font: 13, icon: 18 },
    m: { height: 40, pad: 16, font: 15, icon: 22 },
  };
  var THEMES = {
    fill: { bg: VIOLET, fg: WHITE, border: VIOLET },
    outline: { bg: WHITE, fg: VIOLET_DEEP, border: VIOLET },
    soft: { bg: SOFT, fg: VIOLET_DEEP, border: SOFT },
  };
  var THEME_ALIASES = { light: "fill", dark: "soft" };

  function normalizeTheme(theme) {
    var name = Object.prototype.hasOwnProperty.call(THEME_ALIASES, theme) ? THEME_ALIASES[theme] : theme;
    return Object.prototype.hasOwnProperty.call(THEMES, name) ? name : "fill";
  }

  // Цветной знак; на заливке корпус светлый, окошки фиолетовые, на светлых темах наоборот.
  function markSvg(size, theme) {
    var fill = normalizeTheme(theme) === "fill";
    var body = fill ? PAPER : VIOLET;
    var win = fill ? VIOLET : PAPER;
    function rect(x, y, w, h, rx, color) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + color + '"/>';
    }
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 200 200" fill="none" aria-hidden="true" focusable="false">' +
      rect(44, 30, 112, 140, 18, body) +
      rect(72, 18, 56, 24, 8, VIOLET_DEEP) +
      rect(66, 72, 30, 30, 8, win) + rect(104, 72, 30, 30, 8, win) +
      rect(66, 112, 30, 30, 8, win) + rect(104, 112, 30, 30, 8, win) +
      "</svg>"
    );
  }

  // Как django.utils.html.escape: & < > " ' .
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  // Как urllib.parse.quote(url, safe=""): кодируется всё, кроме A-Za-z0-9-._~.
  function percentEncode(value) {
    return encodeURIComponent(String(value)).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  function cleanRef(raw) {
    var value = String(raw || "").trim();
    return /^[a-z0-9_-]{1,20}$/.test(value) ? value : "";
  }

  function buttonHref(url, ref) {
    var urlPart = url === PLACEHOLDER_URL ? url : percentEncode(url);
    return SITE + "/add/?url=" + urlPart + "&ref=" + (cleanRef(ref) || DEFAULT_REF);
  }

  function buttonHtml(options) {
    var opts = options || {};
    var url = opts.url === undefined || opts.url === null || opts.url === "" ? PLACEHOLDER_URL : String(opts.url);
    var dims = SIZES[opts.size] || SIZES.m;
    var theme = normalizeTheme(opts.theme);
    var colors = THEMES[theme];
    var iconOnly = !!opts.iconOnly;
    var label = String(opts.label || DEFAULT_LABEL).trim().slice(0, 60) || DEFAULT_LABEL;
    var pad = iconOnly ? "0" : "0 " + dims.pad + "px";
    var width = iconOnly ? "width:" + dims.height + "px;" : "";
    var style =
      "display:inline-flex;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;" +
      "height:" + dims.height + "px;" + width + "padding:" + pad + ";border-radius:999px;" +
      "background:" + colors.bg + ";color:" + colors.fg + ";border:1.5px solid " + colors.border + ";" +
      "font:700 " + dims.font + "px/1 Mulish,system-ui,-apple-system,'Segoe UI',sans-serif;" +
      "text-decoration:none;white-space:nowrap;vertical-align:middle";
    var safeLabel = escapeHtml(label);
    var text = iconOnly ? "" : "<span>" + safeLabel + "</span>";
    var aria = iconOnly ? ' aria-label="' + safeLabel + '"' : "";
    return (
      '<a href="' + escapeHtml(buttonHref(url, opts.ref)) + '" rel="nofollow" title="' + safeLabel + '"' + aria +
      ' style="' + style + '">' + markSvg(dims.icon, theme) + text + "</a>"
    );
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { buttonHtml: buttonHtml, buttonHref: buttonHref, escapeHtml: escapeHtml, percentEncode: percentEncode, normalizeTheme: normalizeTheme, markSvg: markSvg };
  }

  if (root && root.customElements && typeof root.HTMLElement === "function" && !root.customElements.get("wishkov-button")) {
    var WishkovButton = function () {
      return Reflect.construct(root.HTMLElement, [], WishkovButton);
    };
    WishkovButton.prototype = Object.create(root.HTMLElement.prototype, {
      constructor: { value: WishkovButton },
      connectedCallback: { value: function () { this.render(); } },
      attributeChangedCallback: { value: function () { if (this.isConnected) this.render(); } },
      render: {
        value: function () {
          this.innerHTML = buttonHtml({
            url: this.getAttribute("url") || root.location.href,
            label: this.getAttribute("label"),
            size: this.getAttribute("size"),
            theme: this.getAttribute("theme"),
            iconOnly: this.hasAttribute("icon-only"),
            ref: this.getAttribute("ref"),
          });
        },
      },
    });
    Object.defineProperty(WishkovButton, "observedAttributes", {
      get: function () { return ["url", "label", "size", "theme", "icon-only", "ref"]; },
    });
    root.customElements.define("wishkov-button", WishkovButton);
  }
})(typeof window !== "undefined" ? window : null);
