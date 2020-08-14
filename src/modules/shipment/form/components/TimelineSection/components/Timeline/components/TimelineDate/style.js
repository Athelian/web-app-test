// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets } from 'styles/common';

export const TimelineDateWrapperStyle = (vertical: boolean): string => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: ${vertical ? '5px' : '0px'};
  align-items: center;
`;

export const PrefixIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
  width: 18px;
  height: 18px;
`;

type DateProps = {
  color: string,
  vertical: boolean,
  showTime: boolean,
};

export const DateStyle = ({ color, vertical, showTime = false }: DateProps): string => {
  let width = '58px';
  if (vertical) {
    width = '70px';
  } else if (showTime) {
    width = '100px';
  }

  return css`
    color: ${colors[color]};
    ${presets.ELLIPSIS};
    font-weight: bold;
    ${vertical ? fontSizes.MAIN : fontSizes.SMALL};
    ${vertical ? `text-align: left;` : `text-align: right;`}
    width: ${width};
  `;
};

type DelayProps = {
  delayAmount: number,
  vertical: boolean,
};

export const DelayStyle = ({ delayAmount, vertical }: DelayProps): string => css`
  color: ${delayAmount > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: center;
  width: ${vertical ? '30px' : '22px'};
`;

type ApprovedIconProps = {
  approved: boolean,
  vertical: boolean,
};

export const ApprovedIconStyle = ({ approved, vertical }: ApprovedIconProps): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${vertical
    ? `
    ${fontSizes.MAIN};
    width: 18px;
    height: 18px;
  `
    : `
    ${fontSizes.SMALL};
    width: 15px;
    height: 15px;
  `};
  color: ${approved ? colors.BLUE : colors.GRAY_SUPER_LIGHT};
`;