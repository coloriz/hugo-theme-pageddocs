"use strict";

import { instance } from "@viz-js/viz";
import { check } from "@softwaretechnik/dbml-renderer/lib/checker";
import { parse } from "@softwaretechnik/dbml-renderer/lib/parser";

import { DbmlRenderer } from "./dbml-renderer";

const render = async () => {
  const viz = await instance();

  for (const node of document.querySelectorAll(".language-dbml")) {
    const dot = check(parse(node.dataset.pdCode));
    const dbml = new DbmlRenderer(dot);
    const svg = viz.renderSVGElement(dbml.toDot(), { engine: "dot" });
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    node.appendChild(svg);
  }
};

(async () => {
  await render();
})();
