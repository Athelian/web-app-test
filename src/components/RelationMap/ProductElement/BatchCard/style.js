import { css } from 'react-emotion';
import { borderRadiuses, layout, colors, fontSizes, shadows } from 'styles/common';

const Row = css`
  padding: 0 10px 5px 10px;
`;

const Label = css`
  font-style: normal;
  letter-spacing: 2px;
  color: #aaaaaa;
`;

export const CardWrapper = css`
  ${borderRadiuses.MAIN};
  color: ${colors.GRAY_DARK_1};
  ${fontSizes.SMALL};
  width: 195px;
  height: 163px;
  padding-top: 5px;
`;

export const BatchRow = css`
  ${Row};
`;

export const QuantityRow = css`
  ${Row};
  padding-right: 5px;
  ${layout.HORIZONTAL};
  justify-content: space-between;
`;

export const OrderRow = css`
  ${Row};
  ${layout.HORIZONTAL};
`;

export const TagWrapper = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 10px;
  overflow: hidden;
  ${Row};
`;

export const DetailWrapper = css`
  ${layout.HORIZONTAL};
  ${Row};
`;

export const IconWrapper = css`
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  ${fontSizes.LITTLE};
  width: min-content;
  padding: 3px;
  margin-right: 5px;
`;

export const SecondaryIconWrapper = css`
  ${borderRadiuses.CIRCLE};
  border: 1px solid ${colors.GRAY_VERY_LIGHT};
  color: ${colors.GRAY_VERY_LIGHT};
  ${fontSizes.LITTLE};
  width: min-content;
  padding: 2px;
  margin-right: 5px;
`;

export const QuantityWrapper = css`
  ${layout.HORIZONTAL};
  justify-content: space-between;
`;

export const SecondaryTitle = css`
  ${Label};
`;

export const QuantityInput = css`
  ${shadows.INPUT};
  width: 90px;
  padding: 0 5px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  text-align: right;
`;

export const Divider = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 1px 10px 5px 10px;
`;
