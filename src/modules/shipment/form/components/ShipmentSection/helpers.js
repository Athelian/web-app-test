// @flow
import * as React from 'react';
import { ViewMoreCard, PartnerCard, GrayCard } from 'components/Cards';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { DashedPlusButton } from 'components/Form';

export const renderExporters = (exporters: Array<Object>) => {
  const numOfExporters = exporters.length;

  if (numOfExporters === 0) {
    return <GrayCard width="195px" height="215px" />;
  }
  if (numOfExporters === 1) {
    return <PartnerCard partner={exporters[0]} readOnly />;
  }
  if (numOfExporters === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={exporters[0]} size="half" readOnly />
        <PartnerCard partner={exporters[1]} size="half" readOnly />
      </GridColumn>
    );
  }
  if (numOfExporters === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={exporters[0]} size="half" readOnly />
        <GridRow gap="10px">
          <PartnerCard partner={exporters[1]} size="quarter" readOnly />
          <PartnerCard partner={exporters[2]} size="quarter" readOnly />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfExporters > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={exporters[0]} size="quarter" readOnly />
          <PartnerCard partner={exporters[1]} size="quarter" readOnly />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={exporters[2]} size="quarter" readOnly />
          <PartnerCard partner={exporters[3]} size="quarter" readOnly />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

export const renderForwarders = (forwarders: Array<Object>, allowToUpdate: boolean) => {
  const numOfForwarders = forwarders?.length;

  if (numOfForwarders === 0) {
    if (allowToUpdate) {
      return <DashedPlusButton width="195px" height="215px" />;
    }
    return <GrayCard width="195px" height="215px" />;
  }
  if (numOfForwarders === 1) {
    return <PartnerCard partner={forwarders[0]} readOnly={!allowToUpdate} />;
  }
  if (numOfForwarders === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={forwarders[0]} size="half" readOnly={!allowToUpdate} />
        <PartnerCard partner={forwarders[1]} size="half" readOnly={!allowToUpdate} />
      </GridColumn>
    );
  }
  if (numOfForwarders === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={forwarders[0]} size="half" readOnly={!allowToUpdate} />
        <GridRow gap="10px">
          <PartnerCard partner={forwarders[1]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={forwarders[2]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfForwarders === 4) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={forwarders[0]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={forwarders[1]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={forwarders[2]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={forwarders[3]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfForwarders > 4) {
    return (
      <GridColumn gap="10px">
        <ViewMoreCard
          count={numOfForwarders}
          partner={forwarders[0]}
          cardType="FORWARDER"
          readOnly={!allowToUpdate}
        />
      </GridColumn>
    );
  }
  return '';
};

export const renderPartners = (organizations: Array<Object>, allowToUpdate: boolean) => {
  const num = organizations?.length;

  if (num === 0) {
    if (allowToUpdate) {
      return <DashedPlusButton width="195px" height="215px" />;
    }
    return <GrayCard width="195px" height="215px" />;
  }
  if (num === 1) {
    return <PartnerCard partner={organizations[0]} readOnly={!allowToUpdate} />;
  }
  if (num === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={organizations[0]} size="half" readOnly={!allowToUpdate} />
        <PartnerCard partner={organizations[1]} size="half" readOnly={!allowToUpdate} />
      </GridColumn>
    );
  }
  if (num === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={organizations[0]} size="half" readOnly={!allowToUpdate} />
        <GridRow gap="10px">
          <PartnerCard partner={organizations[1]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={organizations[2]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (num === 4) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={organizations[0]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={organizations[1]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={organizations[2]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={organizations[3]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (num > 4) {
    return (
      <GridColumn gap="10px">
        <ViewMoreCard
          count={num}
          partner={organizations[0]}
          cardType="PARTNER"
          readOnly={!allowToUpdate}
        />
      </GridColumn>
    );
  }
  return '';
};
