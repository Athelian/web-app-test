import { css } from 'react-emotion';
import { layout, gradients, transitions, presets } from 'styles/common';

export const PageNotFoundContainerStyle = css`
  ${layout.FIT};
  ${layout.VERTICAL};
  ${layout.CENTER_CENTER};
  background: ${gradients.BLUE_TEAL_DIAGONAL};
  justify-content: space-between;
  color: #fff;
`;

export const PageNotFoundTitleContainerStyle = css`
  ${layout.VERTICAL};
  ${layout.CENTER_CENTER};
  user-select: none;
  flex: 3;
`;

export const PageNotFoundH1Style = css`
  font-size: 200px;
  line-height: 250px;
  font-weight: 100;
`;

export const PageNotFoundTravoltaStyle = css`
  height: 300px;
`;

export const PageNotFoundH3Style = css`
  font-size: 20px;
  font-weight: 400;
  line-height: 26px;
  padding: 20px;
  text-align: center;
`;

export const PageNotFoundLinkContainerStyle = css`
  flex: 1;
`;

export const PageNotFoundButtonStyle = css`
  ${layout.VERTICAL};
  ${layout.CENTER};
  ${transitions.MAIN};
  ${presets.BUTTON};
  font-size: 14px;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 2px;
  color: #fff;
  text-decoration: none;
  text-shadow: none;
  &:hover {
    text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.4);
  }
`;

export const PageNotFoundLogoStyle = css`
  width: 60px;
`;
