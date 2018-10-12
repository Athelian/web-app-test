// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsy, cleanUpData } from 'utils/data';

type Metric = {
  value: number,
  metric: string,
};

export type BatchFormState = {
  id?: ?string,
  no?: ?string,
  packageName?: ?string,
  packageCapacity: number,
  packageQuantity: number,
  quantity: number,
  batchAdjustments: Array<any>,
  packageGrossWeight: Metric,
  packageVolume: Metric,
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
  deliveredAt?: ?Date | string,
  expiredAt?: ?Date | string,
  producedAt?: ?Date | string,
  orderItem?: Object,
  tags?: Array<Object>,
  memo?: string,
};

const initValues = {
  packageName: '',
  packageCapacity: 0,
  packageQuantity: 0,
  quantity: 0,
  deliveredAt: '',
  expiredAt: '',
  producedAt: '',
  batchAdjustments: [],
  packageGrossWeight: { value: 0, metric: 'kg' },
  packageVolume: {
    metric: 'cm³',
    value: 0,
  },
  packageSize: {
    width: {
      metric: 'cm',
      value: 0,
    },
    height: {
      metric: 'cm',
      value: 0,
    },
    length: {
      metric: 'cm',
      value: 0,
    },
  },
};

export default class BatchFormContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setFieldArrayValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
    });
  };

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };

  syncProductProvider = (productProvider: Object) => {
    const { packageCapacity, packageGrossWeight, packageName, packageVolume } = productProvider;

    this.setState({
      packageCapacity,
      packageGrossWeight,
      packageName,
      packageVolume,
    });
  };

  calculatePackageQuantity = () => {
    this.setState(prevState => ({
      packageQuantity:
        prevState.packageCapacity > 0 &&
        prevState.batchAdjustments.reduce(
          (total, adjustment) => adjustment.quantity + total,
          prevState.quantity
        ) > 0
          ? prevState.batchAdjustments.reduce(
              (total, adjustment) => adjustment.quantity + total,
              prevState.quantity
            ) / prevState.packageCapacity
          : 0,
    }));
  };

  calculatePackageVolume = () => {
    // TODO: use https://github.com/ben-ng/convert-units for converting unit
    this.setState(prevState => {
      const newState = set(
        cloneDeep(prevState),
        'packageVolume.value',
        prevState.packageSize.height.value *
          prevState.packageSize.width.value *
          prevState.packageSize.length.value
      );
      return newState;
    });
  };
}
