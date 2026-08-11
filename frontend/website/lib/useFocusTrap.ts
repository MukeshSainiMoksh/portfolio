"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Keeps Tab focus inside an open overlay and returns focus where it came
 * from on close.
 *
 * Without this, tabbing out of a modal walks invisibly through the page
 * behind it — the dialog looks open but the keyboard is somewhere else.
 *
 * @param ref    the overlay container
 * @param active whether the overlay is open
 * @param onEscape optional Escape handler, wired here so every overlay
 *                 behaves the same way
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void
) {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );

    // Move focus in, but don't steal it if something inside already has it.
    if (!node.contains(document.activeElement)) {
      const first = focusable()[0];
      (first ?? node).focus?.();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (current === first || !node.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // only restore if focus is still inside the overlay being torn down
      if (node.contains(document.activeElement) || document.activeElement === document.body) {
        previouslyFocused?.focus?.();
      }
    };
  }, [ref, active, onEscape]);
}
