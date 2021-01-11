// @flow
import { getByPath } from 'utils/fp';
import { getLatestDate } from 'utils/shipment';

export const getValueBy = (field: string, values: Object) => {
  const currentValue = getByPath(field, values);
  const { hasOwnProperty } = Object.prototype;

  if (
    currentValue &&
    (hasOwnProperty.call(currentValue, 'timelineDateRevisions') ||
      hasOwnProperty.call(currentValue, 'date'))
  ) {
    return getLatestDate(currentValue);
  }
  return currentValue;
};

export default getValueBy;