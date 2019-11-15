/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderMessages from 'modules/order/messages';
import orderItemMessages from 'modules/orderItem/messages';
import batchMessages from 'modules/batch/messages';
import containerMessages from 'modules/container/messages';
import shipmentMessages from 'modules/shipment/messages';
import orderColumns from 'modules/sheet/order/columns';

const orderItemColumns: Array<ColumnConfig> = [
  {
    key: 'orderItem.created',
    exportKey: 'orderItems.createdAt',
    title: <FormattedMessage {...orderItemMessages.createdAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
  },
  {
    key: 'orderItem.updated',
    title: <FormattedMessage {...orderItemMessages.updatedAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
  },
  {
    key: 'orderItem.archived',
    exportKey: 'orderItems.archived',
    title: <FormattedMessage {...orderItemMessages.status} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 105,
  },
  {
    key: 'orderItem.productProvider.product.name',
    title: <FormattedMessage {...orderItemMessages.productName} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      name: 'productName',
      group: 'batch',
    },
  },
  {
    key: 'orderItem.productProvider.product.serial',
    title: <FormattedMessage {...orderItemMessages.productSerial} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      name: 'productSerial',
      group: 'batch',
    },
  },
  {
    key: 'orderItem.no',
    exportKey: 'orderItems.no',
    title: <FormattedMessage {...orderItemMessages.no} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'orderItem.quantity',
    exportKey: 'orderItems.quantity',
    title: <FormattedMessage {...orderItemMessages.quantity} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'orderItem.price',
    exportKey: 'orderItems.price',
    title: <FormattedMessage {...orderItemMessages.unitPrice} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'orderItem.deliveryDate',
    exportKey: 'orderItems.deliveryDate',
    title: <FormattedMessage {...orderItemMessages.deliveryDate} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 125,
  },
  {
    key: 'orderItem.tags',
    title: <FormattedMessage {...orderItemMessages.tags} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'orderItem.memo',
    exportKey: 'orderItems.memo',
    title: <FormattedMessage {...orderItemMessages.memo} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'orderItem.files',
    title: <FormattedMessage {...orderItemMessages.sectionDocuments} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'orderItem.todo',
    title: <FormattedMessage {...orderItemMessages.tasks} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'orderItem.logs',
    title: <FormattedMessage {...orderItemMessages.logs} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 120,
  },
  {
    key: 'orderItem.mask',
    title: <FormattedMessage {...orderItemMessages.mask} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  // actions
];

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'batch.created',
    exportKey: 'batches.createdAt',
    title: <FormattedMessage {...batchMessages.createdAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      name: 'createdAt',
      group: 'batch',
    },
  },
  {
    key: 'batch.updated',
    title: <FormattedMessage {...batchMessages.updatedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      default: true,
      name: 'updatedAt',
      group: 'batch',
    },
  },
  {
    key: 'batch.archived',
    exportKey: 'batches.archived',
    title: <FormattedMessage {...batchMessages.status} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 105,
  },
  {
    key: 'batch.no',
    exportKey: 'batches.no',
    title: <FormattedMessage {...batchMessages.batchNo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      name: 'no',
      group: 'batch',
    },
  },
  {
    key: 'batch.deliveredAt',
    exportKey: 'batches.deliveredAt',
    title: <FormattedMessage {...batchMessages.deliveredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      name: 'deliveredAt',
      group: 'batch',
    },
  },
  {
    key: 'batch.desiredAt',
    exportKey: 'batches.desiredAt',
    title: <FormattedMessage {...batchMessages.desiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
  },
  {
    key: 'batch.expiredAt',
    exportKey: 'batches.expiredAt',
    title: <FormattedMessage {...batchMessages.expiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      name: 'expiredAt',
      group: 'batch',
    },
  },
  {
    key: 'batch.producedAt',
    exportKey: 'batches.producedAt',
    title: <FormattedMessage {...batchMessages.producedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      name: 'producedAt',
      group: 'batch',
    },
  },
  {
    key: 'batch.tags',
    title: <FormattedMessage {...batchMessages.tags} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.memo',
    exportKey: 'batches.memo',
    title: <FormattedMessage {...batchMessages.memo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.latestQuantity',
    title: <FormattedMessage {...batchMessages.currentQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.quantity',
    exportKey: 'batches.quantity',
    title: <FormattedMessage {...batchMessages.initialQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.producedQuantity',
    title: <FormattedMessage {...batchMessages.producedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.preShippedQuantity',
    title: <FormattedMessage {...batchMessages.preShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.shippedQuantity',
    title: <FormattedMessage {...batchMessages.shippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.postShippedQuantity',
    title: <FormattedMessage {...batchMessages.postShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.deliveredQuantity',
    title: <FormattedMessage {...batchMessages.deliveredQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.packageName',
    exportKey: 'batches.packageName',
    title: <FormattedMessage {...batchMessages.packageName} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.packageCapacity',
    exportKey: 'batches.packageCapacity',
    title: <FormattedMessage {...batchMessages.packageCapacity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.packageQuantity',
    title: <FormattedMessage {...batchMessages.packageQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 250,
  },
  {
    key: 'batch.packageGrossWeight',
    title: <FormattedMessage {...batchMessages.packageGrossWeight} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.packageVolume',
    title: <FormattedMessage {...batchMessages.packageVolume} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.packageSize',
    title: <FormattedMessage {...batchMessages.packageSizeGrouped} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 280,
  },
  {
    key: 'batch.todo',
    title: <FormattedMessage {...batchMessages.tasks} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'batch.logs',
    title: <FormattedMessage {...batchMessages.logs} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 120,
  },
  {
    key: 'batch.mask',
    title: <FormattedMessage {...batchMessages.mask} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  // actions
];

const containerColumns: Array<ColumnConfig> = [
  {
    key: 'container.created',
    title: <FormattedMessage {...containerMessages.createdAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'container.updated',
    title: <FormattedMessage {...containerMessages.updatedAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'container.archived',
    exportKey: 'batches.container.archived',
    title: <FormattedMessage {...containerMessages.status} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 105,
  },
  {
    key: 'container.no',
    title: <FormattedMessage {...containerMessages.containerNo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'container.containerType',
    title: <FormattedMessage {...containerMessages.containerType} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 100,
  },
  {
    key: 'container.containerOption',
    title: <FormattedMessage {...containerMessages.containerOption} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 100,
  },
  {
    key: 'container.warehouseArrivalAgreedDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
  },
  {
    key: 'container.warehouseArrivalAgreedDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 160,
  },
  {
    key: 'container.warehouseArrivalAgreedDateApproved',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'container.warehouseArrivalActualDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
  },
  {
    key: 'container.warehouseArrivalActualDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 160,
  },
  {
    key: 'container.warehouseArrivalActualDateApproved',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'container.warehouse',
    title: <FormattedMessage {...containerMessages.warehouse} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'container.freeTime',
    title: <FormattedMessage {...containerMessages.freeTime} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 195,
  },
  {
    key: 'container.freeTimeStartDate',
    title: <FormattedMessage {...containerMessages.startDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 195,
  },
  {
    key: 'container.freeTimeDuration',
    title: <FormattedMessage {...containerMessages.duration} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'container.dueDate',
    title: <FormattedMessage {...containerMessages.dueDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'container.yardName',
    title: <FormattedMessage {...containerMessages.yardName} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'container.departureDate',
    title: <FormattedMessage {...containerMessages.departureDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 125,
  },
  {
    key: 'container.departureDateAssignedTo',
    title: <FormattedMessage {...containerMessages.departureDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 160,
  },
  {
    key: 'container.departureDateApproved',
    title: <FormattedMessage {...containerMessages.departureDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'container.tags',
    title: <FormattedMessage {...containerMessages.tags} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'container.memo',
    exportKey: 'batches.container.memo',
    title: <FormattedMessage {...containerMessages.memo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'container.logs',
    title: <FormattedMessage {...containerMessages.logs} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 120,
  },
  // actions
];

const shipmentColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.created',
    exportKey: 'shipment.createdAt',
    title: <FormattedMessage {...shipmentMessages.createdAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.updated',
    title: <FormattedMessage {...shipmentMessages.updatedAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.archived',
    exportKey: 'shipment.archived',
    title: <FormattedMessage {...shipmentMessages.status} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 120,
  },
  {
    key: 'shipment.no',
    exportKey: 'shipment.no',
    title: <FormattedMessage {...shipmentMessages.shipmentId} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.importer',
    exportKey: 'shipment.importer',
    title: <FormattedMessage {...shipmentMessages.importer} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.exporter',
    exportKey: 'shipment.exporter',
    title: <FormattedMessage {...shipmentMessages.mainExporter} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.forwarders',
    exportKey: 'forwarders',
    title: <FormattedMessage {...shipmentMessages.forwarder} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 825,
  },
  {
    key: 'shipment.blNo',
    exportKey: 'shipment.blNo',
    title: <FormattedMessage {...shipmentMessages.blNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.blDate',
    exportKey: 'shipment.blDate',
    title: <FormattedMessage {...shipmentMessages.blDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.bookingNo',
    exportKey: 'shipment.bookingNo',
    title: <FormattedMessage {...shipmentMessages.bookingNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.booked',
    exportKey: 'shipment.booked',
    title: <FormattedMessage {...shipmentMessages.booked} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.bookingDate',
    exportKey: 'shipment.bookingDate',
    title: <FormattedMessage {...shipmentMessages.bookingDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.invoiceNo',
    exportKey: 'shipment.invoiceNo',
    title: <FormattedMessage {...shipmentMessages.invoiceNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.contractNo',
    exportKey: 'shipment.contractNo',
    title: <FormattedMessage {...shipmentMessages.contractNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.transportType',
    exportKey: 'shipment.transportType',
    title: <FormattedMessage {...shipmentMessages.transportType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.loadType',
    exportKey: 'shipment.loadType',
    title: <FormattedMessage {...shipmentMessages.loadType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.incoterm',
    exportKey: 'shipment.incoterm',
    title: <FormattedMessage {...shipmentMessages.incoterms} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.carrier',
    exportKey: 'shipment.carrier',
    title: <FormattedMessage {...shipmentMessages.carrier} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.tags',
    title: <FormattedMessage {...shipmentMessages.tags} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.memo',
    exportKey: 'shipment.memo',
    title: <FormattedMessage {...orderMessages.memo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.inCharges',
    exportKey: 'shipment.inCharges',
    title: <FormattedMessage {...shipmentMessages.inCharge} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  // TODO: Replace with real selector later
  {
    key: 'shipment.numOfVoyages',
    title: <FormattedMessage {...shipmentMessages.numOfVoyages} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.cargoReady.date',
    title: <FormattedMessage {...shipmentMessages.cargoReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.cargoReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.cargoReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.cargoReady.assignedTo',
    title: <FormattedMessage {...shipmentMessages.cargoReadyAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.cargoReady.approved',
    title: <FormattedMessage {...shipmentMessages.cargoReadyApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.voyage.0.departurePort',
    title: <FormattedMessage {...shipmentMessages.loadPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.0.departure.date',
    title: <FormattedMessage {...shipmentMessages.loadPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.voyage.0.departure.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.loadPortDepartureRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.voyage.0.departure.assignedTo',
    title: <FormattedMessage {...shipmentMessages.loadPortDepartureAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.voyage.0.departure.approved',
    title: <FormattedMessage {...shipmentMessages.loadPortDepartureApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.voyage.0.vesselName',
    title: <FormattedMessage {...shipmentMessages.firstVesselName} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.0.vesselCode',
    title: <FormattedMessage {...shipmentMessages.firstVesselCode} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.0.firstTransitPort',
    title: <FormattedMessage {...shipmentMessages.firstTransitPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.date',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.assignedTo',
    title: <FormattedMessage {...shipmentMessages.firstTransitArrivalAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.approved',
    title: <FormattedMessage {...shipmentMessages.firstTransitArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },

  {
    key: 'shipment.voyage.1.firstTransitDeparture.date',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortDepartureRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.assignedTo',
    title: <FormattedMessage {...shipmentMessages.firstTransitDepartureAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.approved',
    title: <FormattedMessage {...shipmentMessages.firstTransitDepartureApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.voyage.1.vesselName',
    title: <FormattedMessage {...shipmentMessages.secondVesselName} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.1.vesselCode',
    title: <FormattedMessage {...shipmentMessages.secondVesselCode} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.1.secondTransitPort',
    title: <FormattedMessage {...shipmentMessages.secondTransitPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.date',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.assignedTo',
    title: <FormattedMessage {...shipmentMessages.secondTransitArrivalAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.approved',
    title: <FormattedMessage {...shipmentMessages.secondTransitArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.date',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortDepartureRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.assignedTo',
    title: <FormattedMessage {...shipmentMessages.secondTransitDepartureAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.approved',
    title: <FormattedMessage {...shipmentMessages.secondTransitDepartureAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.voyage.2.vesselName',
    title: <FormattedMessage {...shipmentMessages.thirdVesselName} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.2.vesselCode',
    title: <FormattedMessage {...shipmentMessages.thirdVesselCode} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.2.arrivalPort',
    title: <FormattedMessage {...shipmentMessages.dischargePort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.2.arrival.date',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.voyage.2.arrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.voyage.2.arrival.assignedTo',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrivalAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.voyage.2.arrival.approved',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.containerGroup.customClearance.date',
    title: <FormattedMessage {...shipmentMessages.customClearance} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.containerGroup.customClearance.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.customClearanceRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.containerGroup.customClearance.assignedTo',
    title: <FormattedMessage {...shipmentMessages.customClearanceAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.containerGroup.customClearance.approved',
    title: <FormattedMessage {...shipmentMessages.customClearanceApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.containerGroup.warehouse',
    title: <FormattedMessage {...shipmentMessages.warehouse} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.date',
    title: <FormattedMessage {...shipmentMessages.warehouseArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.assignedTo',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.approved',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.date',
    title: <FormattedMessage {...shipmentMessages.deliveryReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.assignedTo',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyAssignedTo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.approved',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.files',
    title: <FormattedMessage {...shipmentMessages.sectionDocuments} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.todo',
    title: <FormattedMessage {...shipmentMessages.tasks} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.logs',
    title: <FormattedMessage {...shipmentMessages.logs} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 120,
  },
  {
    key: 'shipment.mask',
    title: <FormattedMessage {...shipmentMessages.mask} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
];

export const FieldDefinitionEntityTypes = ['Order', 'OrderItem', 'Batch', 'Shipment'];

type Props = {
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
};

export default function({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
}: Props): Array<ColumnConfig> {
  return [
    ...batchColumns,
    ...batchFieldDefinitions.map(fieldDefinition => ({
      key: `batch.customField.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'BATCH',
      color: colors.BATCH,
      width: 200,
    })),
    ...orderItemColumns,
    ...orderItemFieldDefinitions.map(fieldDefinition => ({
      key: `orderItem.customField.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'ORDER_ITEM',
      color: colors.ORDER_ITEM,
      width: 200,
    })),
    ...orderColumns({}, {}).filter(
      c =>
        ![
          'order.totalOrdered',
          'order.totalBatched',
          'order.totalShipped',
          'order.totalPrice',
        ].includes(c.key)
    ),
    ...orderFieldDefinitions.map(fieldDefinition => ({
      key: `order.customField.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'ORDER',
      color: colors.ORDER,
      width: 200,
    })),
    ...containerColumns,
    ...shipmentColumns,
    ...shipmentFieldDefinitions.map(fieldDefinition => ({
      key: `shipment.customField.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'SHIPMENT',
      color: colors.SHIPMENT,
      width: 200,
    })),
  ];
}
