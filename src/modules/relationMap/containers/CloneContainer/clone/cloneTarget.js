// @flow
import { differenceBy } from 'lodash';
import { getByPathWithDefault } from 'utils/fp';
import { createBatchMutation } from 'modules/batch/form/mutation';
import { createShipmentWithReturnDataMutation } from 'modules/shipment/form/mutation';
import {
  createOrderWithReturnDataMutation,
  updateOrderItemMutation,
} from 'modules/order/form/mutation';
// import { orderListQuery } from 'modules/relationMap/orderFocused/query';
import { createMutationRequest } from './index';

export const cloneOrder = async (client: any, order: Object) => {
  const mutationRequest = createMutationRequest(client);
  const orderIds = Object.keys(order);
  const orderRequests = orderIds.map(orderId => {
    const currentOrder = order[orderId];
    const request = mutationRequest({
      mutation: createOrderWithReturnDataMutation,
      variables: {
        input: {
          poNo: `[cloned] ${currentOrder.poNo}`,
          exporterId: currentOrder.exporter && currentOrder.exporter.id,
          currency: currentOrder.currency,
        },
      },
    });
    return request;
  });
  const newOrders: Array<Object> = await Promise.all(orderRequests);
  const orderResults: Array<Object> = newOrders.map(newOrder =>
    getByPathWithDefault({}, 'data.orderCreate.order', newOrder)
  );
  const orderFocus = orderResults.reduce(
    (focus, orderResult) =>
      Object.assign(focus, {
        [orderResult.id]: true,
      }),
    {}
  );
  return [orderResults, orderFocus];
};

export const cloneOrderItem = async (client: any, orderItem: Object) => {
  const mutationRequest = createMutationRequest(client);
  const orderItemIds = Object.keys(orderItem);
  const orderUpdate = orderItemIds.reduce((orderUpdateObj, orderItemId) => {
    const currentOrderItem = orderItem[orderItemId];
    const orderId = getByPathWithDefault('', 'order.id', currentOrderItem);
    return Object.assign(orderUpdateObj, {
      [orderId]: [
        ...(!orderUpdateObj[orderId]
          ? getByPathWithDefault([], 'order.orderItems', currentOrderItem).map(currentItem => ({
              id: currentItem.id,
            }))
          : orderUpdateObj[orderId]),
        {
          quantity: currentOrderItem.quantity,
          productProviderId:
            currentOrderItem.productProvider && currentOrderItem.productProvider.id,
          price: {
            amount: getByPathWithDefault(0, 'price.amount', currentOrderItem),
            currency: getByPathWithDefault('All', 'price.currency', currentOrderItem),
          },
        },
      ],
    });
  }, {});
  const orderUpdateIds = Object.keys(orderUpdate);
  const orderItemRequests = orderUpdateIds.map(updateId => {
    const updateOrderItems = orderUpdate[updateId];
    const request = mutationRequest({
      mutation: updateOrderItemMutation,
      variables: {
        id: updateId,
        input: { orderItems: updateOrderItems },
      },
    });
    return request;
  });
  const updatedOrderItems = await Promise.all(orderItemRequests);
  const orderItemResult = updatedOrderItems.reduce((resultOrderItemObj, updatedOrderItem) => {
    const updatedOrderId = getByPathWithDefault('', 'data.orderUpdate.order.id', updatedOrderItem);
    const newOrderItems = getByPathWithDefault(
      [],
      'data.orderUpdate.order.orderItems',
      updatedOrderItem
    );
    const oldOrderItems = orderUpdate[updatedOrderId];
    const diffOrderItems = differenceBy(newOrderItems, oldOrderItems, 'id');
    return Object.assign(resultOrderItemObj, { [updatedOrderId]: diffOrderItems });
  }, {});

  const orderItemFocus = updatedOrderItems.reduce((resultOrderItemObj, updatedOrderItem) => {
    const updatedOrderId = getByPathWithDefault('', 'data.orderUpdate.order.id', updatedOrderItem);
    const newOrderItems = getByPathWithDefault(
      [],
      'data.orderUpdate.order.orderItems',
      updatedOrderItem
    );
    const oldOrderItems = orderUpdate[updatedOrderId];
    const diffOrderItems = differenceBy(newOrderItems, oldOrderItems, 'id');
    const focusedOrderItem = diffOrderItems.reduce(
      (obj, newOrderItem) => Object.assign(obj, { [newOrderItem.id]: true }),
      {}
    );
    return Object.assign(resultOrderItemObj, focusedOrderItem);
  }, {});
  return [orderItemResult, orderItemFocus];
};

export const cloneBatch = async (client: any, batch: Object) => {
  const mutationRequest = createMutationRequest(client);
  const batchIds = Object.keys(batch);
  const batchRequests = batchIds.map(batchId => {
    const currentBatch = batch[batchId];
    const orderItemId = getByPathWithDefault('', 'orderItem.id', currentBatch);
    const request = mutationRequest(
      {
        mutation: createBatchMutation,
        variables: {
          input: {
            no: `[cloned] ${currentBatch.no}`,
            quantity: currentBatch.quantity,
            orderItemId,
          },
        },
      },
      orderItemId
    );
    return request;
  });
  const newBatches = await Promise.all(batchRequests);
  const batchResult = newBatches.reduce((batchResultObj, newBatch) => {
    const { refId } = newBatch;
    const batchId = getByPathWithDefault('', 'data.batchCreate.batch.id', newBatch);
    const batchRef = refId ? { [refId]: [...(batchResultObj[refId] || []), { id: batchId }] } : {};
    return Object.assign(batchResultObj, batchRef);
  }, {});
  const batchFocus = newBatches.reduce((batchResultObj, newBatch) => {
    const batchId = getByPathWithDefault('', 'data.batchCreate.batch.id', newBatch);
    return Object.assign(batchResultObj, { [batchId]: true });
  }, {});
  return [batchResult, batchFocus];
};

export const cloneShipment = async (client: any, shipment: Object) => {
  const shipmentIds = Object.keys(shipment);
  const shipmentRequests = shipmentIds.map(shipmentId => {
    const currentShipment = shipment[shipmentId];
    const request = client.mutate({
      mutation: createShipmentWithReturnDataMutation,
      variables: {
        input: {
          no: `[cloned] ${currentShipment.no}`,
          containerGroups: currentShipment.containerGroups.map(group => ({
            warehouseId: getByPathWithDefault('1', 'warehouse.id', group),
          })),
          voyages: currentShipment.voyages.map(voyage => ({ vesselName: voyage.vesselName })),
        },
      },
    });
    return request;
  });
  const newShipments = await Promise.all(shipmentRequests);
  const shipmentResults: Array<Object> = newShipments.map(newShipment =>
    getByPathWithDefault({}, 'data.shipmentCreate.shipment', newShipment)
  );
  const shipmentFocus = shipmentResults.reduce(
    (focus, shipmentResult) =>
      Object.assign(focus, {
        [shipmentResult.id]: true,
      }),
    {}
  );
  return [shipmentResults, shipmentFocus];
};

export const cloneTarget = async ({ client, target }: { client: any, target: Object }) => {
  const { batch, order, orderItem, shipment } = target;
  // TODO: should run in parallel
  const [orderResults, orderFocus] = await cloneOrder(client, order);
  const [shipmentResults, shipmentFocus] = await cloneShipment(client, shipment);
  const [orderItemResult, orderItemFocus] = await cloneOrderItem(client, orderItem);
  const [batchResult, batchFocus] = await cloneBatch(client, batch);

  const result = {
    order: orderResults,
    orderItem: orderItemResult,
    batch: batchResult,
    shipment: shipmentResults,
  };
  const focus = {
    order: orderFocus,
    orderItem: orderItemFocus,
    batch: batchFocus,
    shipment: shipmentFocus,
  };
  return [result, focus];
};
