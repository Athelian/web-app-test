// @flow
import * as React from 'react';
import type { OrderPayload, BatchPayload } from 'generated/graphql';
import { flatten } from 'lodash';
import memoize from 'memoize-one';
import styled from 'react-emotion';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import type { State, CellRender, Entity } from './type.js.flow';

export const OrderCard = styled.div`
  width: 285px;
  height: 55px;
`;
export const ItemCard = styled.div`
  width: 465px;
  height: 55px;
`;
export const BatchCard = styled.div`
  width: 445px;
  height: 55px;
`;
export const ContainerCard = styled.div`
  width: 375px;
  height: 55px;
`;
export const ShipmentCard = styled.div`
  width: 515px;
  height: 55px;
`;

function orderCell({
  itemPosition,
  batchPosition,
  order,
  totalItems,
}: {
  itemPosition: number,
  batchPosition: number,
  order: mixed,
  totalItems: number,
}) {
  if (itemPosition === 0 && batchPosition === 0)
    return {
      type: ORDER,
      data: order,
      afterConnector: 'HORIZONTAL',
    };
  const isTheLastItemWithFirstBatch = itemPosition === totalItems - 1 && batchPosition === 0;
  const isNotTheLastItem = itemPosition < totalItems - 1 && totalItems > 1;
  if (isTheLastItemWithFirstBatch || isNotTheLastItem)
    return {
      type: 'duplicateOrder',
      data: null,
      afterConnector: 'VERTICAL',
    };
  return null;
}

function containerCell(batch: BatchPayload): ?CellRender {
  if (getByPathWithDefault(null, CONTAINER, batch)) {
    return {
      beforeConnector: 'HORIZONTAL',
      type: CONTAINER,
      data: getByPathWithDefault(null, CONTAINER, batch),
      afterConnector: 'HORIZONTAL',
    };
  }
  if (
    getByPathWithDefault(null, SHIPMENT, batch) &&
    !getByPathWithDefault(null, CONTAINER, batch)
  ) {
    return {
      beforeConnector: 'HORIZONTAL',
      type: 'shipmentWithoutContainer',
      data: null,
      afterConnector: 'HORIZONTAL',
    };
  }
  return null;
}

export const orderCoordinates = memoize(
  ({
    isExpand,
    isLoadedData,
    order,
  }: {
    isExpand: boolean,
    order: mixed,
    isLoadedData?: boolean,
  }): Array<?CellRender> => {
    const orderItems = getByPathWithDefault([], 'orderItems', order);
    const orderItemCount = getByPathWithDefault(0, 'orderItemCount', order);
    if (!isExpand) {
      return orderItemCount > 0
        ? [
            {
              type: ORDER,
              data: order,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'itemSummary',
              data: order,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'batchSummary',
              data: order,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'containerSummary',
              data: order,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'shipmentSummary',
              data: order,
            },
          ]
        : [
            {
              type: ORDER,
              data: order,
            },
            null,
            null,
            null,
            null,
          ];
    }
    const result = [
      null,
      {
        type: 'itemSummary',
        data: order,
        afterConnector: 'HORIZONTAL',
      },
      {
        beforeConnector: 'HORIZONTAL',
        type: 'batchSummary',
        data: order,
        afterConnector: 'HORIZONTAL',
      },
      {
        beforeConnector: 'HORIZONTAL',
        type: 'containerSummary',
        data: order,
        afterConnector: 'HORIZONTAL',
      },
      {
        beforeConnector: 'HORIZONTAL',
        type: 'shipmentSummary',
        data: order,
      },
    ];
    if (!isLoadedData) {
      result.push(
        ...[
          {
            type: ORDER,
            data: order,
            afterConnector: 'HORIZONTAL',
          },
          {
            beforeConnector: 'HORIZONTAL',
            type: 'placeholder',
            entity: ORDER_ITEM,
            afterConnector: 'HORIZONTAL',
          },
          {
            beforeConnector: 'HORIZONTAL',
            type: 'placeholder',
            entity: BATCH,
            afterConnector: 'HORIZONTAL',
          },
          {
            beforeConnector: 'HORIZONTAL',
            type: 'placeholder',
            entity: CONTAINER,
            afterConnector: 'HORIZONTAL',
          },
          {
            beforeConnector: 'HORIZONTAL',
            type: 'placeholder',
            entity: SHIPMENT,
            afterConnector: 'HORIZONTAL',
          },
        ]
      );
      return result;
    }
    if (orderItemCount > 0) {
      orderItems.forEach((item, index) => {
        const batches = getByPathWithDefault([], 'batches', item);
        if (batches.length) {
          batches.forEach((batch, position) => {
            result.push(
              ...[
                orderCell({
                  order,
                  itemPosition: index,
                  batchPosition: position,
                  totalItems: orderItems.length,
                }),
                !position
                  ? {
                      beforeConnector: 'HORIZONTAL',
                      type: ORDER_ITEM,
                      data: item,
                      afterConnector: 'HORIZONTAL',
                    }
                  : {
                      type: 'duplicateOrderItem',
                      data: order,
                      afterConnector: 'VERTICAL',
                    },
                {
                  beforeConnector: 'HORIZONTAL',
                  type: BATCH,
                  data: batch,
                  afterConnector:
                    batch && (batch.container || batch.shipment) ? 'HORIZONTAL' : null,
                },
                containerCell(batch),
                batch && batch.shipment
                  ? {
                      beforeConnector: 'HORIZONTAL',
                      type: SHIPMENT,
                      data: batch.shipment,
                    }
                  : null,
              ]
            );
          });
        } else {
          // order item has no batches
          result.push(
            ...[
              index === 0
                ? {
                    type: ORDER,
                    data: order,
                    afterConnector: 'HORIZONTAL',
                  }
                : {
                    type: 'duplicateOrder',
                    data: null,
                    afterConnector: 'VERTICAL',
                  },
              {
                beforeConnector: 'HORIZONTAL',
                type: ORDER_ITEM,
                data: item,
              },
              null,
              null,
              null,
            ]
          );
        }
      });
    } else {
      // order which has no item
      result.push(
        ...[
          {
            type: ORDER,
            data: order,
          },
          null,
          null,
          null,
          null,
        ]
      );
    }
    return result;
  }
);

export const getColorByEntity = (entity: ?Entity) => {
  switch (entity) {
    case ORDER_ITEM:
      return 'ORDER_ITEM';
    default:
      return entity && entity.toUpperCase();
  }
};
export const getIconByEntity = (entity: ?Entity) => {
  switch (entity) {
    case ORDER_ITEM:
      return 'ORDER_ITEM';
    default:
      return entity && entity.toUpperCase();
  }
};

export const getCardByEntity = (entity: ?Entity) => {
  switch (entity) {
    case ORDER:
      return OrderCard;
    case ORDER_ITEM:
      return ItemCard;
    case BATCH:
      return BatchCard;
    case CONTAINER:
      return ContainerCard;
    case SHIPMENT:
      return ShipmentCard;
    default:
      return React.Fragment;
  }
};

export const findLineColors = ({
  type,
  state,
  order,
  cell,
  position,
  isExpand,
}: {|
  position: 'before' | 'center' | 'after',
  type: string,
  isExpand: boolean,
  state: State,
  cell: CellRender,
  order?: OrderPayload,
|}) => {
  // TODO: apply the colors for lines
  switch (type) {
    case 'Order': {
      const orderId = getByPathWithDefault('', 'data.id', cell);
      const orderItemIds = flatten(
        getByPathWithDefault([], 'data.orderItems', cell).map(item =>
          getByPathWithDefault('', 'id', item)
        )
      );
      const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
      const isTargetedAnyItems = orderItemIds.some(itemId =>
        state.targets.includes(`${ORDER_ITEM}-${itemId}`)
      );

      return {
        isTargeted: isTargetedOrder && isTargetedAnyItems,
        hasRelation: isTargetedAnyItems,
      };
    }
    case 'OrderItem': {
      const orderId = getByPathWithDefault('', 'id', order);
      const itemId = getByPathWithDefault('', 'data.id', cell);
      const batchIds = flatten(
        getByPathWithDefault([], 'data.batches', cell).map(item =>
          getByPathWithDefault('', 'id', item)
        )
      );
      const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
      const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemId}`);
      const isTargetedAnyBatches = batchIds.some(batchId =>
        state.targets.includes(`${BATCH}-${batchId}`)
      );

      if (position === 'before') {
        return {
          isTargeted: isTargetedOrder && isTargetedItem,
          hasRelation: isTargetedItem,
        };
      }

      return {
        isTargeted: isTargetedItem && isTargetedAnyBatches,
        hasRelation: isTargetedAnyBatches,
      };
    }
    case 'itemSummary': {
      if (isExpand) {
        return {
          isTargeted: false,
          hasRelation: false,
        };
      }
      const orderId = getByPathWithDefault('', 'data.id', cell);
      const orderItemIds = flatten(
        getByPathWithDefault([], 'data.orderItems', cell).map(item =>
          getByPathWithDefault('', 'id', item)
        )
      );
      const batchIds = flatten(
        getByPathWithDefault([], 'data.orderItems', cell).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'id', batch)
          )
        )
      );
      const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
      const isTargetedAnyItems = orderItemIds.some(itemId =>
        state.targets.includes(`${ORDER_ITEM}-${itemId}`)
      );
      const isTargetedAnyBatch = batchIds.some(batchId =>
        state.targets.includes(`${BATCH}-${batchId}`)
      );
      if (position === 'before') {
        return {
          isTargeted: isTargetedOrder && isTargetedAnyItems,
          hasRelation: isTargetedOrder,
        };
      }
      return {
        isTargeted: isTargetedAnyBatch,
        hasRelation: isTargetedAnyBatch,
      };
    }
    default:
      break;
  }
  return {
    isTargeted: false,
    hasRelation: false,
  };
};
