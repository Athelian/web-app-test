// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Order } from 'modules/order/type.js.flow';
import BaseCard, { CardAction } from 'components/Cards';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { OrderCardWrapperStyle } from './style';

type Props = {
  order: ?Order,
};

const OrderCard = ({ order }: Props) => {
  if (!order) return '';

  const { id } = order;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <BaseCard icon="ORDER" color="ORDER" actions={actions}>
      <div
        className={OrderCardWrapperStyle}
        onClick={() => navigate(`/order/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

export default OrderCard;
