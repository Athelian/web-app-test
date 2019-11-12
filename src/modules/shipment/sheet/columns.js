// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';
import shipmentMessages from 'modules/shipment/messages';
import containerMessages from 'modules/container/messages';
import batchMessages from 'modules/batch/messages';
import orderItemMessages from 'modules/orderItem/messages';
import orderMessages from 'modules/order/messages';

const shipmentColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.created',
    exportKey: 'createdAt',
    title: <FormattedMessage {...shipmentMessages.createdAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
    sort: {
      name: 'createdAt',
      group: 'shipment',
    },
  },
  {
    key: 'shipment.updated',
    exportKey: 'updatedAt',
    title: <FormattedMessage {...shipmentMessages.updatedAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
    sort: {
      name: 'updatedAt',
      group: 'shipment',
    },
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
    exportKey: 'no',
    title: <FormattedMessage {...shipmentMessages.shipmentId} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      name: 'no',
      group: 'shipment',
    },
  },
  {
    key: 'shipment.importer',
    title: <FormattedMessage {...shipmentMessages.importer} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.exporter',
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
    key: 'shipment.relatedExporters',
    exportKey: 'relatedExporters',
    title: <FormattedMessage {...shipmentMessages.relatedExporters} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 810,
  },
  {
    key: 'shipment.blNo',
    exportKey: 'blNo',
    title: <FormattedMessage {...shipmentMessages.blNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      name: 'blNo',
      group: 'shipment',
    },
  },
  {
    key: 'shipment.blDate',
    exportKey: 'blDate',
    title: <FormattedMessage {...shipmentMessages.blDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.bookingNo',
    exportKey: 'bookingNo',
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
    exportKey: 'bookingDate',
    title: <FormattedMessage {...shipmentMessages.bookingDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
  },
  {
    key: 'shipment.invoiceNo',
    exportKey: 'invoiceNo',
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
    exportKey: 'transportType',
    title: <FormattedMessage {...shipmentMessages.transportType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.loadType',
    exportKey: 'loadType',
    title: <FormattedMessage {...shipmentMessages.loadType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.incoterm',
    exportKey: 'incoterm',
    title: <FormattedMessage {...shipmentMessages.incoterms} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 100,
  },
  {
    key: 'shipment.carrier',
    exportKey: 'carrier',
    title: <FormattedMessage {...shipmentMessages.carrier} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.tags',
    exportKey: 'tags',
    title: <FormattedMessage {...shipmentMessages.tags} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.memo',
    exportKey: 'memo',
    title: <FormattedMessage {...orderMessages.memo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.inCharges',
    exportKey: 'inCharges',
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
    exportKey: 'cargoReady.date',
    title: <FormattedMessage {...shipmentMessages.cargoReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'cargoReady',
      group: 'shipment',
    },
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
    exportKey: 'voyage_1.departurePort',
    title: <FormattedMessage {...shipmentMessages.loadPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.0.departure.date',
    exportKey: 'voyage_1.departure.date',
    title: <FormattedMessage {...shipmentMessages.loadPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'loadPortDeparture',
      group: 'shipment',
    },
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
    exportKey: 'voyage_1.arrivalPort',
    title: <FormattedMessage {...shipmentMessages.firstTransitPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.date',
    exportKey: 'voyage_1.arrival.date',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'firstTransitPortArrival',
      group: 'shipment',
    },
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
    exportKey: 'voyage_2.departure.date',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'firstTransitPortDeparture',
      group: 'shipment',
    },
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
    exportKey: 'voyage_2.arrivalPorte',
    title: <FormattedMessage {...shipmentMessages.secondTransitPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.date',
    exportKey: 'voyage_2.arrival.date',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'secondTransitPortArrival',
      group: 'shipment',
    },
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
    exportKey: 'voyage_3.departure.date',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'secondTransitPortDeparture',
      group: 'shipment',
    },
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
    exportKey: 'voyage_3.arrivalPort',
    title: <FormattedMessage {...shipmentMessages.dischargePort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.voyage.2.arrival.date',
    exportKey: 'voyage_3.arrival.date',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'dischargePortArrival',
      group: 'shipment',
    },
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
    exportKey: 'containerGroup.customClearance.date',
    title: <FormattedMessage {...shipmentMessages.customClearance} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'customClearance',
      group: 'shipment',
    },
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
    exportKey: 'containerGroup.warehouse.name',
    title: <FormattedMessage {...shipmentMessages.warehouse} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.date',
    exportKey: 'containerGroup.warehouseArrival.date',
    title: <FormattedMessage {...shipmentMessages.warehouseArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'warehouseArrival',
      group: 'shipment',
    },
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
    exportKey: 'containerGroup.deliveryReady.date',
    title: <FormattedMessage {...shipmentMessages.deliveryReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 125,
    sort: {
      name: 'deliveryReady',
      group: 'shipment',
    },
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
    exportKey: 'containers.createdAt',
    title: <FormattedMessage {...containerMessages.createdAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
    sort: {
      local: true,
      default: true,
      name: 'createdAt',
      group: 'container',
    },
  },
  {
    key: 'shipment.container.updated',
    exportKey: 'containers.updatedAt',
    title: <FormattedMessage {...containerMessages.updatedAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'container',
    },
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
    exportKey: 'containers.no',
    title: <FormattedMessage {...containerMessages.containerNo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'no',
      group: 'container',
    },
  },
  {
    key: 'shipment.container.containerType',
    title: <FormattedMessage {...containerMessages.containerType} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 100,
    sort: {
      local: true,
      name: 'containerType',
      group: 'container',
    },
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
    exportKey: 'containers.warehouseArrivalAgreedDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
    sort: {
      local: true,
      name: 'warehouseArrivalAgreedDate',
      group: 'container',
    },
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
    exportKey: 'containers.warehouseArrivalActualDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
    sort: {
      local: true,
      name: 'warehouseArrivalActualDate',
      group: 'container',
    },
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
    exportKey: 'containers.warehouse.name',
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
    exportKey: 'containers.freeTimeStartDate',
    title: <FormattedMessage {...containerMessages.startDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 195,
    sort: {
      local: true,
      name: 'freeTimeStartDate',
      group: 'container',
    },
  },
  {
    key: 'shipment.container.freeTimeDuration',
    exportKey: 'containers.freeTimeDuration',
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
    exportKey: 'containers.yardName',
    title: <FormattedMessage {...containerMessages.yardName} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'yardName',
      group: 'container',
    },
  },
  {
    key: 'shipment.container.departureDate',
    exportKey: 'containers.departureDate',
    title: <FormattedMessage {...containerMessages.departureDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 125,
    sort: {
      local: true,
      name: 'departureDate',
      group: 'container',
    },
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
    exportKey: 'containers.memo',
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
    sort: {
      local: true,
      default: true,
      name: 'createdAt',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.updated',
    title: <FormattedMessage {...batchMessages.updatedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'batch',
    },
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
    exportKey: 'containers.batches.no',
    title: <FormattedMessage {...batchMessages.batchNo} />,
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
    key: 'shipment.container.batch.deliveredAt',
    title: <FormattedMessage {...batchMessages.deliveredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'deliveredAt',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.desiredAt',
    title: <FormattedMessage {...batchMessages.desiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'desiredAt',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.expiredAt',
    title: <FormattedMessage {...batchMessages.expiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'expiredAt',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.producedAt',
    title: <FormattedMessage {...batchMessages.producedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'producedAt',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.tags',
    title: <FormattedMessage {...batchMessages.tags} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.memo',
    title: <FormattedMessage {...batchMessages.memo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.latestQuantity',
    title: <FormattedMessage {...batchMessages.currentQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.quantity',
    exportKey: 'containers.batches.quantity',
    title: <FormattedMessage {...batchMessages.initialQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'quantity',
      group: 'batch',
    },
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
    sort: {
      local: true,
      name: 'packageName',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.packageCapacity',
    title: <FormattedMessage {...batchMessages.packageCapacity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageCapacity',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.packageQuantity',
    title: <FormattedMessage {...batchMessages.packageQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 250,
    sort: {
      local: true,
      name: 'packageQuantity',
      group: 'batch',
    },
  },
  {
    key: 'shipment.container.batch.packageGrossWeight',
    title: <FormattedMessage {...batchMessages.packageGrossWeight} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.packageVolume',
    title: <FormattedMessage {...batchMessages.packageVolume} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.packageSize',
    title: <FormattedMessage {...batchMessages.packageSizeGrouped} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 280,
  },
  {
    key: 'shipment.container.batch.todo',
    title: <FormattedMessage {...batchMessages.tasks} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.logs',
    title: <FormattedMessage {...batchMessages.logs} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 120,
  },
  // custom fields mask
  // custom fields
  // actions
];

const orderItemColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.batch.orderItem.created',
    title: <FormattedMessage {...orderItemMessages.createdAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
  },
  {
    key: 'shipment.container.batch.orderItem.updated',
    title: <FormattedMessage {...orderItemMessages.updatedAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
  },
  {
    key: 'shipment.container.batch.orderItem.archived',
    title: <FormattedMessage {...orderItemMessages.status} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 105,
  },
  {
    key: 'shipment.container.batch.orderItem.productProvider.product.name',
    exportKey: 'containers.batches.orderItem.productProvider.product.name',
    title: <FormattedMessage {...orderItemMessages.productName} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.productProvider.product.serial',
    exportKey: 'containers.batches.orderItem.productProvider.product.serial',
    title: <FormattedMessage {...orderItemMessages.productSerial} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.no',
    title: <FormattedMessage {...orderItemMessages.no} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.quantity',
    title: <FormattedMessage {...orderItemMessages.quantity} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.price',
    exportKey: 'containers.batches.orderItem.price',
    title: <FormattedMessage {...orderItemMessages.unitPrice} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.deliveryDate',
    title: <FormattedMessage {...orderItemMessages.deliveryDate} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 125,
  },
  {
    key: 'shipment.container.batch.orderItem.tags',
    title: <FormattedMessage {...orderItemMessages.tags} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.memo',
    title: <FormattedMessage {...orderItemMessages.memo} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.files',
    title: <FormattedMessage {...orderItemMessages.sectionDocuments} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.todo',
    title: <FormattedMessage {...orderItemMessages.tasks} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.logs',
    title: <FormattedMessage {...orderItemMessages.logs} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 120,
  },
  // custom fields mask
  // custom fields
  // actions
];

const orderColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.batch.orderItem.order.created',
    title: <FormattedMessage {...orderMessages.createdAt} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 110,
  },
  {
    key: 'shipment.container.batch.orderItem.order.updated',
    title: <FormattedMessage {...orderMessages.updatedAt} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 110,
  },
  {
    key: 'shipment.container.batch.orderItem.order.archived',
    title: <FormattedMessage {...orderMessages.status} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 120,
  },
  {
    key: 'shipment.container.batch.orderItem.order.poNo',
    exportKey: 'containers.batches.orderItem.order.poNo',
    title: <FormattedMessage {...orderMessages.PO} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.importer',
    title: <FormattedMessage {...orderMessages.importer} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.exporter',
    title: <FormattedMessage {...orderMessages.exporter} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.piNo',
    title: <FormattedMessage {...orderMessages.PI} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.issuedAt',
    title: <FormattedMessage {...orderMessages.date} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 125,
  },
  {
    key: 'shipment.container.batch.orderItem.order.deliveryDate',
    title: <FormattedMessage {...orderMessages.deliveryDate} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 125,
  },
  {
    key: 'shipment.container.batch.orderItem.order.currency',
    title: <FormattedMessage {...orderMessages.currency} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
  },
  {
    key: 'shipment.container.batch.orderItem.order.incoterm',
    title: <FormattedMessage {...orderMessages.incoterm} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
  },
  {
    key: 'shipment.container.batch.orderItem.order.deliveryPlace',
    title: <FormattedMessage {...orderMessages.deliveryPlace} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.tags',
    title: <FormattedMessage {...orderMessages.tags} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.memo',
    title: <FormattedMessage {...orderMessages.memo} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.inCharges',
    title: <FormattedMessage {...orderMessages.inCharge} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 160,
  },
  {
    key: 'shipment.container.batch.orderItem.order.files',
    title: <FormattedMessage {...orderMessages.sectionDocuments} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.todo',
    title: <FormattedMessage {...orderMessages.tasks} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.order.logs',
    title: <FormattedMessage {...orderMessages.logs} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 120,
  },
  // custom fields mask
  // custom fields
  // actions
];

const columns: Array<ColumnConfig> = [
  ...shipmentColumns,
  ...containerColumns,
  ...batchColumns,
  ...orderItemColumns,
  ...orderColumns,
];

export default columns;
