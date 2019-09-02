// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { WrapperStyle, BatchIconsStyle } from './style';

type Props = {|
  no: string,
  onCreateBatch: () => void,
|};

export default function OrderItemCard({ no, onCreateBatch }: Props) {
  return (
    <div className={WrapperStyle}>
      {no}
      <div onClick={onCreateBatch} role="presentation" className={BatchIconsStyle}>
        <Icon icon="BATCH" />
        <Icon icon="ADD" />
      </div>
    </div>
  );
}
