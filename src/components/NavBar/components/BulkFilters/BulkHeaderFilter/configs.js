// @flow
import messages from './messages';
import type { FilterConfig } from './types';

const BulkFilterConfig: Array<FilterConfig> = [
  {
    entity: 'ORDER',
    value: 'poNos',
    message: messages.poNo,
  },
  {
    entity: 'PRODUCT',
    value: 'names',
    message: messages.name,
  },
  {
    entity: 'PRODUCT',
    value: 'serials',
    message: messages.serial,
  },
  {
    entity: 'SHIPMENT',
    value: 'nos',
    message: messages.shipmentNo,
  },
  {
    entity: 'CONTAINER',
    value: 'nos',
    message: messages.containerNo,
  },
];

export default BulkFilterConfig;