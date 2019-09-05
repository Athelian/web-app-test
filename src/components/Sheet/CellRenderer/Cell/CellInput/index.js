// @flow
import * as React from 'react';
import TextInput from './Inputs/TextInput';
import { WrapperStyle } from './style';

type Props = {
  value: any,
  type: string,
  focus: boolean,
  inputFocus: boolean,
  readonly: boolean,
  disabled: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onUp: () => void,
  onDown: () => void,
  onUpdate: any => void,
};

const inputs = {
  text: TextInput,
};

const CellInput = ({
  value,
  type,
  focus,
  inputFocus,
  readonly,
  disabled,
  onFocus,
  onBlur,
  onUp,
  onDown,
  onUpdate,
}: Props) => {
  const [dirtyValue, setDirtyValue] = React.useState<any>(value);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (inputRef.current) {
      if (inputFocus) {
        inputRef.current.focus({
          preventScroll: true,
        });
      } else {
        inputRef.current.blur();
      }
    }
  }, [inputFocus]);

  React.useEffect(() => {
    setDirtyValue(value);
  }, [value, setDirtyValue]);

  const handleChange = e => {
    setDirtyValue(e.target.value);
  };

  const handleBlur = () => {
    onBlur();

    if (dirtyValue === value) {
      return;
    }

    onUpdate(dirtyValue);
  };

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowRight':
      case 'ArrowLeft':
        e.stopPropagation();
        break;
      case 'Tab':
        if (inputRef.current) {
          inputRef.current.blur();
        }
        break;
      case 'Enter':
        e.stopPropagation();
        if (inputRef.current) {
          inputRef.current.blur();
        }

        if (e.shiftKey) {
          onUp();
        } else {
          onDown();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={WrapperStyle(focus)}>
      {React.createElement(inputs[type], {
        ref: inputRef,
        value: dirtyValue,
        readonly: readonly || disabled,
        focus: inputFocus,
        onFocus,
        onBlur: handleBlur,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
      })}
    </div>
  );
};

export default CellInput;