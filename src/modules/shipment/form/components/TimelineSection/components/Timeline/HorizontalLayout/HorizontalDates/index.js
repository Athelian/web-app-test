// @flow
import * as React from 'react';
import { isEnableBetaFeature } from 'utils/env';
import Icon from 'components/Icon';
import { TimelineDate, TimelineDateContainers } from '../../components';
import {
  HorizontalDatesWrapperStyle,
  SingleDateWrapperStyle,
  DoubleDatesWrapperStyle,
  BlankPlaceholderStyle,
  ArrivalDepartureIconsWrapperStyle,
} from './style';

type Props = {
  shipment: any,
};

const HorizontalDates = ({ shipment }: Props) => {
  const { cargoReady, voyages, containerGroups, containers } = shipment;
  const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];

  if ((isEnableBetaFeature && containers && containers.length > 0) || voyages.length > 1) {
    return (
      <div className={HorizontalDatesWrapperStyle}>
        <div className={ArrivalDepartureIconsWrapperStyle}>
          <Icon icon="ARRIVAL_HORIZONTAL" />
          <Icon icon="DEPARTURE_HORIZONTAL" />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={cargoReady} />
          <div className={BlankPlaceholderStyle} />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <div className={BlankPlaceholderStyle} />
          <TimelineDate timelineDate={voyages[0].departure} />
        </div>

        {voyages.length > 1 &&
          voyages.slice(1).map((voyage, voyageIndex) => (
            <div className={DoubleDatesWrapperStyle} key={voyage.id}>
              <TimelineDate timelineDate={voyages[voyageIndex].arrival} />
              <TimelineDate timelineDate={voyage.departure} />
            </div>
          ))}

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={voyages[voyages.length - 1].arrival} />
          <div className={BlankPlaceholderStyle} />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={customClearance} />
          <div className={BlankPlaceholderStyle} />
        </div>

        {isEnableBetaFeature && containers && containers.length > 0 ? (
          <TimelineDateContainers containers={containers} />
        ) : (
          <div className={DoubleDatesWrapperStyle}>
            <TimelineDate timelineDate={warehouseArrival} />
            <div className={BlankPlaceholderStyle} />
          </div>
        )}

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={deliveryReady} />
          <div className={BlankPlaceholderStyle} />
        </div>
      </div>
    );
  }

  return (
    <div className={HorizontalDatesWrapperStyle}>
      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={cargoReady} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={voyages[0].departure} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={voyages[voyages.length - 1].arrival} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={customClearance} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={warehouseArrival} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={deliveryReady} />
      </div>
    </div>
  );
};

export default HorizontalDates;
