// @flow
import gql from 'graphql-tag';
import {
  orderFormFragment,
  userAvatarFragment,
  tagFragment,
  partnerCardFragment,
  documentFragment,
  shipmentCardFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  timelineDateMinimalFragment,
  portFragment,
  batchFormFragment,
  metricFragment,
  sizeFragment,
  orderCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
  ownedByFragment,
  taskCardFragment,
} from 'graphql';
import {
  prepareUpdateBatchInput,
  prepareCreateBatchInput,
  prepareParsedUpdateBatchInput,
} from 'modules/batch/form/mutation';
import { prepareCustomFieldsData } from 'utils/customFields';
import {
  parseGenericField,
  parseMemoField,
  parseDateField,
  parseEnumField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseCustomFieldsField,
  parseFilesField,
  parseTasksField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';
import type { OrderForm } from '../type.js.flow';

export const createOrderMutation = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      ... on Order {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const createOrderWithReturnDataMutation = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      ...orderFormFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${badRequestFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
`;

export const prepareCreateOrderInput = ({
  orderItems = [],
  files = [],
  inCharges = [],
  exporter = {},
  tags = [],
  issuedAt = '',
  poNo,
  currency,
  deliveryPlace,
  customFields,
  piNo,
  memo,
  incoterm,
}: Object): OrderForm => ({
  poNo,
  piNo,
  currency: currency && currency.length > 0 ? currency : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  deliveryPlace,
  customFields: prepareCustomFieldsData(customFields),
  memo,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id }) => id),
  inChargeIds: inCharges.map(({ id }) => id),
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, order, price, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      price: { ...price, currency },
      productProviderId: productProvider.id,
      batches: batches.map(batch => prepareCreateBatchInput(batch, false)),
    })
  ),
  files: files.map(({ id, name, type, memo: fileMemo }) => ({
    id,
    name,
    type,
    memo: fileMemo,
  })),
});

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...orderFormFragment
      ...badRequestFragment
    }
  }

  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${badRequestFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${taskCardFragment}
`;

export const updateOrderItemMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ... on Order {
        id
        orderItems {
          ... on OrderItem {
            id
            batches {
              ... on Batch {
                id
              }
            }
          }
        }
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const prepareUpdateOrderInput = ({
  issuedAt = '',
  orderItems = [],
  files = [],
  tags = [],
  inCharges = [],
  exporter = {},
  poNo,
  currency,
  deliveryPlace,
  customFields,
  piNo,
  memo,
  incoterm,
  archived,
}: Object): OrderForm => ({
  poNo,
  currency: currency && currency.length > 0 ? currency : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  deliveryPlace,
  customFields: prepareCustomFieldsData(customFields),
  piNo,
  memo,
  archived,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id: tagId }) => tagId),
  inChargeIds: inCharges.map(({ id: userId }) => userId),
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, price, order, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      ...(isNew ? {} : { id: itemId }),
      productProviderId: productProvider.id,
      price: { ...price, currency },
      batches: batches.map(batch => prepareUpdateBatchInput(batch, false, false)),
    })
  ),
  files: files.map(({ id, name, type, memo: fileMemo }) => ({
    id,
    name,
    type,
    memo: fileMemo,
  })),
});

export const prepareParsedUpdateOrderInput = (
  originalValues: Object,
  newValues: Object
): OrderForm => ({
  ...parseGenericField('poNo', originalValues.poNo, newValues.poNo),
  ...parseGenericField('piNo', originalValues.piNo, newValues.piNo),
  ...parseDateField('issuedAt', originalValues.issuedAt, newValues.issuedAt),
  ...parseEnumField('currency', originalValues.currency, newValues.currency),
  ...parseEnumField('incoterm', originalValues.incoterm, newValues.incoterm),
  ...parseGenericField('deliveryPlace', originalValues.deliveryPlace, newValues.deliveryPlace),
  ...parseCustomFieldsField('customFields', originalValues.customFields, newValues.customFields),
  ...parseArrayOfIdsField('tagIds', originalValues.tags, newValues.tags),
  ...parseMemoField('memo', originalValues.memo, newValues.memo),
  ...parseArrayOfIdsField('inChargeIds', originalValues.inCharges, newValues.inCharges),
  ...parseParentIdField('exporterId', originalValues.exporter, newValues.exporter),
  ...parseArrayOfChildrenField(
    'orderItems',
    originalValues.orderItems,
    newValues.orderItems,
    (oldItem: ?Object, newItem: Object) => ({
      ...(!oldItem ? {} : { id: oldItem.id }),
      ...parseParentIdField(
        'productProviderId',
        getByPathWithDefault(null, 'productProvider', oldItem),
        newItem.productProvider
      ),
      ...parseGenericField(
        'quantity',
        getByPathWithDefault(null, 'quantity', oldItem),
        newItem.quantity
      ),
      ...parseGenericField('price', getByPathWithDefault(null, 'price', oldItem), {
        amount: newItem.price.amount,
        currency: newValues.currency,
      }),
      ...(!oldItem
        ? { batches: [] }
        : parseArrayOfChildrenField(
            'batches',
            getByPathWithDefault(null, 'batches', oldItem),
            newItem.batches,
            (oldBatch: ?Object, newBatch: Object) =>
              prepareParsedUpdateBatchInput(oldBatch, newBatch, {
                inOrderForm: true,
                inBatchForm: false,
                inContainerForm: false,
                inShipmentForm: false,
              })
          )),
    })
  ),
  ...parseFilesField('files', originalValues.files, newValues.files),
  ...parseTasksField(getByPathWithDefault(null, 'todo', originalValues), newValues.todo),
});
