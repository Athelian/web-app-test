// @flow
import { defaultVolumeMetric } from 'utils/metric';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import shipmentMessages from 'modules/shipment/messages';
import warehouseMessages from 'modules/warehouse/messages';
import partnerMessages from 'modules/partner/messages';
import type { FilterConfig } from './index';

export const OrderFilterConfig: Array<FilterConfig> = [
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
    entity: 'ORDER',
    field: 'exporterIds',
    type: 'exporter_ids',
    message: orderMessages.exporter,
    defaultValue: [],
  },
  {
    entity: 'ORDER',
    field: 'tagIds',
    type: 'order_tags',
    message: orderMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'ORDER',
    field: 'ids',
    type: 'order_ids',
    message: orderMessages.order,
    defaultValue: [],
  },
  {
    entity: 'ORDER',
    field: 'completelyBatched',
    type: 'completely_batched',
    message: orderMessages.completelyBatched,
    defaultValue: false,
  },
  {
    entity: 'ORDER',
    field: 'completelyShipped',
    type: 'completely_shipped',
    message: orderMessages.completelyShipped,
    defaultValue: false,
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
    entity: 'BATCH',
    field: 'batchTagIds',
    type: 'batch_tags',
    message: batchMessages.tags,
    defaultValue: [],
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
    field: 'shipmentForwarderIds',
    type: 'forwarder_ids',
    message: shipmentMessages.forwarder,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentWarehouseIds',
    type: 'warehouse_ids',
    message: shipmentMessages.warehouse,
    defaultValue: [],
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
  {
    entity: 'SHIPMENT',
    field: 'shipmentTagIds',
    type: 'shipment_tags',
    message: shipmentMessages.tags,
    defaultValue: [],
  },
];

export const WarehouseFilterConfig: Array<FilterConfig> = [
  {
    entity: 'WAREHOUSE',
    field: 'archived',
    type: 'archived',
    message: warehouseMessages.status,
    defaultValue: false,
  },
  {
    entity: 'WAREHOUSE',
    field: 'createdAt',
    type: 'date_range',
    message: warehouseMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'WAREHOUSE',
    field: 'updatedAt',
    type: 'date_range',
    message: warehouseMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];

export const PartnerFilterConfig: Array<FilterConfig> = [
  {
    entity: 'PARTNER',
    field: 'createdAt',
    type: 'date_range',
    message: partnerMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PARTNER',
    field: 'updatedAt',
    type: 'date_range',
    message: partnerMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PARTNER',
    field: 'types',
    type: 'organization_types',
    message: partnerMessages.type,
    defaultValue: [],
  },
];
