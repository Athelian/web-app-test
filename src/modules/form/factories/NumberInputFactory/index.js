// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, NumberInput } from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps as StandardInputProps,
} from 'modules/form/factories/type';
import { CalculatorButton } from 'modules/form/factories/components';

type InputProps = StandardInputProps & {
  nullable?: boolean,
};

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    vertical: boolean,
    isTouched: boolean,
    label?: React.Node,
    InputWrapper: () => React.Node,
    Input: () => React.Node,
    showCalculator: boolean,
    onCalculate?: Function,
    editable?: boolean,
  };

const defaultProps = {
  labelWidth: '200px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  InputWrapper: DefaultStyle,
  Input: NumberInput,
  editable: true,
  vertical: false,
  showCalculator: false,
};

const NumberInputFactory = ({
  vertical,
  isTouched,
  label,
  InputWrapper,
  Input,
  showCalculator,
  onCalculate,
  required,
  labelAlign,
  labelWidth,
  hideTooltip,
  isNew,
  errorMessage,
  warningMessage,
  infoMessage,
  originalValue,
  isFocused,
  disabled,
  forceHoverStyle,
  inputWidth,
  inputHeight,
  value,
  name,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  inputAlign,
  editable,
  nullable,
}: Props): React.Node => {
  const labelConfig = { required, align: labelAlign, width: labelWidth };

  const tooltipConfig = {
    isNew,
    infoMessage,
    errorMessage: isTouched && errorMessage,
    warningMessage: isTouched && warningMessage,
    changedValues: {
      oldValue: originalValue,
      newValue: value,
    },
  };

  const inputWrapperConfig = {
    type: 'number',
    isFocused,
    hasError: !!(isTouched && errorMessage),
    disabled,
    forceHoverStyle,
    width: inputWidth,
    height: inputHeight,
  };

  const inputConfig = {
    value,
    name,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    align: inputAlign,
    readOnly: !editable,
    nullable,
  };

  return (
    <FieldItem
      vertical={vertical}
      label={label && <Label {...labelConfig}>{label}</Label>}
      tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
      input={
        editable ? (
          <>
            <InputWrapper {...inputWrapperConfig}>
              <Input {...inputConfig} />
            </InputWrapper>
            {showCalculator && (
              <CalculatorButton data-testid="calculatorButton" onClick={onCalculate} />
            )}
          </>
        ) : (
          <Input {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
        )
      }
    />
  );
};

NumberInputFactory.defaultProps = defaultProps;

export default NumberInputFactory;
