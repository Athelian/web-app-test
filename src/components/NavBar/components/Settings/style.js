// @flow
import { css } from 'react-emotion';
import { fontSizes, gradients, presets, colors, shadows, layout, transitions } from 'styles/common';

export const SettingsWrapperStyle = css`
  user-select: none;
  margin-right: 20px;
  display: flex;
  align-items: center;
`;

export const SettingsBodyStyle = css`
  display: flex;
  align-items: center;
  & > button {
    ${presets.BUTTON};
    position: relative;
    font-size: 20px;
    width: 30px;
    height: 30px;
    margin-left: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    outline: none;
    &:first-child {
      background: ${gradients.BLUE_TEAL_DIAGONAL};
      color: #fff;
    }
    &:nth-child(2) {
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
    }
  }
`;

export const SettingsCountStyle = css`
  position: absolute;
  border-radius: 50%;
  background-color: ${colors.RED};
  color: #fff;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  padding: 2px;
  top: -5px;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const DropDownStyle = css`
  position: absolute;
  top: 50px;
  min-width: min-content;
  min-height: min-content;
  margin-top: 10px;
`;

export const DropDownWrapperStyle = css`
  ${DropDownStyle};
  right: 20px;
`;

export const NotificationDropDownWrapperStyle = css`
  ${DropDownStyle};
  right: 66px;
`;

export const SubMenuWrapperStyle = css`
  ${layout.VERTICAL};
  ${presets.BOX};
  ${shadows.NAV_BUTTON};
  width: 200px;
`;

export const SubMenuItemStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 50px;
  cursor: pointer;
  ${transitions.MAIN};

  & > div:first-child {
    display: flex;
    ${layout.CENTER_CENTER};
    width: 50px;
    height: 100%;
    font-size: 20px;
    color: #ccc;
  }

  & > div:nth-child(2) {
    ${fontSizes.MAIN};
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #aaa;
    flex: 1;
  }

  &:hover {
    background-color: #eee;
    & > div:first-child {
      color: #aaa;
    }
    & > div:nth-child(2) {
      color: #555;
    }
  }
`;
