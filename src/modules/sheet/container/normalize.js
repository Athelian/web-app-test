// @flow
import { normalizeSheetInput } from 'modules/sheet/common/normalize';
import { extractForbiddenId } from 'utils/data';

export default function normalizeSheetContainerInput(
  order: Object,
  field: string,
  value: any
): Object {
  switch (field) {
    case 'warehouseArrivalAgreedDate':
    case 'warehouseArrivalActualDate':
    case 'departureDate':
      return {
        [(field: string)]: value ? new Date(value) : null,
      };
    case 'tags':
      return {
        tagIds: value.map(tag => extractForbiddenId(tag).id).filter(Boolean),
      };
    case 'warehouseArrivalAgreedDateApproved':
      return {
        warehouseArrivalAgreedDateApprovedById: value?.user?.id ?? null,
      };
    case 'warehouseArrivalActualDateApproved':
      return {
        warehouseArrivalActualDateApprovedById: value?.user?.id ?? null,
      };
    case 'departureDateApproved':
      return {
        departureDateApprovedById: value?.user?.id ?? null,
      };
    case 'freeTimeStartDate': {
      const { auto: autoCalculatedFreeTimeStartDate = false, value: date = null } = value || {};
      return {
        autoCalculatedFreeTimeStartDate,
        freeTimeStartDate: date ? new Date(date) : null,
      };
    }
    case 'warehouse':
      return {
        warehouseId: value?.id ?? null,
      };
    default:
      return normalizeSheetInput(order, field, value);
  }
}
