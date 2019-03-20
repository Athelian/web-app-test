// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsy } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  containers: Array<Object>,
};

const initValues = {
  containers: [],
};

export default class ContainersContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setDeepFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (containers: Array<Object>) => {
    this.setState({ containers });
    this.originalValues = { containers };
  };
}
