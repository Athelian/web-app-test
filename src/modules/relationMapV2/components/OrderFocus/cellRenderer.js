// @flow
import * as React from 'react';
import { uuid } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import BaseCard from 'components/Cards';
import {
  ORDER,
  ORDER_ITEM,
  BATCH,
  CONTAINER,
  SHIPMENT,
  ORDER_WIDTH,
  ORDER_ITEM_WIDTH,
  CONTAINER_WIDTH,
} from 'modules/relationMapV2/constants';
import type { CellRender, State } from './type.js.flow';
import RelationLine from '../RelationLine';
import { ContentStyle } from './style';
import {
  getColorByEntity,
  getIconByEntity,
  getCardByEntity,
  findLineColors,
  OrderCard,
  ItemCard,
  BatchCard,
  ShipmentCard,
  ContainerCard,
} from './helpers';

const cellRenderer = (
  cell: ?CellRender,
  {
    onClick,
    isExpand,
    dispatch,
    state,
  }: {
    onClick: Function,
    dispatch: Function,
    isExpand: boolean,
    state: State,
  }
) => {
  if (!cell)
    return (
      <div
        style={{
          display: 'flex',
          width: ORDER_WIDTH,
        }}
        key={uuid()}
      >
        <div className={ContentStyle} />
        <div className={ContentStyle} />
        <div className={ContentStyle} />
      </div>
    );
  const { beforeConnector, type, data, entity, afterConnector } = cell;
  let content = <div className={ContentStyle} />;
  switch (type) {
    case 'placeholder': {
      const color = getColorByEntity(entity);
      const icon = getIconByEntity(entity);
      const PlaceHolder = getCardByEntity(entity);
      content = (
        <div className={ContentStyle}>
          <BaseCard icon={icon} color={color}>
            <PlaceHolder>
              <LoadingIcon />
            </PlaceHolder>
          </BaseCard>
        </div>
      );
      break;
    }
    case ORDER:
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="ORDER"
            color="ORDER"
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(`${ORDER}-${getByPathWithDefault('', 'id', data)}`)}
            selectable
            onClick={() =>
              dispatch({
                type: 'TARGET',
                payload: {
                  entity: `${ORDER}-${getByPathWithDefault('', 'id', data)}`,
                },
              })
            }
          >
            <OrderCard>{getByPathWithDefault('', 'poNo', data)}</OrderCard>
          </BaseCard>
        </div>
      );
      break;
    case ORDER_ITEM:
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(
              `${ORDER_ITEM}-${getByPathWithDefault('', 'id', data)}`
            )}
            selectable
            onClick={() =>
              dispatch({
                type: 'TARGET',
                payload: {
                  entity: `${ORDER_ITEM}-${getByPathWithDefault('', 'id', data)}`,
                },
              })
            }
          >
            <ItemCard>{getByPathWithDefault('', 'no', data)}</ItemCard>
          </BaseCard>
        </div>
      );
      break;
    case BATCH:
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="BATCH"
            color="BATCH"
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(`${BATCH}-${getByPathWithDefault('', 'id', data)}`)}
            selectable
            onClick={() =>
              dispatch({
                type: 'TARGET',
                payload: {
                  entity: `${BATCH}-${getByPathWithDefault('', 'id', data)}`,
                },
              })
            }
          >
            <BatchCard>{getByPathWithDefault('', 'no', data)}</BatchCard>
          </BaseCard>
        </div>
      );
      break;
    case SHIPMENT:
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="SHIPMENT"
            color="SHIPMENT"
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(`${SHIPMENT}-${getByPathWithDefault('', 'id', data)}`)}
            selectable
            onClick={() =>
              dispatch({
                type: 'TARGET',
                payload: {
                  entity: `${SHIPMENT}-${getByPathWithDefault('', 'id', data)}`,
                },
              })
            }
          >
            <ShipmentCard>{getByPathWithDefault('', 'blNo', data)}</ShipmentCard>
          </BaseCard>
        </div>
      );
      break;
    case 'shipmentWithoutContainer':
      content = (
        <div style={{ width: CONTAINER_WIDTH - 20 }} className={ContentStyle}>
          <RelationLine
            {...findLineColors({
              position: 'center',
              type,
              state,
              cell,
            })}
            type="HORIZONTAL"
          />
        </div>
      );
      break;
    case CONTAINER:
      content = (
        <div className={ContentStyle}>
          <BaseCard
            icon="CONTAINER"
            color="CONTAINER"
            isArchived={getByPathWithDefault(false, 'archived', data)}
            selected={state.targets.includes(
              `${CONTAINER}-${getByPathWithDefault('', 'id', data)}`
            )}
            selectable
            onClick={() =>
              dispatch({
                type: 'TARGET',
                payload: {
                  entity: `${CONTAINER}-${getByPathWithDefault('', 'id', data)}`,
                },
              })
            }
          >
            <ContainerCard>{getByPathWithDefault('', 'no', data)}</ContainerCard>
          </BaseCard>
        </div>
      );
      break;
    case 'itemSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <ItemCard>Total: {getByPathWithDefault(0, 'orderItemCount', data)} </ItemCard>
          </BaseCard>
        </div>
      );
      break;
    case 'batchSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <BatchCard>Total: {getByPathWithDefault(0, 'batchCount', data)}</BatchCard>
          </BaseCard>
        </div>
      );
      break;
    case 'containerSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <ContainerCard>Total: {getByPathWithDefault(0, 'containerCount', data)}</ContainerCard>
          </BaseCard>
        </div>
      );
      break;
    case 'shipmentSummary':
      content = (
        <div className={ContentStyle} onClick={onClick} role="presentation">
          <BaseCard
            icon={isExpand ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOWN'}
            color={isExpand ? 'GRAY_QUITE_LIGHT' : 'BLACK'}
            style={
              isExpand
                ? {
                    background: '#DDDDDD',
                  }
                : {}
            }
          >
            <ShipmentCard>Total {getByPathWithDefault(0, 'shipmentCount', data)}</ShipmentCard>
          </BaseCard>
        </div>
      );
      break;
    case 'duplicateOrder':
      content = (
        <div
          style={{
            width: ORDER_WIDTH - 20,
          }}
          className={ContentStyle}
        >
          {type}{' '}
        </div>
      );
      break;
    case 'duplicateOrderItem':
      content = (
        <div
          style={{
            width: ORDER_ITEM_WIDTH - 20,
          }}
          className={ContentStyle}
        >
          {type}{' '}
        </div>
      );
      break;
    default:
      content = <div className={ContentStyle}>{type} </div>;
  }
  return (
    <div
      style={{
        display: 'flex',
      }}
      key={`${getByPathWithDefault(uuid(), 'data.id', cell)}-${type}`}
    >
      <div className={ContentStyle}>
        {beforeConnector && (
          <RelationLine
            {...findLineColors({
              position: 'before',
              type,
              state,
              cell,
            })}
            type={beforeConnector}
          />
        )}
      </div>
      {content}
      <div className={ContentStyle}>
        {afterConnector && (
          <RelationLine
            {...findLineColors({
              position: 'after',
              type,
              state,
              cell,
            })}
            type={afterConnector}
          />
        )}
      </div>
    </div>
  );
};

export default cellRenderer;
