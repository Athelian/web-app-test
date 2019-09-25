// @flow
import { defaultVolumeMetric } from 'utils/metric';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import shipmentMessages from 'modules/shipment/messages';
import type { FilterConfig } from './index';

export const OrderConfigFilter: Array<FilterConfig> = [
  {
    entity: 'ORDER',
    field: 'archived',
    type: 'archived',
    message: orderMessages.status,
    defaultValue: false,
  },
  {
    entity: 'ORDER',
    field: 'createdAt',
    type: 'date_range',
    message: orderMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'ORDER',
    field: 'updatedAt',
    type: 'date_range',
    message: orderMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchDeliveredAt',
    type: 'date_range',
    message: batchMessages.deliveredAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchExpiredAt',
    type: 'date_range',
    message: batchMessages.expiredAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchProducedAt',
    type: 'date_range',
    message: batchMessages.producedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchTotalVolume',
    type: 'volume_range',
    message: batchMessages.totalVolume,
    defaultValue: {
      min: null,
      max: null,
      metric: defaultVolumeMetric,
    },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentArchived',
    type: 'archived',
    message: shipmentMessages.status,
    defaultValue: false,
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCargoReady',
    type: 'date_range',
    message: shipmentMessages.cargoReady,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentLoadPortDeparture',
    type: 'date_range',
    message: shipmentMessages.loadPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentFirstTransitPortArrival',
    type: 'date_range',
    message: shipmentMessages.firstTransitPortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentFirstTransitPortDeparture',
    type: 'date_range',
    message: shipmentMessages.firstTransitPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentSecondTransitPortArrival',
    type: 'date_range',
    message: shipmentMessages.secondTransitPortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentSecondTransitPortDeparture',
    type: 'date_range',
    message: shipmentMessages.secondTransitPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentDischargePortArrival',
    type: 'date_range',
    message: shipmentMessages.dischargePortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCustomClearance',
    type: 'date_range',
    message: shipmentMessages.customClearance,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentWarehouseArrival',
    type: 'date_range',
    message: shipmentMessages.warehouseArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentDeliveryReady',
    type: 'date_range',
    message: shipmentMessages.deliveryReady,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCreatedAt',
    type: 'date_range',
    message: shipmentMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentUpdatedAt',
    type: 'date_range',
    message: shipmentMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];