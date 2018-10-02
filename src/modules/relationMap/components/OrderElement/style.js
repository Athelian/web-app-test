// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

const getBorderColor = (isFocused: boolean) => (isFocused ? colors.TEAL : colors.GRAY_QUITE_LIGHT);

export const OrderListItemWrapperStyle = (isFocused: boolean) => css`
  box-shadow: none !important;
  border: 5px solid ${getBorderColor(isFocused)};
`;

export const OrderListItemStyle = (isFocused: boolean) => css`
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  -webkit-box-shadow: ${getBorderColor(isFocused)} 0 0 0 5px;
  -moz-box-shadow: ${getBorderColor(isFocused)} 0 0 0 5px;
  box-shadow: ${getBorderColor(isFocused)} 0 0 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 190px;
  height: 40px;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export const TotalCardWrapperStyle = css`
  margin-left: 1em;
`;

export const CardWrapperStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  margin-right: 20px;
`;
export const CardTitleStyle = css`
  ${fontSizes.SMALL};
  padding-right: 2px;
  word-break: break-all;
`;
export const CardVisualizeStyle = css`
  width: 90px;
  height: 30px;
`;

export const ResetBaseCardStyle = css`
  box-shadow: none;
  width: auto;
  &:hover {
    box-shadow: none;
  }
`;

export const ItemWrapperStyle = (isFocused: boolean) => {
  const focused = getBorderColor(isFocused);
  return css`
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    border: 5px solid ${focused};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 190px;
    //max-width: 400px;
    height: auto;
    min-height: 50px;
    max-height: 200px;
    margin-bottom: 20px;
    ${fontSizes.MAIN};
    font-weight: bold;
    color: ${colors.BLACK};
  `;
};

export const ShipmentCardStyle = css`
  height: 160px;
  grid-row: span 3;
`;
