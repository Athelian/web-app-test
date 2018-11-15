// @flow
import { differenceBy } from 'lodash';
import { getByPathWithDefault } from 'utils/fp';
import { cleanUpData } from 'utils/data';
// import update from 'immutability-helper';
// import { createBatchMutation } from 'modules/batch/form/mutation';
// import { createShipmentWithReturnDataMutation } from 'modules/shipment/form/mutation';
import { prepareCreateOrderInput } from 'modules/order/form/mutation';
import {
  cloneOrderMutation,
  cloneOrderItemMutation,
  cloneBatchMutation,
  cloneShipmentMutation,
} from 'modules/relationMap/orderFocused/mutation';
import { orderListQuery } from 'modules/relationMap/orderFocused/query';
import {
  removeAdditionOrderItemFields,
  removeAdditionBatchFields,
} from 'modules/relationMap/orderFocused/formatter';
import { createMutationRequest } from './index';

export const cloneOrder = async (client: any, orders: Array<Object>, filter: Object) => {
  const mutationRequest = createMutationRequest(client);
  // const orderIds = Object.keys(order);
  const orderRequests = orders.map(currentOrder => {
    // const currentOrder = order[orderId];
    const request = mutationRequest({
      mutation: cloneOrderMutation,
      variables: {
        input: prepareCreateOrderInput(
          cleanUpData({
            ...currentOrder,
            poNo: `[cloned] ${currentOrder.poNo}`,
            currency: currentOrder.currency === 'All' ? 'ALL' : currentOrder.currency,
          })
        ),
      },
      update: (store, { data }) => {
        const query = { query: orderListQuery, variables: filter };
        const orderList = store.readQuery(query);

        const newOrderList = Object.assign({}, orderList);
        newOrderList.orders.nodes.push(getByPathWithDefault({}, 'orderCreate.order', data));

        // @NOTE should use this way to implement maybe wait path from apollo
        // ref: https://github.com/apollographql/apollo-client/issues/2415
        // const newOrderList = update(orderList, {
        //   orders: {
        //     nodes: { $push: [getByPathWithDefault({}, 'orderCreate.order', data)] },
        //   },
        // });
        // store.writeQuery({
        //   query: orderListQuery,
        //   variables: filter,
        //   data: { data: { orders: newOrderList.orders } },
        // });
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

export const cloneOrderItem = async (client: any, orderItems: Array<Object>, filter: Object) => {
  const mutationRequest = createMutationRequest(client);
  // const orderItemIds = Object.keys(orderItem || {});
  const orderUpdate = orderItems.reduce((orderUpdateObj, currentOrderItem) => {
    // const currentOrderItem = orderItem[orderItemId];
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
      mutation: cloneOrderItemMutation,
      variables: {
        id: updateId,
        input: { orderItems: updateOrderItems },
      },
      update: (store, { data }) => {
        const query = { query: orderListQuery, variables: filter };
        const orderList = store.readQuery(query);
        const updateData = data.orderUpdate.order;
        orderList.orders.nodes.forEach((order, orderIndex) => {
          if (order.id === updateData.id) {
            orderList.orders.nodes[orderIndex] = updateData;
          }
        });
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

export const cloneBatch = async (client: any, batches: Object) => {
  const mutationRequest = createMutationRequest(client);
  // const batchIds = Object.keys(batch || {});
  const batchRequests = batches.map(currentBatch => {
    // const currentBatch = batch[batchId];
    const orderItemId = getByPathWithDefault('', 'orderItem.id', currentBatch);
    const request = mutationRequest(
      {
        mutation: cloneBatchMutation,
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
  const shipmentIds = Object.keys(shipment || {});
  const shipmentRequests = shipmentIds.map(shipmentId => {
    const currentShipment = shipment[shipmentId];
    const request = client.mutate({
      mutation: cloneShipmentMutation,
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

const filterTargetedOrder = (target: Object) => {
  const orders: any = (Object.entries(target.order || {}): any).map((data: any) => {
    const [, orderObj] = data;
    const orderItems = orderObj.orderItems
      .filter(orderItem => target.orderItem[orderItem.id])
      .map(orderItem => {
        const batches = orderItem.batches
          .filter(batch => target.batch[batch.id])
          .map(batch => removeAdditionBatchFields(batch));
        return { ...removeAdditionOrderItemFields(orderItem), batches };
      });
    return {
      ...orderObj,
      orderItems,
    };
  });
  return orders;
};

const filterTargetedOrderItem = (target: Object) => {
  const orderItems: any = (Object.entries(target.orderItem || {}): any)
    .filter(data => {
      const [, orderItem] = data;
      return !(target.order || {})[orderItem.parentId || orderItem.orderId];
    })
    .map(data => {
      const [, orderItem] = data;
      return { ...orderItem };
    });
  return orderItems;
};

const filterTargetedBatch = (target: Object) => {
  const batches: any = (Object.entries(target.batch || {}): any)
    .filter(data => {
      const [, batch] = data;
      return !target.order[batch.rootId || batch.orderId];
    })
    .map(data => {
      const [, batch] = data;
      return { ...batch };
    });
  return batches;
};

export const cloneTarget = async ({
  client,
  target,
  filter,
}: {
  client: any,
  target: Object,
  filter: Object,
}) => {
  const targetedOrder = filterTargetedOrder(target);
  const targetedOrderItem = filterTargetedOrderItem(target);
  const targetedBatch = filterTargetedBatch(target);
  // TODO: should run in parallel
  const [orderResults, orderFocus] = await cloneOrder(client, targetedOrder, filter);
  const [shipmentResults, shipmentFocus] = await cloneShipment(client, target.shipment);
  const [orderItemResult, orderItemFocus] = await cloneOrderItem(client, targetedOrderItem, filter);
  const [batchResult, batchFocus] = await cloneBatch(client, targetedBatch);

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
