// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { actionCreators } from 'modules/relationMapBeta/order/store';
import BaseCard, { ShipmentCard } from 'components/Cards';
import { WrapperCard } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import type { ShipmentProps } from 'modules/relationMapBeta/order/type.js.flow';
import { ItemWrapperStyle } from 'modules/relationMap/common/RelationItem/style';

type OptionalProps = {
  wrapperClassName: string,
};

type Props = OptionalProps & ShipmentProps;

const defaultProps = {
  wrapperClassName: ItemWrapperStyle(false),
};

export default function Shipment({ wrapperClassName, id, tags, ...shipment }: Props) {
  const context = React.useContext(ActionDispatch);
  const {
    state: { showTag },
    dispatch,
  } = context;
  const actions = actionCreators(dispatch);
  return (
    <BaseCard wrapperClassName={wrapperClassName}>
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            {/* Send empty array for tags for hidden tags on shipment card when hidden tags */}
            <ShipmentCard shipment={showTag ? shipment : { ...shipment, tags: [] }} actions={[]} />
            <ActionCard show={hovered}>
              {({ targetted, toggle }) => (
                <>
                  {/* NOTE: why need to send targetted and toggle to ACTION */}
                  <Action
                    icon="MAGIC"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.toggleHighLight('SHIPMENT', id)}
                  />
                  <Action
                    icon="DOCUMENT"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.showEditForm('SHIPMENT', id)}
                  />
                  <Action
                    icon="CHECKED"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => actions.targetEntity('SHIPMENT', id)}
                  />
                </>
              )}
            </ActionCard>
          </WrapperCard>
        )}
      </BooleanValue>
    </BaseCard>
  );
}

Shipment.defaultProps = defaultProps;
