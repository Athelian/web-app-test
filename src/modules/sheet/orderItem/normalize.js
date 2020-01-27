// @flow
import { parseTodoField } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetOrderItemInput(
  orderItem: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'price':
      if (newValue.value === null) {
        return { price: null };
      }
      return {
        price: {
          amount: newValue.value,
          currency: newValue.metric,
        },
      };
    case 'deliveryDate':
      return {
        deliveryDate: newValue ? new Date(newValue) : null,
      };
    case 'tags':
      return {
        tagIds: newValue.map(tag => tag.id).filter(Boolean),
      };
    case 'files':
      return {
        files: newValue.map(
          ({ __typename, entity: e, ownedBy, path, uploading, progress, size, ...rest }) => rest
        ),
      };
    case 'todo':
      return parseTodoField(oldValue, newValue);
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(orderItem, field, newValue);
  }
}
