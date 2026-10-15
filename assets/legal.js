// Páginas legais: idioma (?lang= ou o escolhido no site) e tema guardado pelo site
(function () {
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  root.setAttribute("data-theme", store.get("mg-theme") || "dark");

  var param = new URLSearchParams(location.search).get("lang");
  var lang = param === "en" || param === "pt" ? param : store.get("mg-lang") === "en" ? "en" : "pt";

  function apply(next) {
    lang = next;
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "en" ? "en" : "pt-PT");
    var title = document.querySelector('meta[name="title-' + lang + '"]');
    if (title) document.title = title.content;
    document.querySelectorAll(".legal-lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
  }

  apply(lang);
  document.addEventListener("DOMContentLoaded", function () {
    apply(lang);
    document.querySelectorAll(".legal-lang button").forEach(function (b) {
      b.addEventListener("click", function () { store.set("mg-lang", b.dataset.lang); apply(b.dataset.lang); });
    });
  });
})();
