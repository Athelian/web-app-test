// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import SlideView from 'components/SlideView';
import { UIConsumer } from 'modules/ui';
import TemplateFormWrapper from 'modules/tableTemplate/common/TemplateFormWrapper';
import Layout from 'components/Layout';
import Icon from 'components/Icon';
import FilterToolBar from 'components/common/FilterToolBar';
import NavBar, { EntityIcon } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import TableTemplateList from './list';
import messages from './messages';
import { HeaderIconStyle } from './style';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: {
    type: string,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
  page: number,
};

class TableTemplateModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    filter: {
      type: 'Order',
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

    const sortFields = [
      { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
      { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    ];
    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Layout
              {...uiState}
              navBar={
                <NavBar>
                  <EntityIcon icon="METADATA" color="METADATA" />
                  <FilterToolBar
                    icon="ORDER"
                    renderIcon={icon => (
                      <div className={HeaderIconStyle}>
                        <Icon icon={icon} />
                        <FormattedMessage
                          id="modules.TableTemplates.orderFocus"
                          defaultMessage="ORDER FOCUS"
                        />
                      </div>
                    )}
                    sortFields={sortFields}
                    filtersAndSort={this.state}
                    onChange={this.onChangeFilter}
                  />
                  <BooleanValue>
                    {({ value: isOpen, set: toggle }) => (
                      <>
                        <NewButton onClick={() => toggle(true)} />
                        <SlideView
                          isOpen={isOpen}
                          onRequestClose={() => toggle(false)}
                          options={{ width: '1030px' }}
                        >
                          {isOpen && (
                            <TemplateFormWrapper
                              template={{}}
                              isNew
                              onCancel={() => toggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                </NavBar>
              }
            >
              <TableTemplateList {...this.state} />
            </Layout>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}

export default injectIntl(TableTemplateModule);
