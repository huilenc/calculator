export function isTiltInteractiveTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el?.closest) return false;
  return Boolean(
    el.closest("button") ||
    el.closest("[data-calc-display]") ||
    el.closest("input") ||
    el.closest("textarea"),
  );
}
