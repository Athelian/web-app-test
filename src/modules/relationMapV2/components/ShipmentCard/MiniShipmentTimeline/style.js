// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses } from 'styles/common';

export const MiniShipmentTimelineWrapperStyle: string = css`
  display: flex;
  width: 300px;
  align-items: center;
`;

export const TimelinePointStyle = (color: string): string => css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors[color]};
  border: 2px solid ${colors[color]};
  font-size: 10px;
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
`;

export const TimelineLineStyle = (color: string): string => css`
  height: 2px;
  background-color: ${colors[color]};
  width: 100%;
  flex: 1;
`;

export const TimelineVoyageWrapperStyle: string = css`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
`;

export const TimelineTransportStyle = (color: string): string => css`
  position: absolute;
  top: calc(50% - 10px);
  left: calc(50% - 7px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors[color]};
  font-size: 10px;
  height: 20px;
  width: 14px;
  background-color: ${colors.WHITE};
`;

export const WarehouseContainerWrapperStyle: string = css`
  position: relative;
`;

export const ContainerIconWrapperStyle: string = css`
  position: absolute;
  top: calc(50% - 8px);
  left: -16px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.CIRCLE};
  height: 16px;
  width: 16px;
  color: ${colors.WHITE};
  background-color: ${colors.GRAY_DARK};
  font-size: 8px;
`;

export const TimelineRingWrapperStyle = (percent: number) => css`
  position: absolute;
  width: 20px;
  height: 20px;
  clip: ${percent > 50 ? 'rect(auto, auto, auto, auto)' : `rect(0em, 20px, 20px, 10px)`};
`;

export const TimelineBarStyle = (percent: number) => css`
  ${borderRadiuses.CIRCLE};
  position: absolute;
  border: 2px solid ${colors.TEAL};
  width: 20px;
  height: 20px;
  clip: rect(0px, 10px, 20px, 0px);
  transform: rotate(${(360 / 100) * percent}deg);
`;

export const TimelineFillStyle = (percent: number) => css`
  ${borderRadiuses.CIRCLE};
  position: absolute;
  border: 2px solid ${colors.TEAL};
  width: 20px;
  height: 20px;
  clip: rect(0px, 10px, 20px, 0px);
  ${percent > 50 ? 'transform: rotate(180deg)' : ''};
`;