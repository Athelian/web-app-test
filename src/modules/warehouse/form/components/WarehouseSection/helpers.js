// @flow
import * as React from 'react';
import { PartnerCard, GrayCard } from 'components/Cards';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { DashedPlusButton } from 'components/Form';

export const renderPartners = (groups: Array<Object>, allowToUpdate: boolean) => {
  const numOfForwarders = groups.length;

  if (numOfForwarders === 0) {
    if (allowToUpdate) {
      return <DashedPlusButton width="195px" height="215px" />;
    }
    return <GrayCard width="195px" height="215px" />;
  }
  if (numOfForwarders === 1) {
    return <PartnerCard partner={groups[0]} readOnly={!allowToUpdate} />;
  }
  if (numOfForwarders === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={groups[0]} size="half" readOnly={!allowToUpdate} />
        <PartnerCard partner={groups[1]} size="half" readOnly={!allowToUpdate} />
      </GridColumn>
    );
  }
  if (numOfForwarders === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={groups[0]} size="half" readOnly={!allowToUpdate} />
        <GridRow gap="10px">
          <PartnerCard partner={groups[1]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={groups[2]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfForwarders > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={groups[0]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={groups[1]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={groups[2]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={groups[3]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

export default renderPartners;
