/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FieldDefinition } from 'types';
import { colors } from 'styles/common';
import type { ColumnSortConfig, ColumnConfig } from 'components/Sheet/SheetState/types';
import shipmentMessages from 'modules/shipment/messages';
import { ColumnWidths, populateColumns } from 'modules/sheet/common/columns';

const columns: Array<ColumnConfig> = [
  {
    key: 'shipment.created',
    title: <FormattedMessage {...shipmentMessages.createdAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.updated',
    title: <FormattedMessage {...shipmentMessages.updatedAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.archived',
    title: <FormattedMessage {...shipmentMessages.status} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Status,
  },
  {
    key: 'shipment.followers',
    title: <FormattedMessage {...shipmentMessages.followers} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Followers,
  },
  {
    key: 'shipment.no',
    title: <FormattedMessage {...shipmentMessages.shipmentId} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.importer',
    title: <FormattedMessage {...shipmentMessages.importer} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Partner,
  },
  {
    key: 'shipment.exporter',
    title: <FormattedMessage {...shipmentMessages.mainExporter} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Partner,
  },
  {
    key: 'shipment.forwarders',
    title: <FormattedMessage {...shipmentMessages.forwarder} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Partners,
  },
  {
    key: 'shipment.relatedExporters',
    exportKey: 'relatedExporters',
    title: <FormattedMessage {...shipmentMessages.relatedExporters} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Partners,
  },
  {
    key: 'shipment.blNo',
    title: <FormattedMessage {...shipmentMessages.blNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.blDate',
    title: <FormattedMessage {...shipmentMessages.blDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.bookingNo',
    title: <FormattedMessage {...shipmentMessages.bookingNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.booked',
    title: <FormattedMessage {...shipmentMessages.booked} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.bookingDate',
    title: <FormattedMessage {...shipmentMessages.bookingDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.invoiceNo',
    title: <FormattedMessage {...shipmentMessages.invoiceNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.contractNo',
    title: <FormattedMessage {...shipmentMessages.contractNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.transportType',
    title: <FormattedMessage {...shipmentMessages.transportType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Select,
  },
  {
    key: 'shipment.loadType',
    title: <FormattedMessage {...shipmentMessages.loadType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Select,
  },
  {
    key: 'shipment.incoterm',
    title: <FormattedMessage {...shipmentMessages.incoterms} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Select,
  },
  {
    key: 'shipment.carrier',
    title: <FormattedMessage {...shipmentMessages.carrier} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.tags',
    title: <FormattedMessage {...shipmentMessages.tags} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.memo',
    title: <FormattedMessage {...shipmentMessages.memo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalBatchQuantity',
    title: <FormattedMessage {...shipmentMessages.totalBatchQuantity} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalPrice',
    title: <FormattedMessage {...shipmentMessages.totalPrice} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalProducts',
    title: <FormattedMessage {...shipmentMessages.totalProducts} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalOrders',
    title: <FormattedMessage {...shipmentMessages.totalOrders} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalBatches',
    title: <FormattedMessage {...shipmentMessages.totalBatches} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalContainers',
    title: <FormattedMessage {...shipmentMessages.totalContainers} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalPackages',
    title: <FormattedMessage {...shipmentMessages.totalPackages} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalWeight',
    title: <FormattedMessage {...shipmentMessages.totalWeight} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.totalVolume',
    title: <FormattedMessage {...shipmentMessages.totalVolume} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.numOfVoyages',
    title: <FormattedMessage {...shipmentMessages.numOfVoyages} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.cargoReady.latestDate',
    title: <FormattedMessage {...shipmentMessages.cargoReadyCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.cargoReady.dateDifference',
    title: <FormattedMessage {...shipmentMessages.cargoReadyDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.cargoReady.date',
    title: <FormattedMessage {...shipmentMessages.cargoReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.cargoReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.cargoReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.cargoReady.approved',
    title: <FormattedMessage {...shipmentMessages.cargoReadyApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.voyage.0.departurePort',
    title: <FormattedMessage {...shipmentMessages.loadPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.0.departure.latestDate',
    title: <FormattedMessage {...shipmentMessages.loadPortDepartureCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.0.departure.dateDifference',
    title: <FormattedMessage {...shipmentMessages.loadPortDepartureDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.0.departure.date',
    title: <FormattedMessage {...shipmentMessages.loadPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.0.departure.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.loadPortDepartureRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.voyage.0.departure.approved',
    title: <FormattedMessage {...shipmentMessages.loadPortDepartureApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.voyage.0.no',
    title: <FormattedMessage {...shipmentMessages.firstVoyageNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.0.vesselName',
    title: <FormattedMessage {...shipmentMessages.firstVesselName} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.0.vesselCode',
    title: <FormattedMessage {...shipmentMessages.firstVesselCode} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.0.firstTransitPort',
    title: <FormattedMessage {...shipmentMessages.firstTransitPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.latestDate',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortArrivalCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.dateDifference',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortArrivalDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.date',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.voyage.0.firstTransitArrival.approved',
    title: <FormattedMessage {...shipmentMessages.firstTransitArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.latestDate',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortDepartureCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.dateDifference',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortDepartureDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.date',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.firstTransitPortDepartureRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.voyage.1.firstTransitDeparture.approved',
    title: <FormattedMessage {...shipmentMessages.firstTransitDepartureApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.voyage.1.no',
    title: <FormattedMessage {...shipmentMessages.secondVoyageNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.1.vesselName',
    title: <FormattedMessage {...shipmentMessages.secondVesselName} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.1.vesselCode',
    title: <FormattedMessage {...shipmentMessages.secondVesselCode} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.1.secondTransitPort',
    title: <FormattedMessage {...shipmentMessages.secondTransitPort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.latestDate',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortArrivalCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.dateDifference',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortArrivalDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.date',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.voyage.1.secondTransitArrival.approved',
    title: <FormattedMessage {...shipmentMessages.secondTransitArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.latestDate',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortDepartureCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.dateDifference',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortDepartureDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.date',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortDeparture} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.secondTransitPortDepartureRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.voyage.2.secondTransitDeparture.approved',
    title: <FormattedMessage {...shipmentMessages.secondTransitDepartureApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.voyage.2.no',
    title: <FormattedMessage {...shipmentMessages.thirdVoyageNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.2.vesselName',
    title: <FormattedMessage {...shipmentMessages.thirdVesselName} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.2.vesselCode',
    title: <FormattedMessage {...shipmentMessages.thirdVesselCode} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.2.arrivalPort',
    title: <FormattedMessage {...shipmentMessages.dischargePort} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.voyage.2.arrival.latestDate',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrivalCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.2.arrival.dateDifference',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrivalDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.2.arrival.date',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.voyage.2.arrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.voyage.2.arrival.approved',
    title: <FormattedMessage {...shipmentMessages.dischargePortArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.containerGroup.customClearance.latestDate',
    title: <FormattedMessage {...shipmentMessages.customClearanceCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.customClearance.dateDifference',
    title: <FormattedMessage {...shipmentMessages.customClearanceDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.customClearance.date',
    title: <FormattedMessage {...shipmentMessages.customClearance} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.customClearance.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.customClearanceRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.containerGroup.customClearance.approved',
    title: <FormattedMessage {...shipmentMessages.customClearanceApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.containerGroup.warehouse',
    title: <FormattedMessage {...shipmentMessages.warehouse} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Partner,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.latestDate',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.dateDifference',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.date',
    title: <FormattedMessage {...shipmentMessages.warehouseArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.containerGroup.warehouseArrival.approved',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.latestDate',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyCurrentDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.dateDifference',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyDifferenceDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.date',
    title: <FormattedMessage {...shipmentMessages.deliveryReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Date,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateRevisions,
  },
  {
    key: 'shipment.containerGroup.deliveryReady.approved',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyApproved} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'shipment.files',
    title: <FormattedMessage {...shipmentMessages.sectionDocuments} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.todo',
    title: <FormattedMessage {...shipmentMessages.tasks} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  {
    key: 'shipment.logs',
    title: <FormattedMessage {...shipmentMessages.logs} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Logs,
  },
  {
    key: 'shipment.mask',
    title: <FormattedMessage {...shipmentMessages.mask} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: ColumnWidths.Default,
  },
  // actions
];

const exportKeys = {
  'shipment.created': ['shipment.createdAt', 'shipment.createdBy'],
  'shipment.updated': ['shipment.updatedAt', 'shipment.updatedBy'],
  'shipment.importer': ['shipment.importer', 'shipment.importerCode'],
  'shipment.exporter': ['shipment.exporter', 'shipment.exporterCode'],
  'shipment.cargoReady.approved': [
    'shipment.cargoReady.approvedAt',
    'shipment.cargoReady.approvedBy',
  ],
  'shipment.voyage.0.departure.approved': [
    'shipment.voyage.0.departure.approvedAt',
    'shipment.voyage.0.departure.approvedBy',
  ],
  'shipment.voyage.0.firstTransitArrival.approved': [
    'shipment.voyage.0.firstTransitArrival.approvedAt',
    'shipment.voyage.0.firstTransitArrival.approvedBy',
  ],
  'shipment.voyage.1.firstTransitDeparture.approved': [
    'shipment.voyage.1.firstTransitDeparture.approvedAt',
    'shipment.voyage.1.firstTransitDeparture.approvedBy',
  ],
  'shipment.voyage.1.secondTransitArrival.approved': [
    'shipment.voyage.1.secondTransitArrival.approvedAt',
    'shipment.voyage.1.secondTransitArrival.approvedBy',
  ],
  'shipment.voyage.2.secondTransitDeparture.approved': [
    'shipment.voyage.2.secondTransitDeparture.approvedAt',
    'shipment.voyage.2.secondTransitDeparture.approvedBy',
  ],
  'shipment.voyage.2.arrival.approved': [
    'shipment.voyage.2.arrival.approvedAt',
    'shipment.voyage.2.arrival.approvedBy',
  ],
  'shipment.containerGroup.customClearance.approved': [
    'shipment.containerGroup.customClearance.approvedAt',
    'shipment.containerGroup.customClearance.approvedBy',
  ],
  'shipment.containerGroup.warehouseArrival.approved': [
    'shipment.containerGroup.warehouseArrival.approvedAt',
    'shipment.containerGroup.warehouseArrival.approvedBy',
  ],
  'shipment.containerGroup.deliveryReady.approved': [
    'shipment.containerGroup.deliveryReady.approvedAt',
    'shipment.containerGroup.deliveryReady.approvedBy',
  ],
  'shipment.todo': [
    'shipment.todo.taskCount.count',
    'shipment.todo.taskCount.remain',
    'shipment.todo.taskCount.inProgress',
    'shipment.todo.taskCount.completed',
    'shipment.todo.taskCount.rejected',
    'shipment.todo.taskCount.approved',
    'shipment.todo.taskCount.skipped',
    'shipment.todo.taskCount.delayed',
  ],
  'shipment.totalVolume': ['shipment.totalVolume.value', 'shipment.totalVolume.metric'],
};

export default function shipmentColumns({
  sorts = {},
  fieldDefinitions = [],
}: {
  sorts?: { [string]: ColumnSortConfig },
  fieldDefinitions?: Array<FieldDefinition>,
}): Array<ColumnConfig> {
  return [
    ...populateColumns(columns, exportKeys, sorts),
    ...fieldDefinitions.map(fieldDefinition => ({
      key: `shipment.customField.${fieldDefinition.id}`,
      exportKey: `shipment.customFields.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'SHIPMENT',
      color: colors.SHIPMENT,
      width: ColumnWidths.Default,
    })),
  ];
}
