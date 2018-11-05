// @flow
import * as React from 'react';
import loadMoreUtil from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';

type Props = {
  loading: boolean,
  data: any,
  fetchMore: Function,
  model: string,
  children: Function,
  error?: Object,
  onChangePage?: Function,
};

// TODO: how to send the filter and sort
const QueryHandler = ({
  loading,
  data,
  fetchMore,
  model,
  children,
  error,
  onChangePage,
}: Props) => {
  if (error) {
    return error.message;
  }
  if (loading) {
    return <LoadingIcon />;
  }
  const nodes = getByPathWithDefault(null, `${model}.nodes`, data);
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  const hasMore: boolean = nextPage <= totalPage;
  const loadMore = () => {
    loadMoreUtil({ fetchMore, data }, {}, model);
    if (onChangePage) {
      onChangePage(nextPage);
    }
  };
  // Save on local storage for table inline edit
  window.localStorage.setItem(model, JSON.stringify(nodes));
  return children({ nodes, hasMore, loadMore, nextPage });
};

export default QueryHandler;
