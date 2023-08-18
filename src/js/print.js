import { Previewer } from "pagedjs";

import { setTheme } from "./color-modes";
import { render } from "./mermaid";

(() => {
  "use strict";

  // Preview
  const previewer = new Previewer();

  document.querySelector("#pd-print").addEventListener("click", async () => {
    setTheme("print", false);
    await render("neutral");

    const template = document.createElement("template");
    template.dataset.ref = "pagedjs-content";
    template.innerHTML = document.querySelector("#pd-content").outerHTML;
    document.body.innerHTML = "";
    document.body.appendChild(template);

    await previewer.preview(template.content, undefined, document.body);
  });
})();
