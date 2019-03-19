// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { cloneDeep, set } from 'lodash';
import type { Document } from 'components/Form/DocumentsInput/type.js.flow';

type FormState = {
  files?: Array<Document>,
};

const initValues = {
  files: [],
};

export default class OrderFilesContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: FormState): FormState => set(cloneDeep(prevState), path, value));
  };

  initDetailValues = (files: Array<Document>) => {
    this.setState({ files });
    this.originalValues = { files };
  };
}
