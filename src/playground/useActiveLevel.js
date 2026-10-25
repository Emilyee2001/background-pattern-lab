import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { mediaQuery } from '../export/breakpoints.js';

// 依視窗寬度回傳目前生效的 level：'default' 或已啟用斷點中最大的符合者
export function useActiveLevel(breakpointIds) {
  const key = breakpointIds.join(',');
  const ids = useMemo(() => (key ? key.split(',') : []), [key]);

  const subscribe = useCallback(
    (onChange) => {
      const lists = ids.map((id) => window.matchMedia(mediaQuery(id)));
      lists.forEach((list) => list.addEventListener('change', onChange));
      return () => lists.forEach((list) => list.removeEventListener('change', onChange));
    },
    [ids],
  );

  const getSnapshot = () =>
    ids.reduce((active, id) => (window.matchMedia(mediaQuery(id)).matches ? id : active), 'default');

  return useSyncExternalStore(subscribe, getSnapshot);
}
