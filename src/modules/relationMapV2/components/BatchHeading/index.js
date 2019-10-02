// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import FormattedDate from 'components/FormattedDate';
import { Display, Label } from 'components/Form';
import { BATCH, BATCH_WIDTH } from 'modules/relationMapV2/constants';
import { isBefore, isAfter, differenceInCalendarDays } from 'utils/date';
import Heading from 'modules/relationMapV2/components/Heading';
import { targetedIds } from 'modules/relationMapV2/components/OrderFocus/helpers';
import { RightWrapperStyle, DatesWrapperStyle } from './style';

const getBatchDateRanges = (batches: Array<Object>) => {
  let oldestDelivery = null;
  let newestDelivery = null;
  let oldestDesired = null;
  let newestDesired = null;

  batches.forEach(batch => {
    const deliveredAt = batch?.deliveredAt || null;
    const desiredAt = batch?.desiredAt || null;

    if (deliveredAt) {
      if (!oldestDelivery) {
        oldestDelivery = deliveredAt;
      } else if (isBefore(new Date(deliveredAt), new Date(oldestDelivery))) {
        oldestDelivery = deliveredAt;
      }

      if (!newestDelivery) {
        newestDelivery = deliveredAt;
      } else if (isAfter(new Date(deliveredAt), new Date(newestDelivery))) {
        newestDelivery = deliveredAt;
      }
    }

    if (desiredAt) {
      if (!oldestDesired) {
        oldestDesired = desiredAt;
      } else if (isBefore(new Date(desiredAt), new Date(oldestDesired))) {
        oldestDesired = desiredAt;
      }

      if (!newestDesired) {
        newestDesired = desiredAt;
      } else if (isAfter(new Date(desiredAt), new Date(newestDesired))) {
        newestDesired = desiredAt;
      }
    }
  });

  return { oldestDelivery, newestDelivery, oldestDesired, newestDesired };
};

type Props = {|
  batches: Array<Object>,
  hasSelectedChildren: boolean,
  hasFilterHits: boolean,
  isExpanded: boolean,
  onClick: Function,
  total: number,
  onSelectAll: Function,
|};

export default function BatchHeading({
  batches,
  hasSelectedChildren,
  hasFilterHits,
  isExpanded,
  onClick,
  total,
  onSelectAll,
}: Props) {
  const { oldestDelivery, newestDelivery, oldestDesired, newestDesired } = getBatchDateRanges(
    batches
  );

  // TODO: Replace with real permissions
  const canViewDelivery = true;
  const canViewDesired = true;
  const { state } = React.useContext(RelationMapContext);
  const batchIds = targetedIds(state.targets, BATCH);
  const selectedItemsCount = batches.filter(item => batchIds.includes(item.id)).length;

  return (
    <Heading
      width={`${BATCH_WIDTH}px`}
      hasSelectedChildren={hasSelectedChildren}
      hasFilterHits={hasFilterHits}
      isExpanded={isExpanded}
      onClick={onClick}
      total={total}
      selectedItemsCount={selectedItemsCount}
      onSelectAll={onSelectAll}
      renderRightSide={() => (
        <div className={RightWrapperStyle}>
          <div className={DatesWrapperStyle}>
            <Label width="75px">
              <FormattedMessage id="components.cards.delivery" />
            </Label>

            <Display blackout={!canViewDelivery}>
              <FormattedDate value={oldestDelivery} />

              {oldestDelivery &&
                newestDelivery &&
                differenceInCalendarDays(new Date(oldestDelivery), new Date(newestDelivery)) !==
                  0 && (
                  <>
                    {' - '}
                    <FormattedDate value={newestDelivery} />
                  </>
                )}
            </Display>
          </div>

          <div className={DatesWrapperStyle}>
            <Label width="75px">
              <FormattedMessage id="components.cards.desired" />
            </Label>

            <Display blackout={!canViewDesired}>
              <FormattedDate value={oldestDesired} />

              {oldestDesired &&
                newestDesired &&
                differenceInCalendarDays(new Date(oldestDesired), new Date(newestDesired)) !==
                  0 && (
                  <>
                    {' - '}
                    <FormattedDate value={newestDesired} />
                  </>
                )}
            </Display>
          </div>
        </div>
      )}
    />
  );
}
