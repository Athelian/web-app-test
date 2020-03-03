// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import { Display } from 'components/Form';
import CornerIcon from 'components/CornerIcon';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { CellDisplayWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import { CardStyle, PartnerNameStyle, PartnerCodeStyle } from './style';

const PartnerDisplay = ({ value }: DisplayProps<Object | null>) => {
  const name = value?.partner?.name || value?.name || value?.organization?.name || '';
  const code = value?.partner?.code || '';

  return (
    <div className={CellDisplayWrapperStyle}>
      {value && (
        <div className={CardStyle(!!name && !!code)}>
          <Display height={name && code ? '40px' : '20px'}>
            <div className={PartnerNameStyle}>{`Partner Name: ${name}`}</div>
            <div className={PartnerCodeStyle}>{`Partner Code: ${code}`}</div>
          </Display>

          <CornerIcon icon="PARTNER" color={colors.PARTNER} />
        </div>
      )}
    </div>
  );
};

export default PartnerDisplay;
