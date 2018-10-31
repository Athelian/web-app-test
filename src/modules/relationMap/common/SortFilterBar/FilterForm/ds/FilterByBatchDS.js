import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const filterByBatchDS = [
  {
    key: 'batch.multiSelect.tagIds',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.tag" defaultMessage="Tag" />,
    form: null,
  },
  {
    key: 'batch.range.deliveryDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.deliveryDate"
        defaultMessage="Delivery Date"
      />
    ),
    form: null,
  },
  {
    key: 'batch.range.desiredDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.desiredDate" defaultMessage="Desired Date" />
    ),
    form: null,
  },
  {
    key: 'batch.range.expiryDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.expiryDate" defaultMessage="Expiry Date" />
    ),
    form: null,
  },
  {
    key: 'batch.range.productionDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.productionDate"
        defaultMessage="Production Date"
      />
    ),
    form: null,
  },
];

export default filterByBatchDS;
