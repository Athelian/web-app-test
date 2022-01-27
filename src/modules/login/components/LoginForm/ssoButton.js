// @flow
import * as React from 'react';
import { SsoButtonStyle, LogoStyle } from 'modules/login/style';
import googleIcon from 'media/google.png';
import { FormattedMessage } from 'react-intl';

type Props = {|
  type: string,
|};

const SsoButton = ({ type }: Props) => {
  const serverURL = process.env.ZENPORT_SERVER_URL || '';
  return (
    <a href={`${serverURL}/sso/login/${type}`} style={{ width: '100%' }}>
      <button type="button" className={SsoButtonStyle}>
        {type === 'google' && (
          <>
            <img src={googleIcon} className={LogoStyle} alt="google logo" />
            <FormattedMessage id="modules.Login.google" defaultMessage="Continue with Google" />
          </>
        )}
      </button>
    </a>
  );
};

export default SsoButton;