// @flow
import React from 'react';
import { BooleanValue, createObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { generateShipmentRelation } from 'modules/relationMap/util';
import { LeftScrollWrapperStyle, ShipmentMapWrapperStyle } from 'modules/relationMap/style';
import OrderHeader from 'modules/relationMap/components/OrderElement/OrderHeader';
import RelationView from '../RelationView';
import Item from '../OrderElement';
import DetailFocused, { ToggleSlide } from '../DetailFocused';

const FocusedValue = createObjectValue(null);
type Props = {
  order: Object,
  shipment: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
};

const ShipmentFocused = ({ order, shipment, nodes, hasMore, loadMore }: Props) => (
  <>
    <div className={LeftScrollWrapperStyle}>
      {Object.keys(order).map(orderId => {
        const currentOrder = order[orderId];
        const orderRefs = Object.keys(currentOrder.refs);
        return (
          <ToggleSlide key={orderId}>
            {({ assign: setSlide }) => (
              <FocusedValue key={orderId}>
                {({ value: focusedItem, assign, reset }) => (
                  <div>
                    <OrderHeader label={`ORDER ${orderId}`} isChecked onToggle={() => {}} />
                    <Item
                      key={orderId}
                      type="ORDER"
                      data={shipment.orderObj[orderId]}
                      isFocused={Object.keys(focusedItem || {}).some(focusId =>
                        orderRefs.some(shipmentId => shipmentId === focusId)
                      )}
                      onMouseEnter={() => assign(currentOrder.refs)}
                      onMouseLeave={reset}
                      onDoubleClick={() => {
                        setSlide({
                          show: true,
                          type: 'ORDER',
                          id: orderId,
                        });
                      }}
                    />
                  </div>
                )}
              </FocusedValue>
            )}
          </ToggleSlide>
        );
      })}
    </div>
    <RelationView
      className={ShipmentMapWrapperStyle}
      items={nodes}
      itemWidth={200}
      isEmpty={nodes.length === 0}
      spacing={0}
      emptyMessage="No shipments found"
      hasMore={hasMore}
      onLoadMore={loadMore}
      render={({ item }) => (
        <BooleanValue defaultValue key={item.id}>
          {({ value: isCollapsed, toggle }) => {
            const relations = generateShipmentRelation(item, { isCollapsed });
            return relations.map((relation, relationIndex) => {
              const key = `relation-${relationIndex}`;
              let itemData;
              switch (relation.type) {
                case 'ORDER_HEADER':
                  itemData = { id: item.id };
                  break;
                case 'ORDER':
                  itemData = shipment.orderObj[relation.id];
                  break;
                case 'ORDER_ITEM':
                  itemData = shipment.orderItemObj[relation.id];
                  break;
                case 'BATCH':
                  itemData = shipment.batchObj[relation.id];
                  break;
                case 'ORDER_ITEM_ALL':
                case 'BATCH_ALL':
                  itemData = shipment.shipmentObj[relation.id];
                  break;
                case 'SHIPMENT':
                case 'SHIPMENT_ALL':
                  itemData = shipment.shipmentObj[relation.id].data;
                  break;
                default:
                  itemData = {};
                  break;
              }
              return (
                <ToggleSlide key={key}>
                  {({ assign: setSlide }) => (
                    <FocusedValue key={key}>
                      {({ value: focusedItem, set: setItem, reset }) => (
                        <Item
                          key={key}
                          type={relation.type}
                          isFocused={getByPathWithDefault(false, item.id, focusedItem)}
                          onMouseEnter={() => setItem(item.id, true)}
                          onMouseLeave={reset}
                          onClick={() => {
                            toggle();
                          }}
                          onDoubleClick={() => {
                            setSlide({
                              show: true,
                              type: relation.type,
                              id: relation.id,
                            });
                          }}
                          data={itemData}
                          isCollapsed={isCollapsed}
                        />
                      )}
                    </FocusedValue>
                  )}
                </ToggleSlide>
              );
            });
          }}
        </BooleanValue>
      )}
    />
    <DetailFocused />
  </>
);

export default ShipmentFocused;
