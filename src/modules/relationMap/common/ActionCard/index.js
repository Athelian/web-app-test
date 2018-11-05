// @flow
import React from 'react';
import { cx } from 'react-emotion';
import { StringValue } from 'react-values';
import Icon from 'components/Icon';
import * as style from './style';

type ActionCardProps = {
  children: Function,
  show: boolean,
};

type OptionalActionProps = {
  className: string,
  onClick: Function,
  toggle: Function,
};

type ActionProps = OptionalActionProps & {
  icon: string,
  targetted: string,
};

const Action = ({ icon, targetted, className, onClick, toggle }: ActionProps) => (
  <div
    className={style.ActionWrapperStyle(targetted === icon)}
    role="presentation"
    onClick={() => {
      const isSelectedAction = targetted === icon;
      if (toggle) {
        toggle(isSelectedAction ? null : icon);
      }
      if (onClick) {
        onClick(isSelectedAction);
      }
    }}
  >
    <div className={className}>
      <Icon icon={targetted ? `${icon}_REGULAR` : icon} />
    </div>
  </div>
);
Action.defaultProps = {
  className: '',
};

const ActionCard = ({ children, show }: ActionCardProps) => (
  <StringValue>
    {({ value: targetted, set: toggle }) =>
      show && (
        <div className={cx(style.OverlayStyle, style.CardWrapperStyle)}>
          {children({
            targetted,
            toggle,
          })}
        </div>
      )
    }
  </StringValue>
);

export { Action };
export default ActionCard;
