// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, transitions, presets, fontSizes } from 'styles/common';

export const SelectWrapperStyle = (isError: boolean) => css`
  display: flex;
  flex-wrap: nowrap;
  ${borderRadiuses.MAIN};
  border: 1px solid ${isError ? colors.RED : 'transparent'};
  ${transitions.MAIN};
  align-items: center;
  height: 30px;
  padding: 0 8px;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const InputStyle = css`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.BLACK};
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: transparent;
`;

export const ButtonStyle = css`
  outline: none;
  border: none;
  height: 100%;
  cursor: pointer;
  background: transparent;
  color: ${colors.GRAY};
  font-size: 12px;
  display: flex;
  align-items: center;
`;

export const OptionWrapperStyle = css`
  display: flex;
  flex-flow: column wrap;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  width: 200px;
`;

export const OptionStyle = (onHover: boolean, selected: boolean) => css`
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : '#fff'};
  ${presets.BUTTON};
  justify-content: flex-start;
  padding: 0 5px;
  color: ${selected ? colors.TEAL : colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  flex: 1;
  height: 30px;
  ${presets.ELLIPSIS};
`;

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
  height: 100%;
  cursor: pointer;
  color: ${colors.GRAY};
  font-size: 12px;
`;
