// @flow
import { Container } from 'unstated';
import { getByPathWithDefault as get, omit, isEmpty } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH } from 'modules/relationMap/constants';

type RelationMapState = {
  focusedId: string,
  focusedItem: Object,
  targetedItem: Object,
  focusMode: string,
  trees: Array<Object>,
  lines: Array<Object>,
};

const getInitialItem = () => ({
  order: {},
  orderItem: {},
  batch: {},
  shipment: {},
});

const initState = () => ({
  focusedItem: getInitialItem(),
  targetedItem: getInitialItem(),
  focusMode: '',
  focusedId: '',
  trees: [],
  lines: [],
});

const createTreeObj = (entity: Object) =>
  Object.keys(entity || {}).reduce(
    (obj, entityId) =>
      Object.assign(obj, {
        [entityId]: true,
      }),
    {}
  );

const createLineObj = (entity: Object, type: string) =>
  Object.keys(entity || {}).reduce(
    (obj, entityId) =>
      Object.assign(obj, {
        [entityId]: {
          id: entityId,
          type,
          line: true,
          related: true,
        },
      }),
    {}
  );

const getAllIds = (item: Object) =>
  Object.keys({ ...item.order, ...item.orderItem, ...item.batch });

const filterRelated = (trees: Array<Object>, itemRelation: Object) => {
  const relatedIds = getAllIds(itemRelation);
  const filteredTree = trees.filter(tree => {
    const isRelated = relatedIds.some(relatedId => get(false, `${relatedId}`, tree));
    return !isRelated;
  });
  return filteredTree;
};

const getRemovedIds = (trees: Array<Object>, itemRelation: Object) => {
  const relatedIds = getAllIds(itemRelation);
  const removedTree = trees.find(prevTree => {
    const isRelated = relatedIds.some(relatedId => prevTree[relatedId]);
    return isRelated;
  });
  const removedIds = Object.keys(removedTree || {});
  return removedIds;
};

const mapLine = (itemRelation: Object, relation: Object) => (line: Object) => {
  const { type: itemType, isLast } = relation;
  if (itemType !== ORDER_ITEM) {
    return line;
  }
  const lineIds = Object.keys(line);
  const orderItemLines = lineIds.filter(lineId => {
    const currentLine = line[lineId];
    return currentLine.type === ORDER_ITEM;
  });
  return lineIds.reduce((obj, lineId) => {
    const currentLine = line[lineId];
    if (itemRelation.order[lineId] || itemRelation.orderItem[lineId]) {
      return Object.assign(obj, {
        [lineId]: {
          id: lineId,
          line: orderItemLines.length === 1 ? false : !isLast,
          related: false,
        },
      });
    }
    if (itemRelation.batch[lineId]) {
      return Object.assign(obj, {
        [lineId]: {
          id: lineId,
          line: false,
          related: false,
        },
      });
    }
    return Object.assign(obj, {
      [lineId]: {
        ...currentLine,
        ...(orderItemLines.length === 1 ? { line: false } : {}),
      },
    });
  }, {});
};
export default class RelationMapContainer extends Container<RelationMapState> {
  state = initState();

  currentTree: Object = {};

  overrideState = (state: Object) => {
    this.setState(prevState => ({ ...prevState, ...state }));
  };

  changeMode = (focusMode: string) => {
    this.setState({
      focusMode,
    });
  };

  selectFocusItem = (focusedItem: Object) => {
    this.setState({
      focusedItem,
    });
  };

  selectTargetItem = (targetedItem: Object) => {
    this.setState({
      targetedItem,
    });
  };

  unSelectAll = (type: string) => {
    this.setState(prevState => ({
      focusMode: 'TARGET',
      targetedItem: {
        ...prevState.targetedItem,
        [type]: {},
      },
    }));
  };

  selectAll = (data: Object) => (type: string) => {
    const itemIds = Object.keys(data[type] || {});
    const itemAll = itemIds.reduce((obj, itemId) => Object.assign(obj, { [itemId]: true }), {});
    this.setState(prevState => ({
      focusMode: 'TARGET',
      targetedItem: {
        ...prevState.targetedItem,
        [type]: itemAll,
      },
    }));
  };

  changeFocusItem = (newState: RelationMapState) => {
    this.setState(newState);
  };

  reset = () => {
    this.setState(initState());
  };

  cancelTarget = () => {
    this.setState(prevState => Object.assign(prevState, { targetedItem: {}, focusMode: '' }));
  };

  resetTargetedItem = (itemRelation: Object, relation: Object) => {
    const { type: itemType } = relation;
    const removeItem = this.formatTargetTreeItem(itemRelation, itemType);
    const removeObj = { ...removeItem.order, ...removeItem.orderItem, ...removeItem.batch };
    const removeIds = Object.keys(removeObj);
    this.setState(prevState => {
      const { targetedItem } = prevState;
      const { order, orderItem, batch } = targetedItem;
      const newTarget = Object.assign(targetedItem, {
        order: itemType === ORDER_ITEM ? order : omit(Object.keys(itemRelation.order || {}), order),
        orderItem: omit(Object.keys(itemRelation.orderItem || {}), orderItem),
        batch: omit(Object.keys(itemRelation.batch || {}), batch),
      });
      return {
        ...prevState,
        focusMode: 'TARGET',
        targetedItem: newTarget,
        trees: prevState.trees.map(tree => omit(removeIds, tree)),
        lines: prevState.lines
          .filter(line => (itemType === ORDER ? !removeIds.some(removeId => line[removeId]) : true))
          .map(mapLine(itemRelation, relation)),
      };
    });
  };

  resetFocusedItem = () => {
    this.setState(prevState => ({
      ...prevState,
      focusedItem: {},
      focusedId: '',
    }));
  };

  isTargeted = (itemType: string, id: string) => {
    const { targetedItem } = this.state;
    const isTargeted = get(false, `${itemType}.${id}` || '', targetedItem);
    return isTargeted;
  };

  isTargetAnyItem = () => {
    const {
      targetedItem: { order = {}, orderItem = {}, batch = {}, shipment = {} },
    } = this.state;
    return !isEmpty(order) || !isEmpty(orderItem) || !isEmpty(batch) || !isEmpty(shipment);
  };

  isCurrentTree = (id: string) => this.state.trees.some(tree => tree[id]);

  isSubTree = (itemRelation: Object, itemType: string) => {
    const ids = Object.keys({
      ...(itemType === ORDER_ITEM ? {} : itemRelation.order),
      ...itemRelation.orderItem,
      ...itemRelation.batch,
    });
    const { trees } = this.state;
    return ids.every(id => trees.some(tree => get(false, id, tree)));
  };

  isTargetedLine = (id: string) => {
    const { lines } = this.state;
    return lines.some(line => line[id] && line[id].line);
  };

  isRelatedLine = (id: string) => {
    const { lines } = this.state;
    return lines.some(line => line[id] && line[id].related);
  };

  isRelatedTree = (itemRelation: Object) => {
    const { trees } = this.state;
    const relatedIds = Object.keys({
      ...itemRelation.order,
      ...itemRelation.orderItem,
      ...itemRelation.batch,
    });
    return trees.some(tree => relatedIds.some(relatedId => tree[relatedId]));
  };

  isFocused = (itemType: string, id: string) => {
    const { focusedItem } = this.state;
    const isFocused = get(false, `${itemType}.${id}` || '', focusedItem);
    return isFocused;
  };

  highlightTree = (focusedItem: Object, focusedId: string) => {
    this.setState(prevState => ({
      ...prevState,
      focusedId,
      focusedItem,
      // focusMode: 'HIGHLIGHT',
    }));
  };

  formatTargetTreeItem = (itemRelation: Object, itemType: ?string) => {
    const targetedItem =
      itemType === ORDER_ITEM
        ? { ...itemRelation, order: {}, shipment: {} }
        : { ...itemRelation, shipment: {} };
    return targetedItem;
  };

  targetTree = (itemRelation: Object, relation: Object) => {
    const { type: itemType } = relation;
    const targetedItem = this.formatTargetTreeItem(itemRelation, itemType);
    const { order = {}, orderItem = {}, batch = {} } = targetedItem;
    const tree = {
      ...(itemType !== ORDER_ITEM ? createTreeObj(order) : {}),
      ...createTreeObj(orderItem),
      ...createTreeObj(batch),
    };
    const line = {
      ...createLineObj(order, ORDER),
      ...(itemType !== ORDER_ITEM ? createLineObj(orderItem, ORDER_ITEM) : {}),
      ...createLineObj(batch, BATCH),
    };
    this.setState(prevState => {
      const {
        order: targetOrder,
        orderItem: targetOrderItem,
        batch: targetBatch,
      } = prevState.targetedItem;
      const prevTrees = filterRelated(prevState.trees, itemRelation);
      const prevLines = filterRelated(prevState.lines, itemRelation);
      const removedIds = getRemovedIds(prevState.trees, itemRelation);
      return Object.assign(prevState, {
        targetedItem: {
          order: { ...omit(removedIds, targetOrder), ...order },
          orderItem: { ...omit(removedIds, targetOrderItem), ...orderItem },
          batch: { ...omit(removedIds, targetBatch), ...batch },
        },
        focusMode: 'TARGET_TREE',
        trees: [...prevTrees, tree],
        lines: [...prevLines, line],
      });
    });
  };

  overrideTarget = (item: Object) => {
    this.setState(prevState => ({
      targetedItem: {
        ...prevState.targetedItem,
        ...item,
      },
    }));
  };

  addTarget = (itemType: string, id: string, data: Object) => {
    this.setState(prevState => {
      const prevTarget = get({}, `targetedItem.${itemType}`, prevState);
      const targetedItem = {
        ...prevState.targetedItem,
        [itemType]: {
          ...prevTarget,
          [id]: data,
        },
      };
      return {
        ...prevState,
        focusMode: 'TARGET',
        targetedItem,
      };
    });
  };

  removeTarget = (itemType: string, id: string) => {
    this.setState(prevState => {
      const targetedItemByType = get({}, `targetedItem.${itemType}`, prevState);
      const isTarget = targetedItemByType[id] || false;
      if (isTarget) {
        return {
          ...prevState,
          focusMode: 'TARGET',
          targetedItem: {
            ...prevState.targetedItem,
            [itemType]: omit([id], targetedItemByType),
          },
        };
      }
      return prevState;
    });
  };

  toggleHighlight = (focusedItem: Object, focusedId: string) => () => {
    const { focusedId: currentFocusedId } = this.state;
    const isHighlighted = currentFocusedId && currentFocusedId === focusedId;
    if (isHighlighted) {
      this.resetFocusedItem();
    } else {
      this.highlightTree(focusedItem, focusedId);
    }
  };

  toggleTargetTree = (itemRelation: Object, relation: Object) => () => {
    const { id, type: itemType } = relation;
    if (this.isCurrentTree(id) && this.isSubTree(itemRelation, itemType)) {
      this.resetTargetedItem(itemRelation, relation);
    } else {
      this.targetTree(itemRelation, relation);
    }
  };

  toggleTarget = (itemType: string, id: string, data: Object) => () => {
    if (this.isTargeted(itemType, id)) {
      this.removeTarget(itemType, id);
    } else {
      this.addTarget(itemType, id, data);
    }
  };
}
