// @flow

import * as React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import useDebounce from 'hooks/useDebounce';
import { reduceTagsByName } from 'utils/tags';

type Props = {
  tagType: string,
  organizationIds?: string[],
  queryString?: string,
  includeAllShared?: boolean,
  hasIntegratedTags?: boolean,
  query?: any,
};

const requeryThreshold = 100;

const useTagList = ({
  tagType,
  organizationIds,
  queryString,
  hasIntegratedTags = false,
  includeAllShared = false,
  query,
}: Props) => {
  const isMounted = React.useRef(true);
  const debouncedQueryString = useDebounce(queryString, 100);

  const [pageSettings, setPageSettings] = React.useState({
    page: 1,
    perPage: 100,
  });

  const queryStringRef = React.useRef(queryString);
  const tagDataRef = React.useRef({});

  const [totalPages, setTotalPages] = React.useState(0);

  const variables = {
    ...pageSettings,
    sortBy: {
      name: 'ASCENDING',
    },
    filterBy: {
      query: debouncedQueryString || '',
      entityTypes: Array.isArray(tagType) ? tagType : [tagType],
      organizationIds: organizationIds ?? [],
      includeAllShared,
    },
  };

  const [getTags, { data, loading }] = useLazyQuery(query, {
    variables,
    fetchPolicy: 'network-only',
    onCompleted: newData => {
      const value = newData?.tags;
      setTotalPages(value.totalPage);
    },
  });

  const [tagData, setTagData] = React.useState([]);

  // empty tag data if query string changes
  React.useEffect(() => {
    if (queryStringRef.current !== queryString) {
      setTagData([]);
      queryStringRef.current = queryString;
      tagDataRef.current = {};
    }
  }, [queryString]);

  React.useEffect(() => {
    if (!data || loading) {
      return;
    }

    if (hasIntegratedTags) {
      const newTagsByName = reduceTagsByName(data?.tags?.nodes ?? []);

      tagDataRef.current = {
        ...tagDataRef.current,
        ...newTagsByName,
      };
    } else {
      const newTagsById = (data?.tags?.nodes ?? []).reduce((arr, tag) => {
        if (!tag?.id) {
          return arr;
        }

        // eslint-disable-next-line
        arr[tag.id] = tag;

        return arr;
      }, {});

      tagDataRef.current = {
        ...tagDataRef.current,
        ...newTagsById,
      };
    }

    setTagData(Object.values(tagDataRef.current));
  }, [data, loading, hasIntegratedTags]);

  React.useEffect(() => {
    if (
      (isMounted.current && totalPages === 0) ||
      (pageSettings.page !== 1 && totalPages > 0 && pageSettings.page <= totalPages)
    ) {
      getTags();
    }

    return () => {
      isMounted.current = false;
    };
  }, [debouncedQueryString, getTags, totalPages, pageSettings]);

  const onScroll = React.useCallback(
    ({ event, scrollHeight, scrollTop, clientHeight }: Object) => {
      if (
        !event?.target &&
        (Number.isNaN(scrollHeight) || Number.isNaN(scrollTop) || Number.isNaN(clientHeight))
      ) {
        return;
      }

      let nearTheBottom = false;

      if (event) {
        nearTheBottom =
          event.target.scrollHeight - event.target.scrollTop <=
          event.target.clientHeight + requeryThreshold;
      } else {
        nearTheBottom = scrollHeight - scrollTop <= clientHeight + requeryThreshold;
      }

      if (!loading && pageSettings.page < totalPages && nearTheBottom) {
        setPageSettings(oldSettings => {
          return {
            ...oldSettings,
            page: oldSettings.page + 1,
          };
        });
      }
    },
    [loading, pageSettings.page, totalPages]
  );

  return {
    tags: tagData,
    loading,
    onScroll,
  };
};

export default useTagList;