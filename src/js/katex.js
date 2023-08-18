import "katex/dist/katex.mjs";
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";

(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    renderMathInElement(document.body);
  });
})();
