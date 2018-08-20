// @flow
import { css } from 'react-emotion';
import { scrollbars, transitions } from 'styles/common';

export const WrapperStyle = css`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const ContentWrapperStyle = css`
  height: calc(100vh - 50px);
  width: 100%;
  padding: 50px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${transitions.EXPAND};
`;
