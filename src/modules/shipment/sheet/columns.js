// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';
import shipmentMessages from 'modules/shipment/messages';
import containerMessages from 'modules/container/messages';
import batchMessages from 'modules/batch/messages';
import orderMessages from '../../order/messages';

const shipmentColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.created',
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
    title: <FormattedMessage {...shipmentMessages.status} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 120,
  },
  {
    key: 'shipment.no',
    title: <FormattedMessage {...shipmentMessages.shipmentId} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.importer',
    title: <FormattedMessage {...shipmentMessages.importer} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  // exporter
  {
    key: 'shipment.forwarders',
    title: <FormattedMessage {...shipmentMessages.forwarder} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 810,
  },
  // related exporters
  {
    key: 'shipment.blNo',
    title: <FormattedMessage {...shipmentMessages.blNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.blDate',
    title: <FormattedMessage {...shipmentMessages.blDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.bookingNo',
    title: <FormattedMessage {...shipmentMessages.bookingNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.booked',
    title: <FormattedMessage {...shipmentMessages.booked} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.bookingDate',
    title: <FormattedMessage {...shipmentMessages.bookingDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.invoiceNo',
    title: <FormattedMessage {...shipmentMessages.invoiceNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.contractNo',
    title: <FormattedMessage {...shipmentMessages.contractNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.transportType',
    title: <FormattedMessage {...shipmentMessages.transportType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.loadType',
    title: <FormattedMessage {...shipmentMessages.loadType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.incoterm',
    title: <FormattedMessage {...shipmentMessages.incoterms} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.carrier',
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
    title: <FormattedMessage {...orderMessages.memo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.inCharges',
    title: <FormattedMessage {...shipmentMessages.inCharge} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 160,
  },
  // nb of voyages
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
];

const containerColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.created',
    title: <FormattedMessage {...containerMessages.createdAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'shipment.container.updated',
    title: <FormattedMessage {...containerMessages.updatedAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'shipment.container.archived',
    title: <FormattedMessage {...containerMessages.status} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 105,
  },
  {
    key: 'shipment.container.no',
    title: <FormattedMessage {...containerMessages.containerNo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.containerType',
    title: <FormattedMessage {...containerMessages.containerType} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 100,
  },
  {
    key: 'shipment.container.containerOption',
    title: <FormattedMessage {...containerMessages.containerOption} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 100,
  },
  {
    key: 'shipment.container.warehouseArrivalAgreedDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
  },
  {
    key: 'shipment.container.warehouseArrivalAgreedDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 160,
  },
  {
    key: 'shipment.container.warehouseArrivalAgreedDateApproved',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'shipment.container.warehouseArrivalActualDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
  },
  {
    key: 'shipment.container.warehouseArrivalActualDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 160,
  },
  {
    key: 'shipment.container.warehouseArrivalActualDateApproved',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'shipment.container.warehouse',
    title: <FormattedMessage {...containerMessages.warehouse} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.freeTime',
    title: <FormattedMessage {...containerMessages.freeTime} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 195,
  },
  {
    key: 'shipment.container.freeTimeStartDate',
    title: <FormattedMessage {...containerMessages.startDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 195,
  },
  {
    key: 'shipment.container.freeTimeDuration',
    title: <FormattedMessage {...containerMessages.duration} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.dueDate',
    title: <FormattedMessage {...containerMessages.dueDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.yardName',
    title: <FormattedMessage {...containerMessages.yardName} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.departureDate',
    title: <FormattedMessage {...containerMessages.departureDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 125,
  },
  {
    key: 'shipment.container.departureDateAssignedTo',
    title: <FormattedMessage {...containerMessages.departureDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 160,
  },
  {
    key: 'shipment.container.departureDateApproved',
    title: <FormattedMessage {...containerMessages.departureDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'shipment.container.tags',
    title: <FormattedMessage {...containerMessages.tags} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.memo',
    title: <FormattedMessage {...containerMessages.memo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  // total package quantity
  // total quantity
  // total volume
  // total weight
  // total price
  {
    key: 'shipment.container.logs',
    title: <FormattedMessage {...containerMessages.logs} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 120,
  },
  // actions
];

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.batch.created',
    title: <FormattedMessage {...batchMessages.createdAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
  },
  {
    key: 'shipment.container.batch.updated',
    title: <FormattedMessage {...batchMessages.updatedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
  },
  {
    key: 'shipment.container.batch.archived',
    title: <FormattedMessage {...batchMessages.status} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 105,
  },
  {
    key: 'shipment.container.batch.no',
    title: <FormattedMessage {...batchMessages.batchNo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.deliveredAt',
    title: <FormattedMessage {...batchMessages.deliveredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  {
    key: 'shipment.container.batch.desiredAt',
    title: <FormattedMessage {...batchMessages.desiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  {
    key: 'shipment.container.batch.expiredAt',
    title: <FormattedMessage {...batchMessages.expiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  {
    key: 'shipment.container.batch.producedAt',
    title: <FormattedMessage {...batchMessages.producedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  // tags
  // memo
  {
    key: 'shipment.container.batch.quantity',
    title: <FormattedMessage {...batchMessages.initialQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.quantityRevisions',
    title: <FormattedMessage {...batchMessages.sectionAdjustments} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 1035,
  },
  {
    key: 'shipment.container.batch.packageName',
    title: <FormattedMessage {...batchMessages.packageName} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.packageCapacity',
    title: <FormattedMessage {...batchMessages.packageCapacity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  // pkg qty
  // pkg auto qty
  // pkg weight
  // pkg vol
  // pkg auto vol
  // pkg size
  // tasks
  // custom fields mask
  // custom fields
  // actions
];

const orderItemColumns: Array<ColumnConfig> = [];

const orderColumns: Array<ColumnConfig> = [];

const columns: Array<ColumnConfig> = [
  ...shipmentColumns,
  ...containerColumns,
  ...batchColumns,
  ...orderItemColumns,
  ...orderColumns,
];

export default columns;
