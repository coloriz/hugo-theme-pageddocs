/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

"use strict";

const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
const getEffectiveTheme = () => {
  let theme = getPreferredTheme();
  if (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme = "dark";
  }
  return theme;
};

const setTheme = (theme, fireEvent = true) => {
  document.documentElement.setAttribute("data-bs-theme", theme);

  if (fireEvent) {
    document.documentElement.dispatchEvent(
      new CustomEvent("pd:theme-changed", {
        bubbles: true,
        cancelable: true,
        detail: theme,
      }),
    );
  }
};

const showActiveTheme = (theme, focus = false) => {
  const themeSwitcher = document.querySelector("#pd-theme");

  if (!themeSwitcher) {
    return;
  }

  const themeSwitcherText = document.querySelector("#pd-theme-text");
  const activeThemeIcon = document.querySelector(".theme-icon-active use");
  const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
  const svgOfActiveBtn = btnToActive.querySelector("svg use").getAttribute("href");

  for (const element of document.querySelectorAll("[data-bs-theme-value]")) {
    element.classList.remove("active");
    element.setAttribute("aria-pressed", "false");
  }

  btnToActive.classList.add("active");
  btnToActive.setAttribute("aria-pressed", "true");
  activeThemeIcon.setAttribute("href", svgOfActiveBtn);
  const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
  themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

  if (focus) {
    themeSwitcher.focus();
  }
};

(() => {
  for (const toggle of document.querySelectorAll("[data-bs-theme-value]")) {
    toggle.addEventListener("click", () => {
      const theme = toggle.getAttribute("data-bs-theme-value");
      setStoredTheme(theme);
      showActiveTheme(theme, true);
      setTheme(getEffectiveTheme());
    });
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const storedTheme = getStoredTheme();
    if (storedTheme && storedTheme !== "auto") {
      return;
    }
    setTheme(getEffectiveTheme());
  });

  const theme = getPreferredTheme();
  showActiveTheme(theme);
  setTheme(getEffectiveTheme(), false);
})();

export { getEffectiveTheme, setTheme };
