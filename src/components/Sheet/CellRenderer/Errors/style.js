// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const WrapperStyle = (onFirstRow: boolean, extended: number) => css`
  ${layout.VERTICAL};
  align-items: flex-start;
  position: absolute;
  ${onFirstRow ? `top: ${extended * 30}px;` : `bottom: ${extended * 30}px;`}
  left: 0px;
  z-index: 4;
`;

export const ErrorStyle = css`
  background-color: ${colors.RED};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  line-height: 15px;
  padding: 0 5px;
  white-space: nowrap;
`;
