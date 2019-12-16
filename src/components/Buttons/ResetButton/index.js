// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import useBeforeUnload from 'hooks/useBeforeUnload';

type Props = {|
  disabled: boolean,
  onClick: Function,
  label: React.Node,
|};

const defaultProps = {
  disabled: false,
  onClick: () => {},
  label: <FormattedMessage id="components.button.reset" defaultMessage="RESET" />,
};

const ResetButton = ({ disabled, onClick, label, ...rest }: Props): React.Node => {
  useBeforeUnload(
    !disabled,
    () => 'Are you sure you want to leave this page? Your changes will not be saved.'
  );
  return (
    <BaseButton
      label={label}
      textColor="GRAY_DARK"
      hoverTextColor="WHITE"
      backgroundColor="GRAY_SUPER_LIGHT"
      hoverBackgroundColor="GRAY_LIGHT"
      disabled={disabled}
      onClick={onClick}
      id="resetBtn"
      {...rest}
    />
  );
};

ResetButton.defaultProps = defaultProps;

export default ResetButton;
