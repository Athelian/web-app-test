// @flow
import { css } from 'react-emotion';
import {
  presets,
  layout,
  colors,
  borderRadiuses,
  fontSizes,
  fontSizesWithHeights,
} from 'styles/common';

export const CommentEntryWrapperStyle = (isSameUser: boolean) => css`
  ${layout.HORIZONTAL};
  z-index: 1;
  justify-content: ${isSameUser ? 'flex-end' : 'flex-start'};
  &:hover {
    button {
      opacity: 1;
    }
  }
`;

export const ContentWrapperStyle = (isSameUser: boolean) => css`
  ${layout.VERTICAL};
  align-items: ${isSameUser ? 'flex-end' : 'flex-start'};
  margin: ${isSameUser ? '0 0 0 70px' : '0 70px 0 0'};
  flex: 1;
`;

export const NameDateWrapperStyle = (isSameUser: boolean) => css`
  display: flex;
  margin: 0 0 5px 0;
  align-items: center;
  justify-content: ${isSameUser ? 'flex-end' : 'flex-start'};
`;

export const DateStyle = (isSameUser: boolean) => css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  user-select: none;
  margin: ${isSameUser ? '0 5px 0 0' : '0 0 0 5px'};
`;

export const NameStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
`;

export const BodyWrapperStyle = (isSameUser: boolean, hideAvatar: boolean) => css`
  ${layout.VERTICAL};
  position: relative;
  padding: 20px;
  width: 100%;
  color: ${colors.BLACK};
  ${isSameUser
    ? `
    border-radius: 10px 0 10px 10px;
    background-color: ${colors.TEAL_LIGHT};
    margin-left: auto
  `
    : `
    border-radius: 0 10px 10px 10px;
    background-color: ${colors.GRAY_SUPER_LIGHT};
    margin-right: auto
  `};
  ${!hideAvatar &&
    `
    &:after {
      content: '';
      position: absolute;
      height: 10px;
      width: 20px;
      top: 0;
      ${
        isSameUser
          ? `
        right: -20px;
        border-radius: 10px 0 0 0;
        box-shadow: -10px 0 0 0 ${colors.TEAL_LIGHT}
      `
          : `
        left: -20px;
        border-radius: 0 10px 0 0;
        box-shadow: 10px 0 0 0 ${colors.GRAY_SUPER_LIGHT}
      `
      };
    }
    `};
`;

export const BodyStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  white-space: pre-line;
`;

export const AvatarStyle = (isSameUser: boolean, hideAvatar: boolean) => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  ${fontSizesWithHeights.HUGE};
  position: relative;
  background-color: ${isSameUser ? colors.TEAL : colors.GRAY};
  color: #fff;
  width: 50px;
  height: 50px;
  margin: ${isSameUser ? '0 0 0 20px' : '0 20px 0 0'};
  user-select: none;
  font-weight: bold;
  flex-shrink: 0;
  visibility: ${hideAvatar ? 'hidden' : 'visible'};
  cursor: default;
`;

export const MessageInputWrapperStyle = css`
  ${layout.VERTICAL};
  width: 100%;
  min-width: 200px;
`;

export const FormButtonsWrapperStyle = css`
  ${layout.HORIZONTAL};
  margin: 10px 0 0 0;
`;

export const DeleteButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  position: absolute;
  top: 0px;
  left: 0px;
  color: rgba(0, 0, 0, 0.2);
  height: 25px;
  width: 25px;
  opacity: 0;
  &:hover,
  :focus {
    opacity: 1;
    color: ${colors.RED};
  }
`;

export const CancelButtonStyle = css`
  ${presets.BUTTON};
  color: ${colors.GRAY_DARK};
  background-color: none;
  flex-shrink: 0;
  ${fontSizes.SMALL};
  ${borderRadiuses.MAIN};
  padding: 3px 5px;
  letter-spacing: 2px;
  margin: 0 10px 0 0;
  &:hover {
    background-color: ${colors.GRAY_DARK};
    color: #fff;
  }
`;
