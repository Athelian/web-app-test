// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses, fontSizes, transitions, presets } from 'styles/common';

export const WrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${borderRadiuses.MAIN};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  background: #fff;
  overflow: hidden;
  color: ${colors.GRAY_LIGHT};
  max-width: 200px;
  height: 30px;
  padding-left: 10px;
  ${transitions.MAIN};
  ${fontSizes.MAIN};
  margin-left: 16px;
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY};
  padding: 0px 10px 0px 5px;
  height: 100%;
  outline: none;
  &:hover {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
  &:focus {
    background-color: ${colors.TEAL};
    color: #fff;
    border: none;
  }
`;

export const InputStyle = css`
  color: ${colors.BLACK};
  background: none;
  border: none;
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 10px 0 10px 10px;
  width: 100%;
  outline: none;
  cursor: pointer;
`;
