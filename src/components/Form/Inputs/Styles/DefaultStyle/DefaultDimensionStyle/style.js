// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

export const DimensionUnitStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  padding: 0 5px 0 0;
`;

export default DimensionUnitStyle;