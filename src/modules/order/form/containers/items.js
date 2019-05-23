// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';

type FormState = {
  orderItems: Array<Object>,
  hasCalledApiYet: boolean,
};

const initValues: FormState = {
  orderItems: [],
  hasCalledApiYet: false,
};

export default class OrderItemsContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  setFieldArrayValue = (index: number, value: any) => {
    this.setState(prevState =>
      update(prevState, {
        orderItems: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (orderItems: Array<Object>, hasCalledApiYet: boolean = false) => {
    this.setState({ orderItems, hasCalledApiYet });
    if (hasCalledApiYet) {
      this.originalValues = { orderItems, hasCalledApiYet };
    }
  };

  resetAmountWithNewCurrency = (currency: string) => {
    let retry;
    if (this.state.hasCalledApiYet) {
      const { orderItems } = this.state;
      this.setState({
        orderItems: orderItems.map(orderItem => ({
          ...orderItem,
          price: {
            ...orderItem.price,
            amount: 0,
            currency,
          },
        })),
      });
    } else {
      const waitForApiReady = () => {
        if (this.state.hasCalledApiYet) {
          const { orderItems } = this.state;
          this.setState({
            orderItems: orderItems.map(orderItem => ({
              ...orderItem,
              price: {
                ...orderItem.price,
                amount: 0,
                currency,
              },
            })),
          });
          cancelAnimationFrame(retry);
        } else {
          retry = requestAnimationFrame(waitForApiReady);
        }
      };
      retry = requestAnimationFrame(waitForApiReady);
    }
  };
}
