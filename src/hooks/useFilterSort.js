// @flow
import * as React from 'react';
import { useAuthenticated } from 'contexts/Viewer';

type FilterSort = {
  query: string,
  filterBy: { [string]: any },
  sortBy: { [string]: 'ASCENDING' | 'DESCENDING' },
  setQuery: string => void,
  setFilterBy: ({ [string]: any }) => void,
  setSortBy: ({ [string]: 'ASCENDING' | 'DESCENDING' }) => void,
};

type FilterSortCache = {
  filterBy: { [string]: any },
  sortBy: { [string]: 'ASCENDING' | 'DESCENDING' },
};

const KEY_PREFIX = 'zenport_filter_sort';

function getFilterSortCache(key: string): FilterSortCache | null {
  const result = window.localStorage.getItem(`${KEY_PREFIX}_${key}`);
  if (!result) {
    return null;
  }

  try {
    const value = JSON.parse(atob(result));
    const { filterBy = {}, sortBy = {} } = value;
    return { filterBy, sortBy };
  } catch (e) {
    return null;
  }
}

function setFilterSortCache(key: string, { filterBy, sortBy }: FilterSortCache) {
  window.localStorage.setItem(`${KEY_PREFIX}_${key}`, btoa(JSON.stringify({ filterBy, sortBy })));
}

export function useFilterSortInvalidator() {
  const { authenticated } = useAuthenticated();

  React.useEffect(() => {
    if (authenticated) {
      return;
    }

    const cacheKeys = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < window.localStorage.length; i++) {
      if (window.localStorage.key(i).indexOf(KEY_PREFIX) === 0) {
        cacheKeys.push(window.localStorage.key(i));
      }
    }

    cacheKeys.forEach(window.localStorage.removeItem);
  }, [authenticated]);
}

export default function useFilterSort(
  initialFilterBy: { [string]: any },
  initialSortBy: { [string]: 'ASCENDING' | 'DESCENDING' },
  cacheKey: ?string = null
): FilterSort {
  const [filterBy, setFilterBy] = React.useState<{ [string]: any } | null>(null);
  const [sortBy, setSortBy] = React.useState<{ [string]: 'ASCENDING' | 'DESCENDING' } | null>(null);

  function getFilterBy() {
    if (!filterBy) {
      if (cacheKey) {
        const cache = getFilterSortCache(cacheKey);
        if (cache) {
          setFilterBy(cache.filterBy);
          return cache.filterBy;
        }
      }

      setFilterBy(initialFilterBy);
      return initialFilterBy;
    }

    return filterBy;
  }

  function getSortBy() {
    if (!sortBy) {
      if (cacheKey) {
        const cache = getFilterSortCache(cacheKey);
        if (cache) {
          setSortBy(cache.sortBy);
          return cache.sortBy;
        }
      }

      setSortBy(initialSortBy);
      return initialSortBy;
    }

    return sortBy;
  }

  React.useEffect(() => {
    if (!cacheKey) {
      return;
    }

    const { query, ...cachableFilterBy } = filterBy;
    setFilterSortCache(cacheKey, { filterBy: cachableFilterBy, sortBy });
  }, [filterBy, sortBy, cacheKey]);

  const currentFilterBy = getFilterBy();
  const [query, filterByWithoutQuery] = React.useMemo(() => {
    const { query: q = '', ...rest } = currentFilterBy;
    return [q, rest];
  }, [currentFilterBy]);

  const setQuery = React.useCallback(
    (value: string) => {
      setFilterBy({
        ...filterBy,
        query: value,
      });
    },
    [filterBy, setFilterBy]
  );
  const setFilterByWithoutQuery = React.useCallback(
    (value: { [string]: any }) => {
      setFilterBy({
        ...value,
        query,
      });
    },
    [query]
  );

  return {
    query,
    filterBy: filterByWithoutQuery,
    sortBy: getSortBy(),
    setQuery,
    setFilterBy: setFilterByWithoutQuery,
    setSortBy,
  };
}