// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareUpdateBatchInput } from 'modules/batch/form/mutation';
import { cleanUpData } from 'utils/data';
import { isNullOrUndefined } from 'utils/fp';

export const updateContainerMutation = gql`
  mutation containerUpdate($id: ID!, $input: ContainerUpdateInput!) {
    containerUpdate(id: $id, input: $input) {
      container {
        id
        warehouseArrivalAgreedDate
        warehouseArrivalActualDate
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

const getIdOrReturnNull = (obj: { id: string }): string | null =>
  isNullOrUndefined(obj) ? null : obj.id;

const getDateOrReturnNull = (date: string): Date | null => (date ? new Date(date) : null);

export const prepareUpdateContainerInput = ({
  updatedAt,
  updatedBy,
  archived,
  totalBatchPackages,
  totalBatchQuantity,
  totalNumberOfUniqueOrderItems,
  totalVolume,
  totalWeight,
  totalPrice,
  shipment,
  tags,
  warehouse,
  warehouseArrivalAgreedDate,
  warehouseArrivalActualDate,
  warehouseArrivalAgreedDateApprovedAt,
  warehouseArrivalActualDateApprovedAt,
  warehouseArrivalAgreedDateApprovedBy,
  warehouseArrivalActualDateApprovedBy,
  totalAdjusted,
  batches,
  ...rest
}: Object) => ({
  ...rest,
  tagIds: tags.map(({ id }) => id),
  warehouseArrivalAgreedDate: getDateOrReturnNull(warehouseArrivalAgreedDate),
  warehouseArrivalActualDate: getDateOrReturnNull(warehouseArrivalActualDate),
  warehouseArrivalAgreedDateApprovedById: getIdOrReturnNull(warehouseArrivalAgreedDateApprovedBy),
  warehouseArrivalActualDateApprovedById: getIdOrReturnNull(warehouseArrivalActualDateApprovedBy),
  warehouseId: getIdOrReturnNull(warehouse),
  batches: batches
    .map(batch => prepareUpdateBatchInput(cleanUpData(batch), true, false))
    .map(({ container, ...batch }) => ({ ...batch })),
});

export default updateContainerMutation;
