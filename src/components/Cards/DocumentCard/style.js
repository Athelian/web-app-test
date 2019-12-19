// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes, transitions } from 'styles/common';

export const DocumentCardWrapperStyle = (cardHeight: string): string => css`
  ${layout.GRID_VERTICAL};
  position: relative;
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  height: ${cardHeight};
  padding: 10px 0;
`;

export const DocumentParentWrapperStyle: string = css`
  display: flex;
  padding: 0 10px;
`;

export const DocumentTypeStyle: string = css`
  padding: 0 5px;
`;

export const FileExtensionIconStyle = (color: string): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  font-size: 36px;
  color: ${colors[color]};
`;

export const FileNameWrapperStyle: string = css`
  display: flex;
  overflow: hidden;
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
`;

export const FileNameStyle: string = css`
  ${presets.ELLIPSIS};
`;

export const StatusAndButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  justify-content: center;
`;

export const MemoButtonStyle = (hasMemo: boolean): string => css`
  ${presets.BUTTON};
  width: 30px;
  height: 30px;
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  ${hasMemo
    ? `
    color: ${colors.BLUE};
    &:hover, :focus {
      color: ${colors.BLUE_DARK};
      background-color: ${colors.GRAY_SUPER_LIGHT};
    }
  `
    : `
    color: ${colors.GRAY_LIGHT};
    &:hover, :focus {
      color: ${colors.GRAY};
      background-color: ${colors.GRAY_SUPER_LIGHT};
    }
  `};
`;

const getFileStatusColor = (status: string): { textColor: string, backgroundColor: string } => {
  switch (status) {
    case 'Draft':
      return { textColor: 'BLACK', backgroundColor: 'GRAY_SUPER_LIGHT' };
    case 'Submitted':
      return { textColor: 'WHITE', backgroundColor: 'BLUE' };
    case 'Revise':
      return { textColor: 'WHITE', backgroundColor: 'RED' };
    case 'Approved':
      return { textColor: 'WHITE', backgroundColor: 'TEAL' };
    default:
      return { textColor: 'BLACK', backgroundColor: 'WHITE' };
  }
};

export const FileStatusColoringWrapperStyle = (status: string, editable: boolean) => {
  const coloring = getFileStatusColor(status);

  if (editable) {
    return css`
      & > div {
        & > div {
          & > div {
            background-color: ${colors[coloring.backgroundColor]};
            & > input {
              color: ${colors[coloring.textColor]};
            }
          }
        }
      }
    `;
  }
  return css`
    background-color: ${colors[coloring.backgroundColor]};
    ${borderRadiuses.MAIN};
    & > div {
      & > div {
        color: ${colors[coloring.textColor]};
      }
    }
  `;
};

export const DownloadButtonStyle = (isDisabled: boolean): string => css`
  ${presets.BUTTON};
  width: 30px;
  height: 30px;
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  ${isDisabled
    ? `
    color: ${colors.GRAY_SUPER_LIGHT};
    cursor: default;
  `
    : `
    color: ${colors.GRAY_LIGHT};
    &:hover {
      color: ${colors.TEAL};
      background-color: ${colors.GRAY_SUPER_LIGHT};
    }
  `};
`;

export const MemoWrapperStyle = (height: string) => css`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  height: ${height};
  width: 195px;
  ${transitions.EXPAND};
  overflow: hidden;
  z-index: 3;
  padding: 0 5px;
`;

export const MemoTitleStyle: string = css`
  display: flex;
`;

export const CloseButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  width: 30px;
  height: 30px;
  &:hover,
  :focus {
    color: ${colors.GRAY};
  }
`;

export const MemoInputWrapperStyle: string = css`
  padding: 0 0 5px 0;
`;
