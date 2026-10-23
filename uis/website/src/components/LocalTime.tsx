import { useEffect, useState } from 'react';

const format = (tz: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date());
  } catch {
    return '';
  }
};

/** The office's current local time, refreshed every 30 seconds. */
export default function LocalTime({ tz }: { tz: string }) {
  const [now, setNow] = useState('\u00a0');
  useEffect(() => {
    setNow(format(tz));
    const id = setInterval(() => setNow(format(tz)), 30_000);
    return () => clearInterval(id);
  }, [tz]);
  return <time data-tz={tz}>{now}</time>;
}
