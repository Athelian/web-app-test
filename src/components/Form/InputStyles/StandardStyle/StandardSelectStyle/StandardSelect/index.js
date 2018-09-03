// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { type RenderSelectProps } from 'components/Form/PureInputs/PureSelectInput/type';
import { StandardStyleWrapperStyle } from 'components/Form/InputStyles/StandardStyle/style';
import { ClearButtonStyle, ArrowDownStyle } from './style';

type OptionalProps = {
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps &
  RenderSelectProps & {
    hasError: boolean,
    disabled: boolean,
    forceHoverStyle: boolean,
    width: string,
    height: string,
    itemToString: any => string,
  };

const defaultProps = {
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
  align: 'right',
};

function StandardSelect({
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  align,
  isOpen,
  clearSelection,
  toggle,
  selectedItem,
  getInputProps,
  itemToString,
}: Props) {
  return (
    <div
      className={StandardStyleWrapperStyle({
        type: 'standard',
        isFocused: isOpen,
        hasError,
        disabled,
        forceHoverStyle: forceHoverStyle && !selectedItem,
        width,
        height,
      })}
    >
      {align === 'right' &&
        (selectedItem ? (
          <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
            <Icon icon="CLEAR" />
          </button>
        ) : (
          <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
            <Icon icon="CHEVRON_DOWN" />
          </button>
        ))}
      <input
        readOnly
        spellCheck={false}
        onClick={toggle}
        {...getInputProps({
          value: itemToString(selectedItem),
        })}
      />
      {align === 'left' &&
        (selectedItem ? (
          <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
            <Icon icon="CLEAR" />
          </button>
        ) : (
          <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
            <Icon icon="CHEVRON_DOWN" />
          </button>
        ))}
    </div>
  );
}

StandardSelect.defaultProps = defaultProps;

export default StandardSelect;
