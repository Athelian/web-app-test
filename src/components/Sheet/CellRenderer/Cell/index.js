// @flow
import * as React from 'react';
import { useHasPermissions } from 'contexts/Permissions';
import FocusFallbackProvider from 'contexts/FocusFallback';
import { Blackout } from 'components/Form';
import type { DoAction } from 'components/Sheet/SheetAction/types';
import type { Action, CellValue, Mutate } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import CellInput from './CellInput';
import CellDisplay from './CellDisplay';
import CellAction from './CellAction';
import { CellStyle, CellBorderStyle, CellPlaceholderStyle, CellShadowStyle } from './style';

type Props = {
  cell: CellValue,
  parentCell: CellValue,
  item: Object | null,
  columnIndex: number,
  rowIndex: number,
  hover: boolean,
  focus: boolean,
  weakFocus: boolean,
  foreignFocus: boolean,
  error: boolean,
  weakError: boolean,
  dispatch: Action => void,
  mutate: Mutate,
  doAction: DoAction,
};

const Cell = ({
  cell,
  parentCell,
  item,
  columnIndex,
  rowIndex,
  hover,
  focus,
  weakFocus,
  foreignFocus,
  error,
  weakError,
  dispatch,
  mutate,
  doAction,
}: Props) => {
  const hasPermission = useHasPermissions(parentCell.data?.ownedBy);
  const wrapperRef = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);

  const isReadonly = parentCell.readonly || false;
  const isDisabled =
    parentCell.disabled || !(parentCell.data && parentCell.data.permissions(hasPermission));
  const isInputFocusable = !isReadonly && !isDisabled && !cell.forbidden && !!cell.entity;

  const isTop = !cell.merged || cell.merged.from.x === rowIndex;
  const isBottom = !cell.merged || cell.merged.to.x === rowIndex;

  const size = cell.merged ? cell.merged.to.x - cell.merged.from.x + 1 : 1;

  const computedValue = React.useMemo(() => {
    if (cell.empty || cell.forbidden || !cell.entity) {
      return null;
    }

    if (!cell.computed || !item) {
      return cell.data?.value ?? null;
    }

    return cell.computed(item);
  }, [cell, item]);

  const hidden = React.useMemo(() => {
    return parentCell.hide && item ? parentCell.hide(item) : false;
  }, [parentCell, item]);

  React.useEffect(() => {
    if (focus && isTop) {
      if (wrapperRef.current) {
        wrapperRef.current.focus({
          preventScroll: true,
        });
      }
    } else {
      setInputFocus(false);
    }
  }, [focus, isTop]);

  const handleFocusUp = React.useCallback(() => {
    dispatch({
      type: Actions.FOCUS_UP,
    });
  }, [dispatch]);
  const handleFocusDown = React.useCallback(() => {
    dispatch({
      type: Actions.FOCUS_DOWN,
    });
  }, [dispatch]);
  const handleUpdate = React.useCallback(
    value => {
      mutate({
        cell: { x: rowIndex, y: columnIndex },
        value,
        item,
      });
    },
    [mutate, columnIndex, rowIndex, item]
  );
  const handleAction = React.useCallback(
    action => {
      if (parentCell.entity && parentCell.data) {
        doAction({ action, entity: parentCell.entity, ownedBy: parentCell.data.ownedBy, item });
      }
    },
    [parentCell.entity, parentCell.data, item, doAction]
  );

  const handleClick = React.useCallback(() => {
    if (!focus) {
      dispatch({
        type: Actions.FOCUS,
        cell: { x: rowIndex, y: columnIndex },
      });
    }
  }, [focus, dispatch, rowIndex, columnIndex]);
  const handleMouseDown = React.useCallback(
    (e: SyntheticEvent<HTMLDivElement>) => {
      if (!isTop) {
        e.preventDefault();
      }
    },
    [isTop]
  );
  const handleMouseEnter = React.useCallback(() => {
    dispatch({
      type: Actions.HOVER,
      cell: { x: rowIndex, y: columnIndex },
    });
  }, [dispatch, rowIndex, columnIndex]);
  const handleKeyDown = React.useCallback(
    (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Enter':
          if (isInputFocusable) {
            e.stopPropagation();
            e.preventDefault();
            setInputFocus(true);
          }
          break;
        case 'Escape':
          setInputFocus(false);
          if (wrapperRef.current) {
            wrapperRef.current.focus({
              preventScroll: true,
            });
          }
          break;
        default:
          break;
      }
    },
    [isInputFocusable]
  );

  const handleInputFocus = React.useCallback(() => {
    setInputFocus(true);
  }, []);
  const handleInputBlur = React.useCallback(() => {
    setInputFocus(false);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={CellStyle(
        focus,
        !!parentCell.entity && isReadonly,
        !!parentCell.entity && isDisabled
      )}
      role="presentation"
      tabIndex="-1"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      {isTop && inputFocus && <div className={CellShadowStyle(size)} />}

      {(() => {
        if (cell.empty && !!parentCell.entity && !hidden) {
          return null;
        }

        if (cell.forbidden) {
          return <Blackout width="100%" height="100%" />;
        }

        if (!cell.entity || hidden) {
          return <div className={CellPlaceholderStyle} />;
        }

        if (cell.type === 'action') {
          return (
            <CellAction
              actions={cell.extra || []}
              onAction={handleAction}
              inputFocus={inputFocus}
            />
          );
        }

        if (isReadonly) {
          return (
            <CellDisplay
              value={computedValue}
              type={cell.type}
              entity={cell.entity}
              extra={cell.extra}
            />
          );
        }

        return (
          <FocusFallbackProvider element={wrapperRef}>
            <CellInput
              value={cell.data?.value ?? null}
              context={computedValue}
              extra={cell.extra}
              type={cell.type}
              focus={focus}
              inputFocus={inputFocus}
              disabled={isDisabled}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onUp={handleFocusUp}
              onDown={handleFocusDown}
              onUpdate={handleUpdate}
            />
          </FocusFallbackProvider>
        );
      })()}

      <div
        className={CellBorderStyle(
          isTop,
          isBottom,
          hover,
          focus,
          foreignFocus,
          weakFocus,
          error,
          weakError
        )}
      />
    </div>
  );
};

export default React.memo<Props>(Cell);
