// @flow
import { uniqBy } from 'lodash';
import { isNullOrUndefined } from 'utils/fp';
import { volumeConvert } from 'utils/metric';
import { addDays } from 'date-fns';

type BatchProp = {
  orderItem: {
    order: {
      id: string,
    },
  },
};

type Metric = {
  metric: string,
  value: number,
};

export const uniqueOrders = (batches: Array<BatchProp>): Array<Object> =>
  uniqBy(batches.map(batch => batch.orderItem.order), 'id');

const calculateBatchTotalVolume = (batch: Object): Metric => {
  const {
    packageQuantity = 0,
    packageVolume,
  }: {
    packageQuantity: number,
    packageVolume: Object,
  } = batch;
  const volume = isNullOrUndefined(packageVolume)
    ? 0
    : volumeConvert(packageVolume.value, packageVolume.metric, 'm³');

  return {
    metric: 'm³',
    value: packageQuantity * volume,
  };
};

export const calculateContainerTotalVolume = ({ batches = [] }: Object): Metric => ({
  metric: 'm³',
  value: batches
    .map(calculateBatchTotalVolume)
    .map(volume => volume.value)
    .reduce((a, b) => a + b, 0),
});

export const calculateDueDate = (freeTimeStartDate: string, freeTimeDuration: number = 0) =>
  addDays(new Date(freeTimeStartDate), freeTimeDuration);

export default uniqueOrders;
