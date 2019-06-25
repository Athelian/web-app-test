// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import messages from './messages';
import { WrapperStyle, TitleStyle } from './style';

type Props = {
  count: number,
  remain: number,
  inProgress: number,
  completed: number,
  rejected: number,
  approved: number,
  skipped: number,
  delayed: number,
};

export default function TaskStatus({
  count,
  completed,
  remain,
  inProgress,
  delayed,
  skipped,
  rejected,
  approved,
}: Props) {
  return (
    <div className={WrapperStyle}>
      <div className={TitleStyle('BLACK')}>
        <FormattedMessage {...messages.totalTasks} />
      </div>
      <div>{count}</div>
      <div className={TitleStyle('TEAL')}>
        <Icon icon="CHECKED" />
        <FormattedMessage {...messages.completed} />
      </div>
      <div>{completed}</div>
      <div className={TitleStyle('GRAY_LIGHT')}>
        <Icon icon="CANCEL" />
        <FormattedMessage {...messages.uncompleted} />
      </div>
      <div>{remain}</div>
      <div className={TitleStyle('TEAL')}>
        <Icon icon="CLOCK" />
        <FormattedMessage {...messages.inProgress} />
      </div>
      <div>{inProgress}</div>
      <div className={TitleStyle('ORDER')}>
        <Icon icon="STOPWATCH" />
        <FormattedMessage {...messages.overdue} />
      </div>
      <div>{delayed}</div>
      <div className={TitleStyle('GRAY_DARK')}>
        <Icon icon="SKIPPED" />
        <FormattedMessage {...messages.skipped} />
      </div>
      <div>{skipped}</div>
      <div className={TitleStyle('PRODUCT')}>
        <Icon icon="CANCEL" />
        <FormattedMessage {...messages.rejected} />
      </div>
      <div>{rejected}</div>
      <div className={TitleStyle('ENTITY')}>
        <Icon icon="CHECKED" />
        <FormattedMessage {...messages.approved} />
      </div>
      <div>{approved}</div>
      <div className={TitleStyle('PRODUCT')}>
        <Icon icon="CANCEL" />
        <FormattedMessage {...messages.unapproved} />
      </div>
      <div>{count - (rejected + approved)}</div>
    </div>
  );
}
