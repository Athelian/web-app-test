// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { cloneDeep, set } from 'lodash';

type FormState = {
  todo: {
    tasks?: Array<Object>,
  },
};

const initValues = {
  todo: {
    tasks: [],
  },
};

export default class ShipmentTasksContainer extends Container<FormState> {
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

  applyTemplate = (template: Object) => {
    const nonTemplateTasks = this.state.todo.tasks.filter(task => !task.taskTemplate);
    const newTaskList = [...nonTemplateTasks, ...template.tasks];

    this.setState({ todo: { tasks: newTaskList, taskTemplate: template } });
  };

  initDetailValues = (todo: { tasks: Array<Object> }) => {
    const parsedValues: Object = { ...initValues, todo };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
