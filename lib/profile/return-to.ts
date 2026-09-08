export function profileReturnTo(value: string | null, origin: string): string | null {
  if (!value || !/^\/(eventos|processos-seletivos)(\/|\?|#|$)/.test(value)) return null;
  try {
    const parsed = new URL(value, origin);
    return parsed.origin === origin && /^\/(eventos|processos-seletivos)(\/|$)/.test(parsed.pathname) ? `${parsed.pathname}${parsed.search}${parsed.hash}` : null;
  } catch { return null; }
}
