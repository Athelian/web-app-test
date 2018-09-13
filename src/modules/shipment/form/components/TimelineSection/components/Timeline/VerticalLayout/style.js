// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const VerticalLayoutWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  height: 100%;
  padding: 10px;
`;

export default VerticalLayoutWrapperStyle;
