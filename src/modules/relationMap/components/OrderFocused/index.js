// @flow
import React from 'react';
import { BooleanValue, createObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { generateOrderRelation } from 'modules/relationMap/util';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from 'modules/relationMap/style';
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

const OrderFocused = ({ order, shipment, nodes, hasMore, loadMore }: Props) => (
  <>
    <RelationView
      className={OrderMapWrapperStyle}
      items={nodes}
      itemWidth={200}
      isEmpty={nodes.length === 0}
      spacing={0}
      emptyMessage="No orders found"
      hasMore={hasMore}
      onLoadMore={loadMore}
      render={({ item }) => (
        <BooleanValue defaultValue key={item.id}>
          {({ value: isCollapsed, toggle }) => {
            const relations = generateOrderRelation(item, { isCollapsed });
            return relations.map((relation, relationIndex) => {
              const key = `relation-${relationIndex}`;
              let itemData;
              switch (relation.type) {
                case 'ORDER_ITEM_ALL':
                case 'BATCH_ALL':
                case 'ORDER':
                  itemData = order.orderObj[relation.id];
                  break;
                case 'ORDER_HEADER':
                  itemData = { id: item.id };
                  break;
                case 'ORDER_ITEM':
                  itemData = order.orderItemObj[relation.id];
                  break;
                case 'BATCH':
                  itemData = order.batchObj[relation.id];
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
                          onMouseLeave={reset}
                          onMouseEnter={() => setItem(item.id, true)}
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
    <div className={ScrollWrapperStyle}>
      {Object.keys(shipment).map(shipmentId => {
        const currentShipment = shipment[shipmentId];
        const shipmentRefs = Object.keys(currentShipment.refs);
        return (
          <ToggleSlide key={shipmentId}>
            {({ assign: setSlide }) => (
              <FocusedValue key={shipmentId}>
                {({ value: focusedItem, assign, reset }) => (
                  <div key={shipmentId}>
                    <Item
                      key={shipmentId}
                      type="SHIPMENT"
                      data={currentShipment.data}
                      isFocused={Boolean(
                        Object.keys(focusedItem || {}).some(focusId =>
                          shipmentRefs.some(orderId => orderId === focusId)
                        )
                      )}
                      onMouseLeave={reset}
                      onMouseEnter={() => assign(currentShipment.refs)}
                      onDoubleClick={() => {
                        setSlide({
                          show: true,
                          type: 'SHIPMENT',
                          id: shipmentId,
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
    <DetailFocused />
  </>
);

export default OrderFocused;
