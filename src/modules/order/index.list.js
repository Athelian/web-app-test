// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useListConfig from 'hooks/useListConfig';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import NoPermission from 'components/NoPermission';
import { PermissionConsumer } from 'modules/permission';
import OrderList from './list';
import messages from './messages';
import { ordersExportQuery } from './query';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: {
    query: string,
    archived: boolean,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
  page: number,
};

const getInitFilter = () => {
  const state: State = {
    viewType: 'grid',
    filter: {
      query: '',
      archived: false,
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};
function OrderModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.poSort), value: 'poNo' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useListConfig(
    getInitFilter(),
    'filterOrder'
  );
  return (
    <PermissionConsumer>
      {hasPermission =>
        hasPermission('order.orders.list') ? (
          <UIConsumer>
            {uiState => (
              <Layout
                {...uiState}
                navBar={
                  <NavBar>
                    <FilterToolBar
                      icon="ORDER"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
                    {hasPermission('order.orders.create') && (
                      <Link to="new">
                        <NewButton />
                      </Link>
                    )}
                    <ExportButton
                      type="Orders"
                      exportQuery={ordersExportQuery}
                      variables={{
                        filterBy: filterAndSort.filter,
                        sortBy: {
                          [filterAndSort.sort.field]: filterAndSort.sort.direction,
                        },
                      }}
                    />
                  </NavBar>
                }
              >
                <OrderList {...queryVariables} />
              </Layout>
            )}
          </UIConsumer>
        ) : (
          <NoPermission />
        )
      }
    </PermissionConsumer>
  );
}

export default injectIntl(OrderModule);
