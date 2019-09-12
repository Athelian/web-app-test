// @flow
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';

const orderColumns: Array<ColumnConfig> = [
  {
    key: 'order.poNo',
    title: 'PO No',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      name: 'poNo',
      group: 'order',
    },
  },
  {
    key: 'order.piNo',
    title: 'PI No',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      name: 'piNo',
      group: 'order',
    },
  },
  {
    key: 'order.currency',
    title: 'Currency',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
    sort: {
      name: 'currency',
      group: 'order',
    },
  },
  {
    key: 'order.deliveryPlace',
    title: 'Place Of Delivery',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.created',
    title: 'Created',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      name: 'createdAt',
      group: 'order',
    },
  },
  {
    key: 'order.updated',
    title: 'Updated',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      default: true,
      name: 'updatedAt',
      group: 'order',
    },
  },
];

const orderItemColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.no',
    title: 'Item No',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'no',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.created',
    title: 'Created',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      default: true,
      name: 'createdAt',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.updated',
    title: 'Updated',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'orderItem',
    },
  },
];

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.no',
    title: 'Batch No',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'no',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.created',
    title: 'Created',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      default: true,
      name: 'createdAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.updated',
    title: 'Updated',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'batch',
    },
  },
];

const containerColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.container.no',
    title: 'Container No',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerNo',
      group: 'batch',
    },
  },
];

const shipmentColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.shipment.no',
    title: 'Shipment No',
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      local: true,
      name: 'shipmentNo',
      group: 'batch',
    },
  },
];

const columns: Array<ColumnConfig> = [
  ...orderColumns,
  ...orderItemColumns,
  ...batchColumns,
  ...containerColumns,
  ...shipmentColumns,
];

export default columns;
