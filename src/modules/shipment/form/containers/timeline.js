// @flow
import { Container } from 'unstated';
import { omit } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanUpData } from 'utils/data';

type ActionDetail = {
  approvedAt: ?Date,
  approvedBy: ?Object,
  assignedTo: Array<Object>,
  date: ?Date,
  timelineDateRevisions: Array<Object>,
};

type FormState = {
  cargoReady?: ActionDetail,
  containerGroups: Array<{
    customClearance?: ActionDetail,
    deliveryReady?: ActionDetail,
    warehouseArrival?: ActionDetail,
  }>,
  voyages: Array<{
    arrival?: ActionDetail,
    arrivalPort?: {
      airport: string,
      seaport: string,
    },
    departure?: ActionDetail,
    departurePort?: {
      airport: string,
      seaport: string,
    },
    vesselCode?: string,
    vesselName?: string,
  }>,
};

const initValues: FormState = {
  containerGroups: [{}],
  voyages: [{}],
};

export default class ShipmentTimelineContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldDeepValue = (path: string, value: any) => {
    this.setState(prevState => ({
      ...prevState,
      [path]: value,
    }));
  };

  cleanDataAfterChangeTransport = () => {
    this.setState(prevState => ({
      voyages: prevState.voyages
        ? prevState.voyages.map(item => ({
            ...item,
            arrivalPort: {
              seaport: '',
              airport: '',
            },
            departurePort: {
              seaport: '',
              airport: '',
            },
          }))
        : [{}],
    }));
  };

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = omit(prevState, path);
      return removeNulls(cloneState);
    });
  };

  initDetailValues = (values: any) => {
    const parsedValues = cleanUpData(values);
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
