// @flow

const mappingRoutes = {
  orderItem: 'order-item',
  OrderItem: 'order-item',
};

const mappingIcon = {
  OrderItem: 'ORDER_ITEM',
  orderItem: 'ORDER_ITEM',
  productProvider: 'PRODUCT_PROVIDER',
  File: 'DOCUMENT',
};

export const parseRoute = (entityType: string) => {
  return mappingRoutes?.[entityType] ?? entityType;
};

export const parseIcon = (entityType: string) => {
  return mappingIcon?.[entityType] ?? entityType?.toUpperCase() ?? 'ORDER';
};
