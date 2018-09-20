// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const VoyageInfoSectionWrapperStyle = css`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 40px;
  border-bottom: 1px solid ${colors.GRAY_VERY_LIGHT};
  width: 490px;
`;

export const SelectTransportTypeMessageStyle = css`
  ${presets.ELLIPSIS};
  color: ${colors.GRAY_DARK};
  font-weight: bold;
  ${fontSizes.MAIN};
  text-align: right;
  width: 200px;
  flex-shrink: 0;
`;
