import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './router.mjs';
import './updateHeader.mjs'
import { router } from './router.mjs';  

if (!window.__dataRouteDelegated) {
  window.__dataRouteDelegated = true;

  const tryScrollTo = (hash, maxAttempts = 20, interval = 100) => {
    if (!hash) return;
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    let attempts = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts++;
      if (attempts < maxAttempts) setTimeout(tick, interval);
      };
    tick();
  };

  document.addEventListener("click", async (e) => {
    const link = e.target.closest("[data-route]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) {
      e.preventDefault();
      tryScrollTo(href);
      return;
    }

    const [pathPart, hashPart] = href.split("#");
    if (window.location.pathname === pathPart) {
      e.preventDefault();
      if (hashPart) tryScrollTo("#" + hashPart);
      if (window.updateActiveLinkGlobal) window.updateActiveLinkGlobal();
      return;
    }
    e.preventDefault();
    if (link.disabled) return;
    link.disabled = true;
    try {
      await router.navigate(pathPart);
      if (window.updateActiveLinkGlobal) window.updateActiveLinkGlobal();
      if (hashPart) tryScrollTo("#" + hashPart);
    } finally {
      setTimeout(() => (link.disabled = false), 300);
    }
  });

  window.addEventListener("popstate", () => {
    const hash = window.location.hash;
    if (hash) tryScrollTo(hash);
    if (window.updateActiveLinkGlobal) window.updateActiveLinkGlobal();
  });

  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (hash) tryScrollTo(hash);
  });

  window.updateActiveLinkGlobal = () => {
    const currentPath = window.location.pathname;

    document.querySelectorAll("[data-route]").forEach(link => {
      const linkPath = (link.getAttribute("href") || "").split("#")[0];
      link.classList.toggle("active", linkPath === currentPath);
    });
  };

  window.updateActiveLinkGlobal();    
}