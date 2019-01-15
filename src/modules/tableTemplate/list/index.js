// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import TableTemplateGridView from './TableTemplateGridView';
import { tableTemplateQuery } from './query';

type Props = {
  viewType: string,
  filterBy: {
    type: string,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

class TableTemplateList extends React.Component<Props> {
  render() {
    const { viewType, ...filtersAndSort } = this.props;

    return (
      <Query
        query={tableTemplateQuery}
        variables={{
          page: 1,
          ...filtersAndSort,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error, refetch }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, `maskEdits.page`, data) + 1;
          const totalPage = getByPathWithDefault(1, `maskEdits.totalPage`, data);
          const hasMore = nextPage <= totalPage;

          emitter.once('RELOAD_TEMPLATE', () => {
            refetch();
          });

          return (
            <TableTemplateGridView
              items={getByPathWithDefault([], 'maskEdits.nodes', data)}
              onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'maskEdits')}
              hasMore={hasMore}
              isLoading={loading}
            />
          );
        }}
      </Query>
    );
  }
}

export default TableTemplateList;
