// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { pickByProps } from 'utils/fp';
import messages from 'modules/order/messages';
import Icon from 'components/Icon';
import { SectionHeader, LastModified } from 'components/Form';
import OrderFormContainer from './container';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import {
  OrderFormWrapperStyle,
  SectionWrapperStyle,
  ToggleButtonStyle,
  StatusStyle,
} from './style';

type Props = {
  order: Object,
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
  'orderItems',
]);
const itemSectionFields = pickByProps(['exporter', 'orderItems']);

export default function OrderForm({ order }: Props) {
  const isNew = Object.keys(order).length === 0;
  const orderValues = orderSectionFields(order);

  return (
    <div className={OrderFormWrapperStyle}>
      <div className={SectionWrapperStyle} id="orderSection">
        <SectionHeader icon="ORDER" title="ORDER">
          {!isNew && (
            <>
              <LastModified updatedAt={order.updatedAt} />

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
            </>
          )}
        </SectionHeader>
        <OrderSection isNew={isNew} initialValues={{ ...orderValues }} />
      </div>
      <div className={SectionWrapperStyle} id="itemsSection">
        <Subscribe to={[OrderFormContainer]}>
          {({ state: values, setFieldValue }) => (
            <>
              <SectionHeader icon="ORDER_ITEM" title={`ITEMS (${values.orderItems.length})`} />
              <ItemsSection
                initialValues={{ ...itemSectionFields(values) }}
                isNew={isNew}
                onSelectItems={orderItems => setFieldValue('orderItems', orderItems)}
              />
            </>
          )}
        </Subscribe>
      </div>
      <div className={SectionWrapperStyle} id="documentsSection">
        <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${2})`} />
        <DocumentsSection initialValues={{ files: order.files }} />
      </div>
      <div className={SectionWrapperStyle} id="shipmentsSection">
        <SectionHeader icon="SHIPMENT" title={`SHIPMENTS (${20})`} />
        <ShipmentsSection />
      </div>
    </div>
  );
}
