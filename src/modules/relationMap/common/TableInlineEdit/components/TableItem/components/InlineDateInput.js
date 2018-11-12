// @flow
import * as React from 'react';
import { DefaultStyle, DateInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useDateInput } from 'modules/relationMap/common/TableInlineEdit/hooks';

type OptionalProps = {
  isRequired: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: string,
};

const defaultProps = {
  isRequired: false,
};

export default function InlineDateInput({ name, value, isRequired }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useDateInput(value, { isRequired });
  return (
    <DefaultStyle type="text" isFocused={isFocused} hasError={hasError} forceHoverStyle>
      <DateInput
        name={name}
        {...inputHandlers}
        onBlur={() => {
          inputHandlers.onBlur();
          emitter.emit('INLINE_CHANGE', {
            name,
            hasError,
            value: inputHandlers.value,
          });
        }}
      />
    </DefaultStyle>
  );
}

InlineDateInput.defaultProps = defaultProps;
