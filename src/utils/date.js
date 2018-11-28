// @flow
import format from 'date-fns/format';

export const formatToDateInput = (date: Date): string => format(date, 'yyyy-MM-dd');

export default formatToDateInput;
