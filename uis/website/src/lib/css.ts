import type { CSSProperties } from 'react';

/** Inline style that may carry CSS custom properties (e.g. `--c`), which React's CSSProperties type doesn't list. */
export const css = (s: Record<string, string | number>) => s as CSSProperties;
