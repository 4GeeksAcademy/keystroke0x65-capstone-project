/** Decorative barcode: the same bars for the same seed on every render (seeded Lehmer generator). */
export default function Barcode({ seed, width = 110, height = 22 }: { seed: number; width?: number; height?: number }) {
  let s = 31 + seed * 17;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const bars: Array<{ x: number; w: number }> = [];
  for (let x = 0; x < width - 2;) {
    const w = 1 + Math.floor(rnd() * 3);
    bars.push({ x, w });
    x += w + 1 + Math.floor(rnd() * 3);
  }
  return (
    <svg className="barcode" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {bars.map((b) => (
        <rect key={b.x} x={b.x} width={b.w} height={height} fill="#2B1D0E" />
      ))}
    </svg>
  );
}
