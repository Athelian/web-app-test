// @flow
import { intersection } from 'lodash';
import { removeTypename } from 'utils/data';

type MappingObject = {
  data: {
    id: string,
  },
  relation: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  },
};

export const findAllPossibleOrders = (
  selected: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  },
  mappingObjects: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  }
): {
  orderIds: Array<string>,
  orderItemsIds: Array<string>,
  batchIds: Array<string>,
  shipmentIds: Array<string>,
} => {
  const orderIds = selected.order ? Object.keys(selected.order) : [];
  const orderItemsIds = selected.orderItem ? Object.keys(selected.orderItem) : [];
  const batchIds = selected.batch ? Object.keys(selected.batch) : [];
  const shipmentIds = selected.shipment ? Object.keys(selected.shipment) : [];

  // find all orders from selected order
  if (orderIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.order): any).forEach((item: [string, MappingObject]) => {
      const [orderId, order] = item;
      if (selected.order && selected.order[orderId]) {
        orderItemsIds.push(...Object.keys(order.relation.orderItem));
        batchIds.push(...Object.keys(order.relation.batch));
        shipmentIds.push(...Object.keys(order.relation.shipment));
      }
    });
  }

  if (orderItemsIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.orderItem): any).forEach((item: [string, MappingObject]) => {
      const [orderItemId, orderItem] = item;
      if (selected.orderItem && selected.orderItem[orderItemId]) {
        orderIds.push(...Object.keys(orderItem.relation.order));
        batchIds.push(...Object.keys(orderItem.relation.batch));
        shipmentIds.push(...Object.keys(orderItem.relation.shipment));
      }
    });
  }

  if (shipmentIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.shipment): any).forEach((item: [string, MappingObject]) => {
      const [shipmentId, shipment] = item;
      if (selected.shipment && selected.shipment[shipmentId]) {
        orderIds.push(...Object.keys(shipment.relation.order));
        orderItemsIds.push(...Object.keys(shipment.relation.orderItem));
        batchIds.push(...Object.keys(shipment.relation.batch));
      }
    });
  }

  if (batchIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.batch): any).forEach((item: [string, MappingObject]) => {
      const [batchId, batch] = item;
      if (selected.batch && selected.batch[batchId]) {
        orderIds.push(...Object.keys(batch.relation.order));
        orderItemsIds.push(...Object.keys(batch.relation.orderItem));
        shipmentIds.push(...Object.keys(batch.relation.shipment));
      }
    });
  }

  return {
    orderIds: [...new Set(orderIds)],
    orderItemsIds: [...new Set(orderItemsIds)],
    batchIds: [...new Set(batchIds)],
    shipmentIds: [...new Set(shipmentIds)],
  };
};

export const totalLinePerOrder = (orderItems: Array<Object>, batchIds: Array<string>) => {
  let totalLines = 0;
  if (orderItems.length === 0) {
    totalLines = 1;
  } else {
    totalLines = orderItems.reduce((result, orderItem) => {
      const totalBatches = intersection(Object.keys(orderItem.relation.batch), batchIds).length;
      if (totalBatches === 0) {
        return result + 1;
      }
      return result + totalBatches;
    }, 0);
  }
  return totalLines;
};

export const parseChangedData = (
  changedData: { orders?: Object, shipments?: Object, orderItems?: Object, batches?: Object },
  editData: Object
) => {
  console.warn({ changedData, editData });
  const orders = [];
  const batches = [];
  if (changedData.orders) {
    (Object.entries(changedData.orders): any).forEach(item => {
      const [id, order] = item;
      const keys = Object.keys(order);
      const changedOrder = {};
      keys.forEach(key => {
        const updateValue = editData.orders[id][key];
        switch (key) {
          case 'issuedAt': {
            changedOrder[key] = updateValue ? new Date(updateValue) : null;
            break;
          }

          case 'inCharges':
            changedOrder.inChargeIds = updateValue.map(({ id: userId }) => userId);
            break;
          case 'tags':
            changedOrder.tagIds = updateValue.map(({ id: tagId }) => tagId);
            break;

          case 'currency':
          case 'incoterm': {
            changedOrder[key] = updateValue && updateValue.length > 0 ? updateValue : null;
            break;
          }

          default:
            changedOrder[key] = updateValue;
        }
      });
      orders.push({ input: changedOrder, id });
    });
  }

  if (changedData.batches) {
    (Object.entries(changedData.batches): any).forEach(item => {
      const [id, batch] = item;
      const keys = Object.keys(batch);
      const changedBatch = {};
      keys.forEach(key => {
        const updateValue = editData.batches[id][key];
        switch (key) {
          case 'deliveredAt':
          case 'expiredAt':
          case 'producedAt': {
            changedBatch[key] = updateValue ? new Date(updateValue) : null;
            break;
          }

          case 'packageSize': {
            const packageSize = removeTypename(updateValue);
            if (!packageSize.width) {
              packageSize.width = {
                value: 0,
                metric: '',
              };
            }
            if (!packageSize.height) {
              packageSize.height = {
                value: 0,
                metric: '',
              };
            }
            if (!packageSize.length) {
              packageSize.length = {
                value: 0,
                metric: '',
              };
            }

            changedBatch[key] = packageSize;
            break;
          }

          case 'tags':
            changedBatch.tagIds = updateValue.map(({ id: tagId }) => tagId);
            break;

          default:
            changedBatch[key] = updateValue;
        }
      });
      batches.push({ input: changedBatch, id });
    });
  }
  return {
    orders,
    batches,
    warehouses: [],
    products: [],
    shipments: [],
  };
};
