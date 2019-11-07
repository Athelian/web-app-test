// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets } from 'styles/common';

export const CellInputWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  padding: 0 5px;
  height: 30px;
  width: 100%;
`;

export const InputStyle: string = css`
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  background: transparent;
  width: 100%;
  line-height: 18px;
  font-weight: 600;

  &::placeholder {
    color: ${colors.GRAY_LIGHT};
  }
`;