// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import OrderList from './list';
import messages from './messages';
import { ordersExportQuery } from './query';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filterBy: {
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

class OrderModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    filterBy: {
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

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { intl } = this.props;
    const { filterBy, sort } = this.state;

    const sortFields = [
      { title: intl.formatMessage(messages.poSort), value: 'poNo' },
      { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
      { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <FilterToolBar
                  icon="ORDER"
                  sortFields={sortFields}
                  filtersAndSort={{ ...this.state, filter: filterBy }}
                  onChange={this.onChangeFilter}
                />
                <ExportButton
                  type="Orders"
                  exportQuery={ordersExportQuery}
                  variables={{
                    filterBy,
                    sortBy: {
                      [sort.field]: sort.direction,
                    },
                  }}
                />
                <Link to="new">
                  <NewButton />
                </Link>
              </NavBar>
            }
          >
            <OrderList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(OrderModule);
