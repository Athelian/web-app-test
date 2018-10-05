// @flow
import { css } from 'react-emotion';
import {
  colors,
  layout,
  presets,
  borderRadiuses,
  fontSizes,
  shadows,
  transitions,
} from 'styles/common';

export const WrapperStyle: string = css`
  position: relative;
`;

export const ButtonStyle: string = css`
  ${presets.BUTTON};
  ${transitions.MAIN};
  ${fontSizes.MAIN};
  position: relative;
  color: ${colors.GRAY_LIGHT};
  width: 30px;
  height: 30px;
  outline: none;
  &:hover {
  }
`;

export const ActiveStyle: string = css`
  position: absolute;
  border-radius: 50%;
  background-color: ${colors.RED};
  color: #fff;
  font-size: 11px;
  width: 10px;
  height: 10px;
  top: 2px;
  right: 3px;
`;

export const ContentStyle = (isOpen: boolean): string => css`
  ${presets.BOX};
  ${transitions.MAIN};
  ${shadows.INPUT};
  ${!isOpen && `display: none`};
  position: absolute;
  width: 300px;
  top: -10px;
  left: 40px;
  position: absolute;
  width: min-content;
  z-index: 1000;
  padding: 10px;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation-name: fadeIn;
  animation-duration: 0.1s;
  animation-timing-function: ease-in;
`;

export const FormStyle: string = css`
  ${layout.VERTICAL};
`;

export const InputWrapperStyle: string = css`
  display: flex;
  flex-flow: column wrap;
`;

export const ButtonsWrapper: string = css`
  ${layout.HORIZONTAL};
  margin-top: 20px;
  justify-content: flex-end;
`;

export const ResetButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  color: ${colors.GRAY};
  padding: 5px 10px;
  margin-right: 20px;
  text-align: center;
  outline: none;
  &:hover {
    background-color: ${colors.GRAY_VERY_LIGHT};
    color: ${colors.GRAY_DARK};
  }
`;

export const SubmitButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  color: #fff;
  background-color: ${colors.TEAL};
  ${fontSizes.SMALL};
  ${transitions.MAIN};
  padding: 5px 10px;
  text-align: center;
  outline: none;
  &:hover {
    background-color: ${colors.TEAL_DARK};
  }
`;
