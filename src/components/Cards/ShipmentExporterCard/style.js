// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets } from 'styles/common';

export const ExporterCardStyle = (size: 'full' | 'half' | 'quarter') => css`
  display: grid;
  align-items: center;
  ${size === 'full' &&
    `
      grid-template-columns: 200px;
      grid-template-rows: 200px 30px;
    `};
  ${size === 'half' &&
    `
      grid-template-columns: 200px;
      grid-template-rows: 80px 30px;
    `};
  ${size === 'quarter' &&
    `
      grid-template-columns: 95px;
      grid-template-rows: 80px 30px;
    `};
`;

export const ExporterCardImageStyle = css`
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ExporterNameStyle = css`
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  text-align: center;
  width: 100%;
  padding: 0 10px;
`;
