// @flow
import { css } from 'react-emotion';
import {
  colors,
  borderRadiuses,
  presets,
  fontSizes,
  transitions,
  scrollbars,
  shadows,
} from 'styles/common';

type OptionWrapperType = {
  width: string,
  height: string,
  dropDirection: 'down' | 'up',
  align: 'left' | 'right' | 'center',
};

export const ItemStyle: string = css`
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-weight: bold;
  ${presets.ELLIPSIS};
  ${transitions.MAIN};
  cursor: pointer;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
`;

export const SelectedWrapperStyle: string = css`
  min-width: 20px;
  margin-right: 3px;
`;

export const OptionWrapperStyle = ({
  width,
  height,
  dropDirection,
  align,
}: OptionWrapperType): string => css`
  & > div {
    list-style-type: none;
    position: absolute;
    ${dropDirection === 'down'
      ? `
      top: calc(100% + 5px)
    `
      : `
      bottom: calc(100% + 5px)
    `};
    ${align === 'left' ? 'left: 0' : 'right: 0'};
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 1;
    ${shadows.INPUT};
    min-width: ${width};
    max-width: ${width};
    background: ${colors.WHITE};
    ${borderRadiuses.MAIN};
    max-height: ${height};
    ${scrollbars.SMALL};
    cursor: pointer;
  }
`;

type OptionalProps = {
  onHover: boolean,
  selected: boolean,
  align: 'left' | 'right' | 'center',
};

export const OptionStyle = ({ onHover, selected, align }: OptionalProps): string => css`
  display: flex;
  align-items: center;
  padding: 0 10px;
  ${presets.ELLIPSIS};
  background: ${onHover ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  text-align: ${align};
  line-height: 20px;
  padding: 5px;
  ${presets.ELLIPSIS};
  flex-shrink: 0;
  color: ${selected ? colors.TEAL : colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  z-index: 20;
`;