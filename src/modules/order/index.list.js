// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import { NewButton, ExportButton } from 'components/Buttons';
import OrderList from './list';
import messages from './messages';
import { ordersExportQuery } from './query';

type Props = {
  intl: IntlShape,
};

function OrderModule(props: Props) {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.poSort), value: 'poNo' },
    { title: intl.formatMessage(messages.piSort), value: 'piNo' },
    { title: intl.formatMessage(messages.date), value: 'issuedAt' },
    { title: intl.formatMessage(messages.exporterName), value: 'exporterName' },
    { title: intl.formatMessage(messages.currency), value: 'currency' },
    { title: intl.formatMessage(messages.incoterm), value: 'incoterm' },
    { title: intl.formatMessage(messages.deliveryPlace), value: 'deliveryPlace' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    {
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
    },
    'filterOrder'
  );

  const { hasPermission } = usePermission();

  return (
    <Content>
      <NavBar>
        <FilterToolBar
          icon="ORDER"
          subIcon="CARDS"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          canArchive
          canSearch
        />
        {hasPermission(ORDER_CREATE) && (
          <Link to="/order/new">
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
      <OrderList {...queryVariables} />
    </Content>
  );
}

export default injectIntl(OrderModule);
