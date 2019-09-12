// @flow
import logger from 'utils/logger';
import type { Action, CellValue, State, Position } from '../types';
import { Actions } from '../contants';
import { init, append, rearrange } from './global';
import {
  appendForeignFocuses,
  foreignBlur,
  foreignFocus,
  setForeignFocuses,
} from './foreign-focus';
import { setErrors } from './error';
import { focus, blur, focusUp, focusDown, focusRight, focusLeft } from './focus';
import { cellUpdate, changeValues, deleteItem, replaceItem } from './mutate';
import { postAddEntity, postRemoveEntity, preAddEntity, preRemoveEntity } from './announcement';
import { hover, unhover } from './hover';

const InvalidAction = new Error('Invalid action');
const MissingPayload = new Error('Invalid action, missing payload.');
const MissingTarget = new Error('Invalid action, missing target cell position.');

function getPayload(action: Action): any {
  if (!action.payload) {
    throw MissingPayload;
  }

  return action.payload;
}

function getPosition(action: Action): Position {
  if (!action.cell) {
    throw MissingTarget;
  }

  return action.cell;
}

function getTarget(state: State, action: Action) {
  const pos = getPosition(action);

  return state.rows[pos.x][pos.y];
}

export default function cellReducer(transformer: (number, Object) => Array<Array<CellValue>>) {
  function reducer(state: State, action: Action) {
    logger.info('Sheet state reducer', action);

    switch (action.type) {
      case Actions.INIT:
        return init(transformer)(state, getPayload(action));
      case Actions.APPEND:
        return append(transformer)(state, getPayload(action));
      case Actions.REARRANGE:
        return rearrange(transformer)(state, getPayload(action));
      case Actions.CELL_UPDATE:
        return cellUpdate(state, getPayload(action), getTarget(state, action));
      case Actions.CHANGE_VALUES:
        return changeValues(state, getPayload(action));
      case Actions.REPLACE_ITEM:
        return replaceItem(transformer)(state, getPayload(action));
      case Actions.DELETE_ITEM:
        return deleteItem(transformer)(state, getPayload(action));
      case Actions.SET_ERRORS:
        return setErrors(
          state,
          action.payload || null,
          getTarget(state, action),
          getPosition(action)
        );
      case Actions.HOVER:
        return hover(state, getTarget(state, action), getPosition(action));
      case Actions.UNHOVER:
        return unhover(state);
      case Actions.FOCUS:
        return focus(state, getTarget(state, action), getPosition(action));
      case Actions.BLUR:
        return blur(state);
      case Actions.FOCUS_UP:
        return focusUp(state);
      case Actions.FOCUS_DOWN:
        return focusDown(state);
      case Actions.FOCUS_RIGHT:
        return focusRight(state);
      case Actions.FOCUS_LEFT:
        return focusLeft(state);
      case Actions.SET_FOREIGN_FOCUSES:
        return setForeignFocuses(state, getPayload(action));
      case Actions.APPEND_FOREIGN_FOCUSES:
        return appendForeignFocuses(state, getPayload(action));
      case Actions.FOREIGN_FOCUS:
        return foreignFocus(state, getPayload(action));
      case Actions.FOREIGN_BLUR:
        return foreignBlur(state, getPayload(action));
      case Actions.PRE_ADD_ENTITY:
        return preAddEntity(transformer)(state, getPayload(action));
      case Actions.POST_ADD_ENTITY:
        return postAddEntity(state, getPayload(action));
      case Actions.PRE_REMOVE_ENTITY:
        return preRemoveEntity(state, getPayload(action));
      case Actions.POST_REMOVE_ENTITY:
        return postRemoveEntity(transformer)(state, getPayload(action));
      default:
        throw InvalidAction;
    }
  }

  return reducer;
}