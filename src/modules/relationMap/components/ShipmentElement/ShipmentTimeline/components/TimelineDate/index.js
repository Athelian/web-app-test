// @flow
import * as React from 'react';
// $FlowFixMe flow not yet configured
// import differenceInDays from 'date-fns/differenceInDays';
import Icon from 'components/Icon';
// import FormattedDate from 'components/FormattedDate';
import { TimelineDateWrapperStyle, DateStyle, ApprovedIconStyle } from './style';

type OptionalProps = {};

type Props = OptionalProps & {
  timelineDate: {
    date: ?string | Date,
    timelineDateRevisions: Array<{
      date: ?string | Date,
    }>,
    approvedAt: ?string | Date,
  },
};

const TimelineDate = ({ timelineDate }: Props) => {
  const { date, timelineDateRevisions, approvedAt } = timelineDate;

  const hasMultipleDates = timelineDateRevisions.length > 0;

  let shownDate = '';
  if (hasMultipleDates) {
    shownDate = timelineDateRevisions[timelineDateRevisions.length - 1].date;
  } else if (date) {
    shownDate = date;
  }

  // let delayAmount = 0;
  // if (date && hasMultipleDates) {
  //   delayAmount = differenceInDays(
  //     timelineDateRevisions[timelineDateRevisions.length - 1].date,
  //     date
  //   );
  // }

  return (
    <div className={TimelineDateWrapperStyle}>
      <div className={DateStyle(!!shownDate)}>{shownDate || 'No date'}</div>
      {approvedAt && (
        <div className={ApprovedIconStyle(!!approvedAt)}>
          <Icon icon="CHECKED" />
        </div>
      )}
    </div>
  );
};

export default TimelineDate;
