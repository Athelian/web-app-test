// @flow
import * as React from 'react';
import BaseDateTimeInput from 'components/Form/Inputs/DateTimeInput';
import InputWrapper from '../InputWrapper';

type Props = {
  value: Date | string | null,
  onChange: string => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const DatetimeInput = ({ value, focus, onChange, onFocus, onBlur, onKeyDown, readonly }: Props) => (
  <InputWrapper focus={focus}>
    {({ ref }) => (
      <BaseDateTimeInput
        inputRef={ref}
        value={value}
        name="value"
        tabIndex="-1"
        readOnly={readonly}
        readOnlyHeight="30px"
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    )}
  </InputWrapper>
);

export default DatetimeInput;