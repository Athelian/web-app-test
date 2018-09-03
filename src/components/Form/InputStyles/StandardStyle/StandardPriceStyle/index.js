// @flow
import * as React from 'react';
import { StandardStyleWrapperStyle } from 'components/Form/InputStyles/StandardStyle/style';
import { CurrencyStyle } from './style';

type OptionalProps = {
  currency: ?string,
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  currency: null,
  isFocused: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
};

const StandardPriceStyle = ({
  currency,
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  children,
}: Props) => (
  <div
    className={StandardStyleWrapperStyle({
      type: 'number',
      isFocused,
      hasError,
      disabled,
      forceHoverStyle,
      width,
      height,
    })}
  >
    {children}
    <div className={CurrencyStyle}>{currency}</div>
  </div>
);

StandardPriceStyle.defaultProps = defaultProps;

export default StandardPriceStyle;
