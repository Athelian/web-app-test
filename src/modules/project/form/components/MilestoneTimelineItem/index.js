// @flow
import React from 'react';
import Icon from 'components/Icon';
import { calculatePercentage } from 'utils/ui';
import {
  TimelineItemStyle,
  MilestoneNameStyle,
  ProgressBarStyle,
  BarStyle,
  MilestoneTickStyle,
  TasksWrapperStyle,
  CompletedTasksStyle,
  TotalTasksStyle,
  TaskIconStyle,
} from './style';

type Props = {
  milestone: Object,
};

const MilestoneTimelineItem = ({ milestone }: Props) => {
  const { name, completedAt, tasks = [] } = milestone;

  const isCompleted = completedAt;
  const total = tasks.length;
  const completedOrSkippedCount = tasks.filter(item => item.completedAt || item.skippedAt).length;

  return (
    <div className={TimelineItemStyle}>
      <div className={MilestoneNameStyle}>{name}</div>

      <div className={ProgressBarStyle}>
        <div className={BarStyle(calculatePercentage(total, completedOrSkippedCount))} />
        <div className={MilestoneTickStyle(isCompleted)}>
          <Icon icon="CONFIRM" />
        </div>
      </div>

      <div className={TasksWrapperStyle}>
        <div className={CompletedTasksStyle(completedOrSkippedCount)}>
          {completedOrSkippedCount}
        </div>
        <div className={TotalTasksStyle}>{`\u00A0/ ${total}`}</div>
        <div className={TaskIconStyle}>
          <Icon icon="TASK" />
        </div>
      </div>
    </div>
  );
};

export default MilestoneTimelineItem;