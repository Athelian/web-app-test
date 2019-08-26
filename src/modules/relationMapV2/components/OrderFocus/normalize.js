import { normalize, schema } from 'normalizr';
import memoize from 'memoize-one';
import isDeepEqual from 'lodash.isequal';

const batch = new schema.Entity('batches');
const container = new schema.Entity('containers');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');
const ownedBy = new schema.Entity('organizations');
const hit = new schema.Entity('hits');
const entity = new schema.Entity(
  'entity',
  {},
  // eslint-disable-next-line no-underscore-dangle
  { idAttribute: value => `${value.id}-${value.__typename}` }
);
const entityHit = new schema.Entity('entityHits');
entityHit.define({
  entity,
});
hit.define({
  entityHits: [entityHit],
});

// TODO: try to define a mapping key on schema

batch.define({
  shipment,
  container,
  ownedBy,
});

container.define({
  shipment,
  ownedBy,
});

orderItem.define({
  batches: [batch],
  ownedBy,
});

order.define({
  orderItems: [orderItem],
  shipments: [shipment],
  containers: [container],
  ownedBy,
});

shipment.define({
  batches: [batch],
  ownedBy,
});

export default memoize(originalData => {
  const { entities } = normalize(originalData, { orders: [order] });
  return entities;
}, isDeepEqual);

export const normalizeEntity = memoize(originalData => {
  const { entities } = normalize(originalData, { hits: [hit] });
  return entities;
}, isDeepEqual);
