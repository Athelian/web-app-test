// @flow
import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { SaveButton } from 'components/Buttons';
import useBeforeUnload from 'hooks/useBeforeUnload';
import emitter from 'utils/emitter';

type Props = {|
  disabled: boolean,
  isLoading: boolean,
  onClick: Function,
  label: React.Node,
  id: string,
  'data-testid'?: string,
|};

const defaultProps = {
  disabled: false,
  isLoading: false,
  onClick: () => {},
  label: <FormattedMessage id="components.button.save" defaultMessage="SAVE" />,
  id: 'save_button',
};

const SaveFormButton = ({
  disabled,
  isLoading,
  onClick,
  label,
  id,
  ...rest
}: Props): React.Node => {
  const intl = useIntl();
  useBeforeUnload(!disabled, () =>
    intl.formatMessage({
      id: 'components.form.confirmBeforeLeavePageMessage',
      defaultMessage: 'Are you sure you want to leave this page? Your changes will not be saved.',
    })
  );

  React.useEffect(() => {
    emitter.emit('DIRTY_SAVE', !disabled);
    return () => {
      emitter.emit('DIRTY_SAVE', false);
    };
  }, [disabled]);

  return (
    <SaveButton
      label={label}
      disabled={disabled}
      onClick={onClick}
      isLoading={isLoading}
      id={id}
      {...rest}
    />
  );
};

SaveFormButton.defaultProps = defaultProps;

export default SaveFormButton;