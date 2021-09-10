// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import type { TaskCount } from 'generated/graphql';
import { isEquals } from 'utils/fp';
import { cleanFalsyAndTypeName } from 'utils/data';
import { initDatetimeToContainer } from 'utils/date';

export type State = {
  name: string,
  description?: string,
  dueDate?: Date,
  taskCount: TaskCount,
  archived?: boolean,
};

export const initValues = {
  name: '',
  taskCount: {
    count: 0,
    remain: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    approved: 0,
    skipped: 0,
    delayed: 0,
  },
};

export default class ProjectInfoContainer extends Container<State> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = this.state;
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object, defaultFollower: Object, timezone: string) => {
    const { dueDate, ...rest } = values;
    const info = {
      ...initDatetimeToContainer(dueDate, 'dueDate', timezone),
      defaultFollower,
      ...rest,
    };
    const parsedValues: Object = { ...initValues, ...info };

    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

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

  // On change partners, set new partners and clean up Followers
  onChangePartners = (newPartners: Array<Object>) => {
    this.setState(({ followers = [], organizations: oldPartners = [] }) => {
      const removedPartners = oldPartners.filter(
        oldPartner => !newPartners.some(newPartner => newPartner.id === oldPartner.id)
      );

      if (oldPartners.length > 0 && removedPartners.length > 0) {
        const cleanedFollowers = followers.filter(
          follower =>
            !removedPartners.some(
              removedPartner => removedPartner.id === follower?.organization?.id
            )
        );

        return { organizations: newPartners, followers: cleanedFollowers };
      }

      return { organizations: newPartners };
    });
  };
}