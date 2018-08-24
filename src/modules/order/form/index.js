// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { pickByProps } from 'utils/fp';
import logger from 'utils/logger';
import messages from 'modules/order/messages';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import Display from 'components/Display';
import OrderSection from './components/OrderSection';
import ItemSection from './components/ItemSection';
import DocumentSection from './components/DocumentSection';
import ShipmentSection from './components/ShipmentSection';
import SectionHeader from './components/SectionHeader';
import { OrderFormConsumer } from './provider';
import {
  OrderFormWrapperStyle,
  SectionWrapperStyle,
  LastModifiedWrapperStyle,
  ToggleButtonStyle,
  StatusStyle,
  UserIconStyle,
} from './style';

type Props = {
  order: Object,
  onChange: ({ observeValues: Object, onValidate: Object => Promise<Object> }) => mixed,
};

const orderSectionFields = pickByProps([
  'piNo',
  'poNo',
  'exporter',
  'deliveryPlace',
  'issuedAt',
  'currency',
  'incoterm',
  'totalPrice',
  'batchedQuantity',
  'shippedQuantity',
  'items',
]);

const hasSelectExporter = (order: Object) =>
  (order.exporter && order.exporter.id) || order.exporterId;

export default function OrderForm({ order, onChange }: Props) {
  const isNew = Object.keys(order).length === 0;
  logger.warn('order', order);
  const orderValues = orderSectionFields(order);

  return (
    <div className={OrderFormWrapperStyle}>
      <div className={SectionWrapperStyle} id="orderSection">
        <SectionHeader icon="ORDER" title="ORDER">
          {!isNew && (
            <React.Fragment>
              <div className={LastModifiedWrapperStyle}>
                <Display title={<FormattedMessage {...messages.updatedAt} />}>
                  <FormattedDate value={new Date(order.updatedAt)} />
                </Display>
                <div className={UserIconStyle}>
                  <UserAvatar profileUrl="" />
                </div>
              </div>

              <div className={StatusStyle(order.archived)}>
                <Icon icon={order.archived ? 'ARCHIVED' : 'ACTIVE'} />
                {order.archived ? 'Archived' : 'Active'}
                <button
                  type="button"
                  className={ToggleButtonStyle}
                  tabIndex={-1}
                  onClick={() => {}}
                >
                  {order.archived ? <Icon icon="TOGGLE_OFF" /> : <Icon icon="TOGGLE_ON" />}
                </button>
              </div>
            </React.Fragment>
          )}
        </SectionHeader>
        <OrderSection
          id="orderSection"
          isNew={isNew}
          onChange={onChange}
          initialValues={{ ...orderValues }}
        />
      </div>
      <div className={SectionWrapperStyle} id="itemSection">
        <OrderFormConsumer>
          {formState => (
            <React.Fragment>
              <SectionHeader
                icon="ORDER_ITEM"
                title={`ITEMS (${formState.formData.items.length})`}
              />
              <ItemSection
                isReady={hasSelectExporter(order) || hasSelectExporter(formState.formData)}
              />
            </React.Fragment>
          )}
        </OrderFormConsumer>
      </div>
      <div className={SectionWrapperStyle} id="documentSection">
        <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${2})`} />
        <DocumentSection initialValues={{ files: order.files }} />
      </div>
      <div className={SectionWrapperStyle} id="shipmentSection">
        <SectionHeader icon="SHIPMENT" title={`SHIPMENTS (${20})`} />
        <ShipmentSection />
      </div>
    </div>
  );
}
