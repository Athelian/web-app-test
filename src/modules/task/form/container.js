// @flow
import { Container } from 'unstated';
import { cleanFalsy, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  name?: string,
  duDate?: string,
  startDate?: string,
  description?: string,
  tags?: Array<Object>,
  memo?: string,
  assignedTo?: Array<Object>,
  inProgressBy?: Object,
  inProgressAt?: string,
  completedBy?: Object,
  completedAt?: string,
};

export const initValues = {
  dueDate: '',
  startDate: '',
  name: '',
  memo: '',
  tags: [],
  assignedTo: [],
  completedBy: null,
  inProgressBy: null,
};

export default class TaskContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };
}
