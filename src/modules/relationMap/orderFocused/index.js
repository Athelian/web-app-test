// @flow
import React from 'react';
import { BooleanValue, createObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { generateOrderRelation } from 'modules/relationMap/util';
import { ScrollWrapperStyle, OrderMapWrapperStyle } from 'modules/relationMap/style';
import RelationView from '../common/RelationView';
import DetailFocused, { ToggleSlide } from '../common/SlideForm';
import Item from '../common/RelationItem';

const FocusedValue = createObjectValue({ focusedItem: {}, shipmentId: '' });
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
                      {({ value: { focusedItem }, assign: setItem, reset }) => (
                        <Item
                          key={key}
                          type={relation.type}
                          isFocused={getByPathWithDefault(false, item.id, focusedItem)}
                          onMouseLeave={reset}
                          onMouseEnter={() =>
                            setItem({ focusedItem: { [item.id]: true }, shipmentId: '' })
                          }
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
              <BooleanValue defaultValue>
                {({ value: isCollapsed, toggle }) => (
                  <FocusedValue key={shipmentId}>
                    {({
                      value: { focusedItem, shipmentId: selectedShipmentId },
                      assign,
                      reset,
                    }) => (
                      <Item
                        key={shipmentId}
                        type={isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT'}
                        data={currentShipment.data}
                        isFocused={
                          selectedShipmentId
                            ? selectedShipmentId === shipmentId
                            : Boolean(
                                Object.keys(focusedItem || {}).some(focusId =>
                                  shipmentRefs.some(orderId => orderId === focusId)
                                )
                              )
                        }
                        onMouseLeave={reset}
                        onMouseEnter={() =>
                          assign({ focusedItem: currentShipment.refs, shipmentId })
                        }
                        onClick={toggle}
                        onDoubleClick={() => {
                          setSlide({
                            show: true,
                            type: 'SHIPMENT',
                            id: shipmentId,
                          });
                        }}
                      />
                    )}
                  </FocusedValue>
                )}
              </BooleanValue>
            )}
          </ToggleSlide>
        );
      })}
    </div>
    <DetailFocused />
  </>
);

export default OrderFocused;
