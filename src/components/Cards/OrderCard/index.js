// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import { Label, Display, FieldItem } from 'components/Form';
import BaseCard from '../BaseCard';
import {
  OrderCardWrapperStyle,
  OrderInfoWrapperStyle,
  PONoWrapperStyle,
  ExporterWrapperStyle,
  DividerStyle,
  ChartWrapperStyle,
  InChargeWrapperStyle,
  TagsWrapperStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  order: ?Object,
};

const defaultProps = {
  actions: [],
};

const OrderCard = ({ order, actions, ...rest }: Props) => {
  if (!order) return '';

  const {
    id,
    poNo,
    issuedAt,
    totalPrice,
    totalOrdered,
    totalBatched,
    totalShipped,
    batchCount,
    batchShippedCount,
    orderItemCount,
    exporter,
    inCharges,
  } = order;

  return (
    <BaseCard icon="ORDER" color="ORDER" actions={actions} {...rest}>
      <Link className={OrderCardWrapperStyle} to={`/order/${encodeId(id)}`}>
        <div className={OrderInfoWrapperStyle}>
          <div className={PONoWrapperStyle}>
            <Display align="left">{poNo}</Display>
          </div>
          <div className={ExporterWrapperStyle}>
            <Icon icon="EXPORTER" />
            {exporter.name}
          </div>
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.ttlPrice" defaultMessage="TTL PRICE" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={totalPrice.amount} suffix={totalPrice.currency} />
              </Display>
            }
          />
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.ttlItems" defaultMessage="TTL ITEMS" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={orderItemCount} />
              </Display>
            }
          />
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.poDate" defaultMessage="PO DATE" />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={issuedAt} />
              </Display>
            }
          />
          <div className={DividerStyle} />
          <div className={ChartWrapperStyle}>
            <QuantityChart
              hasLabel={false}
              orderedQuantity={totalOrdered}
              batchedQuantity={totalBatched}
              shippedQuantity={totalShipped}
              batched={batchCount}
              shipped={batchShippedCount}
            />
          </div>
          <div className={InChargeWrapperStyle}>
            {inCharges &&
              inCharges.map(inCharge => (
                <UserAvatar
                  firstName={inCharge.firstName}
                  lastName={inCharge.lastName}
                  key={inCharge.id}
                />
              ))}
          </div>
          <div className={TagsWrapperStyle}>
            {order.tags.length > 0 && order.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </Link>
    </BaseCard>
  );
};

OrderCard.defaultProps = defaultProps;

export default OrderCard;
