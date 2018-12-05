// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { createObjectValue } from 'react-values';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import messages from 'modules/relationMap/messages';
import { ToggleButtonStyle } from 'modules/relationMap/common/ToggleTag/style';
import Badge from './Badge';
import { ShipmentBadgeContainerStyle, ShipmentToggleContainerStyle } from './style';

type SummaryBadgeProps = {
  intl: IntlShape,
  summary: Object,
  targetedItem: Object,
  selectAll?: Function,
  unSelectAll?: Function,
};

export const ShipmentToggleValue = createObjectValue({ isToggle: false, total: 0 });

const isSelected = (selected, totalItem) => {
  const totalSelected = Object.keys(selected || {}).length;
  return totalItem === totalSelected;
};
const SummaryBadge = ({
  summary,
  intl,
  selectAll,
  unSelectAll,
  targetedItem,
}: SummaryBadgeProps) => {
  const { order, orderItem, batch, shipment } = targetedItem;
  const { sumOrders, sumOrderItems, sumBatches, sumShipments } = summary;
  const orderSelected = isSelected(order, sumOrders);
  const orderItemSelected = isSelected(orderItem, sumOrderItems);
  const batchSelected = isSelected(batch, sumBatches);
  const shipmentSelected = isSelected(shipment, sumShipments);
  return (
    <>
      <Badge
        icon="ORDER"
        color={orderSelected ? 'ORDER_DARK' : 'ORDER'}
        hoverColor="ORDER_DARK"
        label={intl.formatMessage(messages.ordersLabel)}
        no={<FormattedNumber value={sumOrders} />}
        onClick={() => {
          if (!orderSelected && selectAll) {
            selectAll('order');
          }
          if (orderSelected && unSelectAll) {
            unSelectAll('order');
          }
        }}
      />
      <Badge
        icon="ORDER_ITEM"
        color={orderItemSelected ? 'ORDER_ITEM_DARK' : 'ORDER_ITEM'}
        hoverColor="ORDER_ITEM_DARK"
        label={intl.formatMessage(messages.itemsLabel)}
        no={<FormattedNumber value={sumOrderItems} />}
        onClick={() => {
          if (!orderItemSelected && selectAll) {
            selectAll('orderItem');
          }
          if (orderItemSelected && unSelectAll) {
            unSelectAll('orderItem');
          }
        }}
      />

      <Badge
        icon="BATCH"
        color={batchSelected ? 'BATCH_DARK' : 'BATCH'}
        hoverColor="BATCH_DARK"
        label={intl.formatMessage(messages.batchesLabel)}
        no={<FormattedNumber value={sumBatches} />}
        onClick={() => {
          if (!batchSelected && selectAll) {
            selectAll('batch');
          }
          if (batchSelected && unSelectAll) {
            unSelectAll('batch');
          }
        }}
      />
      <ShipmentToggleValue>
        {({ value: { isToggle, total }, assign }) => (
          <div className={ShipmentBadgeContainerStyle}>
            <Badge
              icon="SHIPMENT"
              color={shipmentSelected ? 'SHIPMENT_DARK' : 'SHIPMENT'}
              hoverColor="SHIPMENT_DARK"
              label={intl.formatMessage(messages.shipmentsLabel)}
              no={<FormattedNumber value={sumShipments + total} />}
              onClick={() => {
                if (!shipmentSelected && selectAll) {
                  selectAll('shipment');
                }
                if (shipmentSelected && unSelectAll) {
                  unSelectAll('shipment');
                }
              }}
            />
            <div className={ShipmentToggleContainerStyle}>
              <Icon icon="SHIPMENT" />
              <Label color="TEAL">
                <FormattedMessage id="modules.RelationMaps.label.all" defaultMessage="All" />{' '}
                <FormattedMessage {...messages.shipmentsLabel} />
              </Label>
              <div>
                <button
                  type="button"
                  className={ToggleButtonStyle(isToggle)}
                  tabIndex={-1}
                  onClick={() =>
                    assign({
                      isToggle: !isToggle,
                      total: 0,
                    })
                  }
                >
                  <Icon icon={isToggle ? 'TOGGLE_ON' : 'TOGGLE_OFF'} />
                </button>
              </div>
            </div>
          </div>
        )}
      </ShipmentToggleValue>
    </>
  );
};
export default injectIntl(SummaryBadge);
