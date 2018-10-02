// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { LogsButtonWrapperStyle, BadgeStyle } from './style';

type Props = {
  onClick: Function,
  badge?: number,
};

const defaultProps = {
  badge: 0,
};

const LogsButton = ({ onClick, badge }: Props) => (
  <button type="button" onClick={onClick} className={LogsButtonWrapperStyle}>
    <Icon icon="LOGS" /> LOGS
    {!!badge &&
      badge > 0 && (
        <div className={BadgeStyle}>
          <FormattedNumber value={badge} />
        </div>
      )}
  </button>
);

LogsButton.defaultProps = defaultProps;

export default LogsButton;
