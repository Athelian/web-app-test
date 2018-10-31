// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes } from 'styles/common';

export const ActionSection1WrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* width: 100%; */
  height: 50px;
  background: ${colors.GRAY_SUPER_LIGHT};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  ${transitions.EXPAND};
`;

export const ActionSection2WrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  background: ${colors.GRAY_SUPER_LIGHT};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  ${transitions.EXPAND};
`;

export const ActionsSelectedStyle: string = css`
  display: flex;
  flex-direction: row;
  > div {
    padding: 0 20px;
    ${fontSizes.MEDIUM};
  }

  > div:first-child {
    color: ${colors.GRAY_DARK};
  }
`;

export const ChildrenWrapperStyle: string = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  grid-template-rows: 50px;
  grid-gap: 20px;
  align-items: center;
`;

export const TabItemWrapperStyle = css`
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;
