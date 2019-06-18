// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors } from 'styles/common';

export const MilestoneCardStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 204px;
`;

export const CommonCardGridStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px 5px 10px 5px;
`;

export const MilestoneNameStyle: string = css`
  width: 100%;
  padding: 0 15px 0 0;
`;

export const MilestoneStatusWrapperStyle = (completed: boolean) => css`
  width: 100%;
  height: 40px;
  ${borderRadiuses.BUTTON};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${completed ? colors.TEAL : colors.GRAY_LIGHT};
  color: ${completed ? colors.WHITE : colors.GRAY_DARK};
`;

export const TaskStatusChartStyle: string = css`
  padding: 0 5px;
`;
