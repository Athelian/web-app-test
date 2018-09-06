// @flow
import { css } from 'react-emotion';

import { borderRadiuses, fontSizes, colors } from 'styles/common';

export const IconStyle = css`
  ${fontSizes.SMALL};
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  display: inline-block;
  line-height: 20px;
  text-align: center;
  vertical-align: bottom;
`;

export const BarStyle = css`
  height: 20px;
  ${borderRadiuses.BUTTON};
  background-color: rgba(0, 0, 0, 0.2);
`;

export const ProgressBarStyle = (color: string, percent: number) => css`
  background-color: ${colors[color]};
  ${borderRadiuses.BUTTON};
  height: inherit;
  width: ${percent > 1 ? 100 : percent * 100}%;
`;

export const NumberLineStyle = css`
  text-align: center;
`;

export const NumberStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 16px;
  color: ${colors[color]};
  margin-left: 6px;
  margin-right: 6px;
`;

export const CenterTopNumberStyle = css`
  background-color: white;
  position: relative;
  top: 10px;
  ${borderRadiuses.BUTTON};
`;

export const CenterBottomNumberStyle = css`
  background-color: white;
  position: relative;
  top: -10px;
  ${borderRadiuses.BUTTON};
`;

export const BadgeStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 12px;
  width: 12px;
  ${borderRadiuses.CIRCLE};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  background-color: ${colors[color]};
  color: white;
  display: inline-block;
  text-align: center;
`;

export const BatchedBadgeStyle = css`
  display: inline-block;
  position: relative;
  top: 3px;
  left: -6px;
`;

export const ShippedBadgeStyle = css`
  display: inline-block;
  position: relative;
  top: -3px;
  left: -6px;
`;
