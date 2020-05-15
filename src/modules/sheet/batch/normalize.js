// @flow
import { normalizeSheetInput } from 'modules/sheet/common/normalize';
import { parseTodoField, removeTypename, extractForbiddenId } from 'utils/data';
import { calculateVolume } from 'utils/batch';
import { defaultVolumeMetric } from 'utils/metric';

export default function normalizeSheetBatchInput(
  batch: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'desiredAt':
    case 'expiredAt':
    case 'deliveredAt':
    case 'producedAt':
      return {
        [(field: string)]: newValue ? new Date(newValue) : null,
      };
    case 'packageQuantity': {
      const { auto: autoCalculatePackageQuantity = false, value: packageQuantity = 0 } =
        newValue || {};
      return {
        autoCalculatePackageQuantity,
        packageQuantity,
      };
    }
    case 'packageGrossWeight':
      return {
        packageGrossWeight: newValue ? removeTypename(newValue) : null,
      };
    case 'packageVolume': {
      const { auto: autoCalculatePackageVolume = false, value: packageVolume = 0 } = newValue || {};
      return {
        autoCalculatePackageVolume,
        packageVolume: removeTypename(packageVolume),
      };
    }
    case 'packageSize':
      return {
        packageSize: newValue ? removeTypename(newValue) : null,
        packageVolume: batch?.packageVolume?.auto
          ? calculateVolume(
              batch?.packageVolume?.value ?? { value: 0, metric: defaultVolumeMetric },
              newValue
            )
          : undefined,
      };
    case 'tags':
      return {
        tagIds: newValue.map(tag => extractForbiddenId(tag).id).filter(Boolean),
      };
    case 'todo':
      return parseTodoField(removeTypename(oldValue), removeTypename(newValue));
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(batch, field, newValue);
  }
}
