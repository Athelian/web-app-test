// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { TEMPLATE_CREATE } from 'modules/permission/constants/template';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import TemplateFormWrapper from 'modules/tableTemplate/common/TemplateFormWrapper';
import Portal from 'components/Portal';
import FilterToolBar from 'components/common/FilterToolBar';
import { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';
import useFilter from 'hooks/useFilter';
import TableTemplateList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const getInitFilter = {
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

const TableTemplateModule = (props: Props) => {
  const { filterAndSort: filtersAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter,
    'filterTableTemplate'
  );
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(TEMPLATE_CREATE);
  return (
    <Provider>
      <>
        <Portal>
          <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
          <TabItem
            active
            label={
              <FormattedMessage
                id="modules.TableTemplates.orderFocus"
                defaultMessage="ORDER FOCUS"
              />
            }
            icon="ORDER"
          />
          <FilterToolBar
            sortFields={sortFields}
            filtersAndSort={filtersAndSort}
            onChange={onChangeFilter}
          />

          <BooleanValue>
            {({ value: isOpen, set: toggle }) => (
              <>
                {canCreate && <NewButton onClick={() => toggle(true)} />}
                <SlideView isOpen={isOpen} onRequestClose={() => toggle(false)}>
                  {isOpen && (
                    <TemplateFormWrapper template={{}} isNew onCancel={() => toggle(false)} />
                  )}
                </SlideView>
              </>
            )}
          </BooleanValue>
        </Portal>
        <TableTemplateList {...queryVariables} />
      </>
    </Provider>
  );
};

export default injectIntl(TableTemplateModule);
