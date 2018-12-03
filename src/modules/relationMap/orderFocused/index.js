// @flow
import React from 'react';
import { createObjectValue, BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { Subscribe } from 'unstated';
import {
  OrderFocusedShipmentScrollWrapperStyle,
  OrderMapWrapperStyle,
} from 'modules/relationMap/style';
import { shipmentListQuery } from 'modules/relationMap/orderFocused/query';
import { ActionContainer } from 'modules/relationMap/containers';
import RelationView from '../common/RelationView';
import SlideForm from '../common/SlideForm';
import DeleteDialog from '../common/Dialog/DeleteDialog';
import ShipmentList from '../common/ShipmentList';
import QueryHandler from '../common/QueryHandler';
import { ShipmentToggleValue } from '../common/SummaryBadge';
import generateRelation, { getItemData, getItemType } from './relation';
import Item from './Item';

type OptionalProps = {
  id: string,
};

type Props = OptionalProps & {
  order: Object,
  hasMore: boolean,
  loadMore: Function,
  nodes: Array<Object>,
};

const defaultProps = {
  id: '',
};

export const ToggleCollpased = createObjectValue({});

const OrderFocused = ({
  order: { order, orderItem, batch, shipment },
  nodes,
  hasMore,
  loadMore,
  id,
}: Props) => (
  <>
    <RelationView
      id={id}
      className={OrderMapWrapperStyle}
      isEmpty={nodes ? nodes.length === 0 : true}
      spacing={70}
      emptyMessage={
        <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
      }
      hasMore={hasMore}
      onLoadMore={loadMore}
      customRender={() =>
        nodes.map(item => (
          <ToggleCollpased key={item.id}>
            {({ value: collapsed, set }) => {
              const isCollapsed = Object.prototype.hasOwnProperty.call(collapsed, item.id)
                ? collapsed[item.id]
                : true;
              const toggle = () => set(item.id, !isCollapsed);
              const relations = generateRelation(item, { isCollapsed });
              return relations.map((relation, relationIndex) => {
                const key = `relation-${relationIndex}`;
                const itemData = getItemData({ order, orderItem, batch }, relation) || {};
                const itemType = getItemType(relation.type);
                return (
                  <Item
                    key={key}
                    onToggle={toggle}
                    isCollapsed={isCollapsed}
                    relation={relation}
                    itemData={itemData}
                    itemType={itemType}
                  />
                );
              });
            }}
          </ToggleCollpased>
        ))
      }
    />
    <Subscribe to={[ActionContainer]}>
      {({ state: { result } }) => (
        <div className={OrderFocusedShipmentScrollWrapperStyle}>
          <ShipmentToggleValue>
            {({ value: { isToggle: isToggleShipment, total }, set: setShipmentToggle }) => {
              if (isToggleShipment) {
                return (
                  <Query
                    query={shipmentListQuery}
                    variables={{
                      page: 1,
                      perPage: 10,
                    }}
                  >
                    {({ loading, data, error, fetchMore }) => (
                      <QueryHandler
                        model="shipments"
                        loading={loading}
                        data={data}
                        fetchMore={fetchMore}
                        error={error}
                        onChangePage={({ nodes: shipmentItems }) => {
                          const totalShipment = shipmentItems.length;
                          if (totalShipment !== total) {
                            setShipmentToggle('total', totalShipment);
                          }
                        }}
                      >
                        {({
                          nodes: shipmentNodes,
                          hasMore: hasMoreShipment,
                          loadMore: loadMoreShipment,
                        }) => (
                          <>
                            <ShipmentList shipment={shipment} result={result.shipment} />
                            <RelationView
                              isEmpty={shipmentNodes ? shipmentNodes.length === 0 : true}
                              spacing={0}
                              hasMore={hasMoreShipment}
                              onLoadMore={loadMoreShipment}
                              emptyMessage={
                                <FormattedMessage
                                  id="modules.Orders.noOrderFound"
                                  defaultMessage="No Shipment found"
                                />
                              }
                              customRender={() =>
                                shipmentNodes
                                  .filter(({ id: shipmentId }) => !shipment[shipmentId])
                                  .map(shipmentNode => (
                                    <BooleanValue defaultValue key={shipmentNode.id}>
                                      {({ value: isCollapsed, toggle }) => (
                                        <Item
                                          onToggle={toggle}
                                          isCollapsed={isCollapsed}
                                          relation={{
                                            type: isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT',
                                            id: shipmentNode.id,
                                          }}
                                          itemData={{ data: shipmentNode }}
                                          itemType="shipment"
                                        />
                                      )}
                                    </BooleanValue>
                                  ))
                              }
                            />
                          </>
                        )}
                      </QueryHandler>
                    )}
                  </Query>
                );
              }
              return <ShipmentList shipment={shipment} result={result.shipment} />;
            }}
          </ShipmentToggleValue>
        </div>
      )}
    </Subscribe>

    <SlideForm />
    <DeleteDialog />
  </>
);

OrderFocused.defaultProps = defaultProps;

export default OrderFocused;
