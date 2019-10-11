// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { ExpandRows, Entities, FocusedView } from 'modules/relationMapV2/store';
import { ExpandButtonStyle } from './style';

export default function ExpandButton() {
  const { selectors } = FocusedView.useContainer();
  const { expandRows, setExpandRows } = ExpandRows.useContainer();
  const { mapping } = Entities.useContainer();
  const orderIds = Object.keys(mapping.entities?.orders ?? {}).filter(
    id => mapping.entities?.orders?.[id]?.orderItemCount
  );
  const shipmentIds = Object.keys(mapping.entities?.shipments ?? {}).filter(
    id =>
      mapping.entities?.shipments?.[id]?.containerCount ||
      mapping.entities?.shipments?.[id]?.batchCount
  );

  const allIsExpanded =
    expandRows.length > 0 && selectors.isShipmentFocus
      ? shipmentIds.length > 0 && expandRows.length === shipmentIds.length
      : orderIds.length > 0 && expandRows.length === orderIds.length;

  return (
    <Tooltip
      delay={1000}
      message={
        allIsExpanded ? (
          <FormattedMessage
            id="components.button.collapseTooltip"
            defaultMessage="Collapse all Orders"
          />
        ) : (
          <FormattedMessage
            id="components.button.expandTooltip"
            defaultMessage="Expand all Orders"
          />
        )
      }
    >
      <button
        onClick={() => {
          if (allIsExpanded) {
            setExpandRows([]);
          } else {
            setExpandRows(selectors.isShipmentFocus ? shipmentIds : orderIds);
          }
        }}
        className={ExpandButtonStyle(allIsExpanded)}
        type="button"
      >
        <Icon icon={allIsExpanded ? 'COMPRESS' : 'EXPAND'} />
      </button>
    </Tooltip>
  );
}
