(() => {
  "use strict";

  const content = document.querySelector("#pd-content");

  if (!content || content.dataset.pdDocument !== "true") {
    return;
  }

  // Adjust heading levels
  for (const section of content.querySelectorAll("section[data-pd-level-offset]")) {
    const offset = Number.parseInt(section.dataset.pdLevelOffset);
    for (const heading of section.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
      const level = Number.parseInt(heading.tagName.slice(-1));
      const newLevel = Math.min(level + offset, 6);
      heading.outerHTML = heading.outerHTML.replaceAll(/(?<=^<h)[1-6]|(?<=<\/h)[1-6](?=>$)/gm, newLevel.toString());
    }
  }

  // Compute section numbers
  const headingCounters = [0, 0, 0, 0, 0];

  for (const heading of content.querySelectorAll("h2, h3, h4, h5, h6")) {
    const index = Number.parseInt(heading.tagName.slice(-1)) - 2;
    headingCounters[index]++;
    if (index < headingCounters.length - 1) {
      headingCounters.fill(0, index + 1);
    }
    heading.dataset.pdSectionNumber = headingCounters.slice(0, index + 1).join(".");
  }

  // Generate ToC manually
  const toc = document.createElement("ul");
  const startLevel = 2;
  const endLevel = 3;

  const tocLevels = [toc];
  let prevLevel = startLevel;

  for (const heading of content.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
    const level = Number.parseInt(heading.tagName.slice(-1));
    if (startLevel > level || level > endLevel) {
      continue;
    }

    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = `#${heading.id}`;
    anchor.textContent = heading.textContent;
    item.appendChild(anchor);

    if (level > prevLevel) {
      const ul = document.createElement("ul");
      tocLevels[tocLevels.length - 1].querySelector(":scope > li:last-child").appendChild(ul);
      tocLevels.push(ul);
    } else if (level < prevLevel) {
      for (let i = 0; i < prevLevel - level; i++) {
        tocLevels.pop();
      }
    }

    tocLevels[tocLevels.length - 1].appendChild(item);
    prevLevel = level;
  }

  document.querySelector("#TableOfContents").innerHTML = toc.outerHTML;
})();
