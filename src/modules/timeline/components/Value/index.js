// @flow
import * as React from 'react';
import { FormattedDate, injectIntl, type IntlShape } from 'react-intl';
import pluralize from 'pluralize';
import { camelCase, lowerFirst, upperFirst } from 'lodash';
import { getByPath } from 'utils/fp';
import { ValueStyle } from './style';

type WrapperProps = {
  children: React.Node,
};

export const ValueWrapper = ({ children }: WrapperProps) => (
  <span className={ValueStyle}>{children}</span>
);

type Props = {
  value: any,
  entityType: string,
  intl: IntlShape,
  translationKey: string,
};

const FormattedValue = ({ value }: Props) => {
  if (!value) {
    return null;
  }

  switch (getByPath('__typename', value)) {
    case 'StringValue':
      return value.string;
    case 'IntValue':
      return value.int;
    case 'FloatValue':
      return value.float;
    case 'BooleanValue':
      return value.boolean ? 'true' : 'false';
    case 'DateTimeValue':
      return <FormattedDate value={new Date(value.datetime)} />;
    case 'MetricValueValue':
      return `${value.metricValue.value} ${value.metricValue.metric}`;
    case 'SizeValue':
      return `(${value.size.length.value} ${value.size.length.metric} x ${value.size.width.value} ${value.size.width.metric} x ${value.size.height.value} ${value.size.height.metric})`;
    case 'Values':
      return value.values
        .map(val => FormattedValue(val))
        .filter(Boolean)
        .join(', ');
    case 'EntityValue':
      return value?.entity?.name || '';
    default:
      return value;
  }
};

// TranslateDocumentType - mapping document type translation key
// ex: from `ShipmentWarehouseArrivalReport` to `warehouseArrivalReport`
const translatedDocumentType = (formattedValue: any, intl: IntlShape) => {
  const splittedValues = formattedValue.split('_');
  let translateId = 'common.other';
  if (splittedValues.length > 1) {
    const entityType = splittedValues[0];
    const pluralizedEntityType = pluralize(entityType);
    let module = pluralizedEntityType.charAt(0) + pluralizedEntityType.slice(1).toLowerCase();
    module = upperFirst(camelCase(module));
    const documentType = lowerFirst(camelCase(formattedValue));

    translateId = `modules.${module}.fileType.${documentType}`;
  }

  return intl.formatMessage({
    id: translateId,
    defaultMessage: formattedValue,
  });
};

const Value = ({ value, entityType, intl, translationKey }: Props) => {
  let formattedValue = FormattedValue({ value, entityType, intl, translationKey });
  if (entityType === 'file' && formattedValue !== null) {
    formattedValue = translatedDocumentType(formattedValue, intl);
  }
  if (translationKey !== undefined && translationKey !== '' && translationKey !== null) {
    const module = upperFirst(pluralize(entityType));
    formattedValue = intl.formatMessage({
      id: `modules.${module}.${translationKey}`,
      defaultMessage: formattedValue,
    });
  }
  return <ValueWrapper>{formattedValue}</ValueWrapper>;
};

export default injectIntl(Value);