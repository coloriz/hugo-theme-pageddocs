"use strict";

import mermaid from "mermaid/dist/mermaid.esm.min.mjs";

import { getEffectiveTheme } from "./color-modes";

const render = async (theme) => {
  mermaid.initialize({
    theme: theme,
    securityLevel: "loose",
    startOnLoad: false,
  });

  const nodes = Array.from(document.querySelectorAll(".language-mermaid"));
  await Promise.all(
    nodes.map(async (element, i) => {
      const { svg } = await mermaid.render(`mermaid-${i}`, element.dataset.pdMermaid);
      element.innerHTML = svg;
    }),
  );
};

(async () => {
  const getMermaidTheme = (theme) => {
    switch (theme) {
      case "dark":
        return "dark";
      default:
        return "default";
    }
  };

  document.documentElement.addEventListener("pd:theme-changed", async (event) => {
    await render(getMermaidTheme(event.detail));
  });

  await render(getMermaidTheme(getEffectiveTheme()));
})();

export { render };
