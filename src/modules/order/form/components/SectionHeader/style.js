import { css } from 'react-emotion';
import { presets, colors, fontSizes, layout } from 'styles/common';

export const SectionHeaderWrapperStyle = css`
  grid-template-columns: 1fr;
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 40px;
  grid-gap: 40px;
  align-items: center;
  width: 960px;
  padding: 0 40px 0 0;
`;

export const TitleWrapperStyle = css`
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
`;

export const TitleStyle = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  letter-spacing: 2px;
`;

export const IconStyle = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
