// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizesWithHeights, presets } from 'styles/common';

export const OrderCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 190px;
`;

export const OrderInfoWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px 5px;
`;

export const POWrapperStyle: string = css`
  width: 100%;
  padding: 0 15px 0 0px;
`;

export const ExporterWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 5px;
`;

export const ChartWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
  margin: 3px 0;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 5px 5px 0 5px;
  overflow: hidden;
  width: 100%;
`;
