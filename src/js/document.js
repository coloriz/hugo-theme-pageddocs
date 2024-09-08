"use strict";

const createHeadingTree = (content) => {
  const rootHeading = content.querySelector("h1");
  const headingTree = {
    id: rootHeading.id,
    title: rootHeading.textContent.trim(),
    level: 0,
    sectionNumber: "0",
    children: [],
  };
  const headingLevels = [];
  let prevLevel = 0;
  let prevNode = headingTree;

  for (const heading of content.querySelectorAll("h2, h3, h4, h5, h6")) {
    const level = Number.parseInt(heading.tagName.slice(-1)) - 1;

    const node = {
      id: heading.id,
      title: heading.textContent.trim(),
      level: level,
      sectionNumber: heading.dataset.pdSectionNumber,
      children: [],
    };

    if (level > prevLevel) {
      headingLevels.push(prevNode);
    } else if (level < prevLevel) {
      for (let i = 0; i < prevLevel - level; i++) {
        headingLevels.pop();
      }
    }

    headingLevels[headingLevels.length - 1].children.push(node);
    prevLevel = level;
    prevNode = node;
  }

  return headingTree;
};

const createSidebarToC = (headings, maxLevel) => {
  const ul = document.createElement("ul");

  for (const heading of headings) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");

    anchor.href = `#${heading.id}`;
    anchor.textContent = heading.title;
    li.appendChild(anchor);

    if (heading.level <= maxLevel && heading.children.length > 0) {
      li.append(createSidebarToC(heading.children, heading.level));
    }

    ul.appendChild(li);
  }

  return ul;
};

const addPageToCElements = (elements, headings, maxLevel) => {
  for (const heading of headings) {
    const li = document.createElement("li");
    li.dataset.pdLevel = heading.level;
    li.dataset.pdSectionNumber = heading.sectionNumber;

    const anchor = document.createElement("a");
    anchor.href = `#${heading.id}`;
    anchor.textContent = heading.title;
    li.append(anchor);

    elements.push(li);

    if (heading.level <= maxLevel && heading.children.length > 0) {
      addPageToCElements(elements, heading.children);
    }
  }
};

const createPageToC = (headings, maxLevel) => {
  const ul = document.createElement("ul");

  const elements = [];
  addPageToCElements(elements, headings, maxLevel);

  for (const element of elements) {
    ul.appendChild(element);
  }

  return ul;
};

(() => {
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

  // Create headings tree
  const headingTree = createHeadingTree(content);

  // Create sidebar ToC
  const sidebarToC = createSidebarToC(headingTree.children, 2);
  document.querySelector("#TableOfContents").innerHTML = sidebarToC.outerHTML;

  // Create page ToC
  const pageToCContent = document.querySelector("#pd-toc-page-content");
  if (pageToCContent) {
    const pageToC = createPageToC(headingTree.children, 2);
    pageToCContent.innerHTML = pageToC.outerHTML;
  }
})();
