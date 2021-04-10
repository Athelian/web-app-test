// @flow
import type { FilePayload } from 'generated/graphql';
import { Container } from 'unstated';
import { extractForbiddenId } from 'utils/data';
import { isEquals } from 'utils/fp';
import { cloneDeep, set } from 'lodash';

type FormState = {|
  files: Array<FilePayload>,
  hasCalledFilesApiYet: boolean,
|};

const initValues: FormState = {
  files: [],
  hasCalledFilesApiYet: false,
};

export default class ShipmentFilesContainer extends Container<FormState> {
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

  initDetailValues = (files: Array<FilePayload>, hasCalledFilesApiYet: boolean = false) => {
    const parsedFiles = [...files.map(file => extractForbiddenId(file))];
    this.setState({ files: parsedFiles, hasCalledFilesApiYet });
    this.originalValues = { files: parsedFiles, hasCalledFilesApiYet };
  };
}