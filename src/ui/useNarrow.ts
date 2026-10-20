import { useEffect, useState } from 'react';

const QUERY = '(max-width: 640px)';

/** True on phone-width screens, where table layouts switch to fewer columns. */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(() => matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = matchMedia(QUERY);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}
