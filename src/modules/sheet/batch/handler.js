/* eslint-disable no-param-reassign */
// @flow
import { ApolloClient } from 'apollo-client';
import type { EntityEventChange } from 'components/Sheet/SheetLive/types';
import { mergeChanges, newCustomValue } from 'components/Sheet/SheetLive/helper';
import { mapAsync } from 'utils/async';
import { tagsByIDsQuery } from 'modules/sheet/common/query';

export async function handleBatchChanges(
  client: ApolloClient<any>,
  changes: Array<EntityEventChange>,
  batch: ?Object
): Promise<Array<EntityEventChange>> {
  changes = await mapAsync(changes, change => {
    switch (change.field) {
      case 'tags':
        return client
          .query({
            query: tagsByIDsQuery,
            variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
          })
          .then(({ data }) => ({
            field: change.field,
            new: newCustomValue(data.tagsByIDs),
          }));
      default:
        break;
    }

    return change;
  });

  if (batch) {
    changes = mergeChanges(
      changes,
      {
        packageQuantity: (i, v) => ({
          ...i,
          value: v,
        }),
        autoCalculatePackageQuantity: (i, v) => ({
          ...i,
          auto: v,
        }),
      },
      'packageQuantity',
      batch.packageQuantity
    );
    changes = mergeChanges(
      changes,
      {
        packageVolume: (i, v) => ({
          ...i,
          value: v,
        }),
        autoCalculatePackageVolume: (i, v) => ({
          ...i,
          auto: v,
        }),
      },
      'packageVolume',
      batch.packageVolume
    );
  }

  return changes;
}