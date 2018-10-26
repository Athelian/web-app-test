// @flow
import * as React from 'react';
import { cloneOrder, cloneOrderItem, cloneBatch, cloneShipment, cloneTree } from './clone';

type State = {
  result: Object,
};

type Props = {
  children: Function,
};

class ActionContainer extends React.Component<Props, State> {
  state = {
    result: {},
  };

  setResult = (result: Object) => {
    this.setState({
      result,
    });
  };

  cloneTree = async (client: any, target: Object) => {
    const clonedTree = await cloneTree(client, target);
    return clonedTree;
  };

  clone = async (client: any, target: Object) => {
    const { batch, order, orderItem, shipment } = target;
    // TODO: should run in parallel
    const [orderResults, orderFocus] = await cloneOrder(client, order);
    const [shipmentResults, shipmentFocus] = await cloneShipment(client, shipment);
    const [orderItemResult, orderItemFocus] = await cloneOrderItem(client, orderItem);
    const [batchResult, batchFocus] = await cloneBatch(client, batch);

    const result = {
      order: orderResults,
      orderItem: orderItemResult,
      batch: batchResult,
      shipment: shipmentResults,
    };
    const focus = {
      order: orderFocus,
      orderItem: orderItemFocus,
      batch: batchFocus,
      shipment: shipmentFocus,
    };
    return [result, focus];
  };

  getCloneFunction = (focusMode: string) => {
    switch (focusMode) {
      default:
      case 'TARGET':
        return this.clone;
      case 'TARGET_TREE':
        return this.cloneTree;
    }
  };

  render() {
    const { result } = this.state;
    const { children } = this.props;
    return children({
      result,
      setResult: this.setResult,
      clone: this.clone,
      cloneTree: this.cloneTree,
      getCloneFunction: this.getCloneFunction,
    });
  }
}

export default ActionContainer;
