// @flow
import * as React from 'react';
import type { MetricValue } from 'types';
import { MetricValueInputStyle } from './style';

type RenderInputProps = {
  value: number,
  disabled?: boolean,
  onChange: (SyntheticInputEvent<any>) => any,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
};

type RenderSelectProps = {
  value: string,
  disabled?: boolean,
  required: true,
  onChange: string => void,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
  items: Array<string>,
  filterItems: (query: string, items: Array<string>) => Array<string>,
  itemToString: any => string,
  itemToValue: any => any,
};

type Props = {
  value: ?MetricValue,
  disabled?: boolean,
  onChange: MetricValue => void,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
  metrics: Array<string>,
  defaultMetric: string,
  valueConverter: (value: number, from: string, to: string) => number,
  renderInput: RenderInputProps => React.Node,
  renderSelect: RenderSelectProps => React.Node,
};

const MetricValueInput = ({
  value,
  disabled,
  onChange,
  onFocus,
  onBlur,
  metrics,
  defaultMetric,
  valueConverter,
  renderInput,
  renderSelect,
}: Props) => (
  <div className={MetricValueInputStyle}>
    {renderInput({
      value: value?.value ?? 0,
      disabled,
      onChange: e =>
        onChange({
          ...(value || { metric: defaultMetric }),
          value: e.target.value ? parseFloat(e.target.value) : 0,
        }),
      onFocus,
      onBlur,
    })}
    {renderSelect({
      value: value?.metric ?? defaultMetric,
      disabled,
      required: true,
      onChange: newMetric =>
        onChange({
          value: valueConverter(value?.value ?? 0, value?.metric ?? defaultMetric, newMetric),
          metric: newMetric,
        }),
      onFocus,
      onBlur,
      items: metrics,
      filterItems: (q, items) => items,
      itemToString: i => i,
      itemToValue: i => i,
    })}
  </div>
);

export default MetricValueInput;
