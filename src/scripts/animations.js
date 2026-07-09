import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/**
 * Fades + lifts any [data-reveal] element into place as it enters the
 * viewport. Groups sharing [data-reveal-group="x"] stagger together.
 */
export function initReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  const groups = new Map();

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const groupKey = el.getAttribute("data-reveal-group") || el;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(el);
  });

  groups.forEach((els) => {
    gsap.set(els, { opacity: 0, y: 28 });
    ScrollTrigger.batch(els, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        }),
    });
  });
}

/**
 * Splits a hero heading into per-line spans and reveals them on load
 * with a slight upward sweep — used once per page, above the fold.
 */
export function initHeroIntro(selector = "[data-hero-line]") {
  const lines = document.querySelectorAll(selector);
  if (!lines.length) return;

  if (prefersReducedMotion) {
    lines.forEach((l) => (l.style.opacity = "1"));
    return;
  }

  gsap.set(lines, { opacity: 0, y: 40 });
  gsap.to(lines, {
    opacity: 1,
    y: 0,
    duration: 1.1,
    ease: "power3.out",
    stagger: 0.09,
    delay: 0.15,
  });
}

/**
 * Ties a set of [data-ambient] sections to a CSS custom property on
 * <body> (--ambient) that shifts from 0 (dawn) to 1 (night) as the
 * reader scrolls past each one. Sections set their target via
 * data-ambient="0" .. "1". Pages consume --ambient in gradient CSS.
 */
export function initAmbientScroll() {
  const sections = gsap.utils.toArray("[data-ambient]");
  if (!sections.length) return;

  const root = document.documentElement;

  sections.forEach((section) => {
    const target = parseFloat(section.getAttribute("data-ambient"));
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => root.style.setProperty("--ambient", String(target)),
      onEnterBack: () => root.style.setProperty("--ambient", String(target)),
    });
  });
}

/** Simple parallax for [data-parallax="0.2"] elements. */
export function initParallax() {
  if (prefersReducedMotion) return;
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

/** Animated number count-up for stats, e.g. "12 rooms". */
export function initCounters() {
  gsap.utils.toArray("[data-count-to]").forEach((el) => {
    const to = parseFloat(el.getAttribute("data-count-to"));
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          val: to,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(obj.val).toString()),
        }),
    });
  });
}
