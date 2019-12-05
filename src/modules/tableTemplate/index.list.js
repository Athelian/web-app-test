// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { TEMPLATE_CREATE } from 'modules/permission/constants/template';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import TableTemplateFormWrapper from 'modules/tableTemplate/common/TableTemplateFormWrapper';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';
import useFilter from 'hooks/useFilter';
import TableTemplateList from './list';
import messages from './messages';

type Props = {
  intl: IntlShape,
};

const getInitFilter = (type: string) => ({
  viewType: 'grid',
  filter: {
    type,
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
  page: 1,
});

const TableTemplateModule = (props: Props) => {
  const { filterAndSort: filtersAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter('OrderSheet'),
    'filterTableTemplate'
  );
  const { intl } = props;
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(TEMPLATE_CREATE);
  const activeType = filtersAndSort.filter?.type;
  const setActiveType = (type: string) => onChangeFilter({ ...filtersAndSort, filter: { type } });

  return (
    <Provider>
      <Content>
        <NavBar>
          <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
          <TabItem
            active={activeType === 'OrderSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.orderSheet"
                defaultMessage="Order Table"
              />
            }
            icon="ORDER"
            onClick={() => {
              if (activeType !== 'OrderSheet') {
                setActiveType('OrderSheet');
              }
            }}
          />
          <TabItem
            active={activeType === 'BatchSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.batchSheet"
                defaultMessage="Batch Table"
              />
            }
            icon="BATCH"
            onClick={() => {
              if (activeType !== 'BatchSheet') {
                setActiveType('BatchSheet');
              }
            }}
          />
          <TabItem
            active={activeType === 'ShipmentSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.shipmentSheet"
                defaultMessage="Shipment Table"
              />
            }
            icon="SHIPMENT"
            onClick={() => {
              if (activeType !== 'ShipmentSheet') {
                setActiveType('ShipmentSheet');
              }
            }}
          />
          <TabItem
            active={activeType === 'ProjectSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.projectSheet"
                defaultMessage="Project Table"
              />
            }
            icon="PROJECT"
            onClick={() => {
              if (activeType !== 'ProjectSheet') {
                setActiveType('ProjectSheet');
              }
            }}
          />

          <FilterToolBar
            sortFields={sortFields}
            filtersAndSort={filtersAndSort}
            onChange={onChangeFilter}
            canSearch
          />

          {canCreate && (
            <BooleanValue>
              {({ value: isOpen, set: toggle }) => (
                <>
                  <NewButton onClick={() => toggle(true)} />

                  <SlideView
                    isOpen={isOpen}
                    onRequestClose={() => toggle(false)}
                    shouldConfirm={() => {
                      const button = document.getElementById('table_template_form_save_button');
                      return button;
                    }}
                  >
                    <TableTemplateFormContainer.Provider initialState={null}>
                      <TableTemplateFormWrapper isNew onCancel={() => toggle(false)} />
                    </TableTemplateFormContainer.Provider>
                  </SlideView>
                </>
              )}
            </BooleanValue>
          )}
        </NavBar>
        <TableTemplateList {...queryVariables} />
      </Content>
    </Provider>
  );
};

export default injectIntl(TableTemplateModule);
