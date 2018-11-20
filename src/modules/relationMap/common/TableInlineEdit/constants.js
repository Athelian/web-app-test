// @flow
import * as React from 'react';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import shipmentMessages from 'modules/shipment/messages';
import {
  metrics as weightMetrics,
  convert as weightConvert,
} from 'modules/form/helpers/metricInput/weightInput';
import {
  metrics as volumeMetrics,
  convert as volumeConvert,
} from 'modules/form/helpers/metricInput/volumeInput';
import {
  metrics as distanceMetrics,
  convert as distanceConvert,
} from 'modules/form/helpers/metricInput/distanceInput';
import { FormattedMessage } from 'react-intl';

export const orderColumnFields = [
  {
    name: 'poNo',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'piNo',
    type: 'text',
  },
  {
    name: 'issuedAt',
    type: 'date',
  },
  {
    name: 'exporter.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'currency',
    type: 'enum',
    meta: {
      enumType: 'Currency',
      isRequired: true,
    },
  },
  {
    name: 'incoterm',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    name: 'deliveryPlace',
    type: 'text',
  },
  {
    name: 'inCharges',
    type: 'inCharges',
    meta: {
      max: 5,
    },
  },
  {
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Order',
    },
  },
];

export const orderItemColumnFields = [
  {
    name: 'productProvider',
    type: 'productProvider',
  },
  {
    name: 'productProvider.product.serial',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'productProvider.exporter.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'productProvider.supplier.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'price.amount',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'price.currency',
    type: 'enum',
    meta: {
      enumType: 'Currency',
      isRequired: true,
    },
  },
  {
    name: 'quantity',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
];

export const batchColumnFields = [
  {
    name: 'no',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'quantity',
    type: 'numberAdjustment',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'deliveredAt',
    type: 'date',
  },
  {
    name: 'expiredAt',
    type: 'date',
  },
  {
    name: 'producedAt',
    type: 'date',
  },
  {
    name: 'packageName',
    type: 'text',
  },
  {
    name: 'packageQuantity',
    type: 'number',
  },
  {
    name: 'packageGrossWeight',
    type: 'metric',
    meta: {
      metrics: weightMetrics,
      convert: weightConvert,
    },
  },
  {
    name: 'packageVolume',
    type: 'metric',
    meta: {
      metrics: volumeMetrics,
      convert: volumeConvert,
    },
  },
  {
    name: 'packageSize.width',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
    },
  },
  {
    name: 'packageSize.height',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
    },
  },
  {
    name: 'packageSize.length',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
    },
  },
  {
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Batch',
    },
  },
];

export const shipmentColumnFields = [
  {
    name: 'no',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'blNo',
    type: 'text',
  },
  {
    name: 'blDate',
    type: 'date',
  },
  {
    name: 'bookingNo',
    type: 'text',
  },
  {
    name: 'bookingDate',
    type: 'date',
  },
  {
    name: 'invoiceNo',
    type: 'text',
  },
  {
    name: 'transportType',
    type: 'enum',
    meta: {
      enumType: 'TransportType',
    },
  },
  {
    name: 'loadType',
    type: 'enum',
    meta: {
      enumType: 'LoadType',
    },
  },
  {
    name: 'incoterm',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    name: 'carrier',
    type: 'text',
  },
  {
    name: 'forwarders',
    type: 'forwarders',
    meta: {
      max: 4,
    },
  },
  {
    name: 'inCharges',
    type: 'inCharges',
    meta: {
      max: 5,
    },
  },
  {
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Shipment',
    },
  },
  {
    name: 'cargoReady',
    type: 'timeline',
  },
];

export const orderColumns = [
  {
    group: 'ORDER',
    columns: [
      <FormattedMessage {...orderMessages.PO} />,
      <FormattedMessage {...orderMessages.PI} />,
      <FormattedMessage {...orderMessages.date} />,
      <FormattedMessage {...orderMessages.exporter} />,
      <FormattedMessage {...orderMessages.currency} />,
      <FormattedMessage {...orderMessages.incoterm} />,
      <FormattedMessage {...orderMessages.deliveryPlace} />,
      <FormattedMessage {...orderMessages.inCharge} />,
      <FormattedMessage {...orderMessages.tags} />,
    ],
  },
];

export const orderItemColumns = [
  {
    group: 'ORDER ITEM',
    columns: [
      <FormattedMessage id="modules.Products.name" defaultMessage="NAME" />,
      <FormattedMessage id="modules.Products.serial" defaultMessage="SERIAL" />,
      <FormattedMessage id="modules.ProductProviders.exporter" defaultMessage="EXPORTER" />,
      <FormattedMessage id="modules.ProductProviders.supplier" defaultMessage="SUPPLIER" />,
      <FormattedMessage id="modules.ProductProviders.unitPrice" defaultMessage="UNIT PRICE" />,
      <FormattedMessage
        id="modules.ProductProviders.unitPriceCurrency"
        defaultMessage="UNIT PRICE CURRENCY"
      />,
      <FormattedMessage id="global.quantity" defaultMessage="QUANTITY" />,
    ],
  },
];

export const batchColumns = [
  {
    group: 'BATCH',
    columns: [
      <FormattedMessage {...batchMessages.batchNo} />,
      <FormattedMessage {...batchMessages.quantity} />,
      <FormattedMessage {...batchMessages.deliveredAt} />,
      <FormattedMessage {...batchMessages.expiredAt} />,
      <FormattedMessage {...batchMessages.producedAt} />,
      <FormattedMessage {...batchMessages.tags} />,
    ],
  },
  {
    group: 'PACKING',
    columns: [
      <FormattedMessage {...batchMessages.packageName} />,
      <FormattedMessage {...batchMessages.packageQuantity} />,
      <FormattedMessage {...batchMessages.packageGrossWeight} />,
      <FormattedMessage {...batchMessages.packageVolume} />,
      <FormattedMessage id="modules.Batches.pkgLength" defaultMessage="PKG LENGTH" />,
      <FormattedMessage id="modules.Batches.pkgWidth" defaultMessage="PKG WIDTH" />,
      <FormattedMessage id="modules.Batches.pkgHeight" defaultMessage="PKG HEIGHT" />,
    ],
  },
];

export const shipmentColumns = [
  {
    group: 'SHIPMENT',
    columns: [
      <FormattedMessage {...shipmentMessages.shipmentId} />,
      <FormattedMessage {...shipmentMessages.blNo} />,
      <FormattedMessage {...shipmentMessages.blDate} />,
      <FormattedMessage {...shipmentMessages.bookingNo} />,
      <FormattedMessage {...shipmentMessages.bookingDate} />,
      <FormattedMessage {...shipmentMessages.invoiceNo} />,
      <FormattedMessage {...shipmentMessages.transportType} />,
      <FormattedMessage {...shipmentMessages.loadType} />,
      <FormattedMessage {...shipmentMessages.incoterms} />,
      <FormattedMessage {...shipmentMessages.carrier} />,
      <FormattedMessage {...shipmentMessages.forwarder} />,
      <FormattedMessage id="modules.Shipments.inCharge" defaultMessage="IN CHARGE " />,
      <FormattedMessage {...shipmentMessages.tags} />,
    ],
  },
  {
    group: 'TIMELINE',
    columns: [<FormattedMessage {...shipmentMessages.cargoReady} />],
  },
];
