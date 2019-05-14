// @flow

export const calculateBatchesFromOrder = ({
  batchCount,
  batchShippedCount,
}: {
  batchCount: number,
  batchShippedCount: number,
}) => {
  return {
    totalBatches: batchCount,
    shippedBatches: batchShippedCount,
    unshippedBatches: batchCount - batchShippedCount,
  };
};

export const getQuantityForOrderSummary = (orderItems: Array<Object>) => {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let totalPrice = 0;
  let totalItems = 0;
  let activeBatches = 0;
  let archivedBatches = 0;

  if (orderItems) {
    totalItems = orderItems.length;

    orderItems.forEach(item => {
      const qty = item.quantity ? item.quantity : 0;
      const price = item.price ? item.price.amount : 0;
      orderedQuantity += qty;
      totalPrice += price * qty;

      if (item.batches) {
        item.batches.forEach(batch => {
          batchedQuantity += batch.quantity;

          let currentQuantity = batch.quantity;

          if (batch.batchAdjustments) {
            batch.batchAdjustments.forEach(batchAdjustment => {
              batchedQuantity += batchAdjustment.quantity;
              currentQuantity += batchAdjustment.quantity;
            });
          }

          if (batch.shipment) {
            shippedQuantity += currentQuantity;
          }

          if (batch.archived) {
            archivedBatches += 1;
          } else {
            activeBatches += 1;
          }
        });
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    totalPrice,
    totalItems,
    activeBatches,
    archivedBatches,
  };
};
