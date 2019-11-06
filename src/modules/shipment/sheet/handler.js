// @flow
import ApolloClient from 'apollo-client';
import { filterAsync, mapAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import type {
  EntityEvent,
  EntityEventChange,
  EntityEventHandler,
} from 'components/Sheet/SheetLive/types';
import { mergeChanges, newCustomValue } from 'components/Sheet/SheetLive/helper';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import {
  batchQuantityRevisionByIDQuery,
  organizationByIDQuery,
  userByIDQuery,
  containerByIDQuery,
  warehouseByIDQuery,
} from './query';
import { organizationsByIDsQuery, tagsByIDsQuery, usersByIDsQuery } from '../../order/sheet/query';

// $FlowFixMe not compatible with hook implementation
function onCreateContainerFactory(client: ApolloClient, dispatch: Action => void) {
  return (containerId: string) =>
    client
      .query({
        query: containerByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: containerId,
        },
      })
      .then(({ data }) => {
        const newContainer = data?.container;
        if (newContainer?.__typename !== 'Container') {
          return;
        }

        dispatch({
          type: Actions.PRE_ADD_ENTITY,
          payload: {
            entity: {
              id: containerId,
              type: 'Container',
            },
            callback: (shipments: Array<Object>) => {
              const shipmentId = newContainer.shipment?.id;
              if (!shipmentId) {
                return null;
              }

              const shipmentIdx = shipments.findIndex(shipment => shipment.id === shipmentId);
              if (shipmentIdx === -1) {
                return null;
              }

              const containers = [...shipments[shipmentIdx].containers];
              containers.splice(newContainer.sort, 0, newContainer);

              return {
                item: {
                  ...shipments[shipmentIdx],
                  containers,
                },
                index: shipmentIdx,
              };
            },
          },
        });
      });
}

// $FlowFixMe not compatible with hook implementation
function onBatchQuantityRevisionFactory(client: ApolloClient, dispatch: Action => void) {
  return (batchQuantityRevisionId: string, items: Array<Object>) =>
    client
      .query({
        query: batchQuantityRevisionByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: batchQuantityRevisionId,
        },
      })
      .then(({ data }) => {
        const batchQuantityRevision = data?.batchQuantityRevision;
        if (batchQuantityRevision?.__typename !== 'BatchQuantityRevision') {
          return;
        }

        items.every((shipment, shipmentIdx) => {
          const done = !shipment.batchesWithoutContainer.every((batch, batchIdx) => {
            if (batch.id !== batchQuantityRevision.batch?.id) {
              return true;
            }

            const batches = [...shipment.batchesWithoutContainer];

            let found = false;
            const batchQuantityRevisions = batch.batchQuantityRevisions
              .filter(bqr => !!bqr.id)
              .map(bqr => {
                if (bqr.id === batchQuantityRevision.id) {
                  found = true;
                  return batchQuantityRevision;
                }

                return bqr;
              });

            if (!found) {
              batchQuantityRevisions.splice(batchQuantityRevision.sort, 0, batchQuantityRevision);
            }

            batches[batchIdx] = {
              ...batch,
              batchQuantityRevisions,
            };

            dispatch({
              type: Actions.REPLACE_ITEM,
              payload: {
                item: {
                  ...shipment,
                  batchesWithoutContainer: batches,
                },
                index: shipmentIdx,
              },
            });

            return false;
          });
          if (done) {
            return false;
          }

          return shipment.containers.every((container, containerIdx) =>
            container.batches.every((batch, batchIdx) => {
              if (batch.id !== batchQuantityRevision.batch?.id) {
                return true;
              }

              const containers = [...shipment.containers];
              const batches = [...container.batches];

              let found = false;
              const batchQuantityRevisions = batch.batchQuantityRevisions
                .filter(bqr => !!bqr.id)
                .map(bqr => {
                  if (bqr.id === batchQuantityRevision.id) {
                    found = true;
                    return batchQuantityRevision;
                  }

                  return bqr;
                });

              if (!found) {
                batchQuantityRevisions.splice(batchQuantityRevision.sort, 0, batchQuantityRevision);
              }

              batches[batchIdx] = {
                ...batch,
                batchQuantityRevisions,
              };
              containers[containerIdx] = {
                ...container,
                batches,
              };

              dispatch({
                type: Actions.REPLACE_ITEM,
                payload: {
                  item: {
                    ...shipment,
                    containers,
                  },
                  index: shipmentIdx,
                },
              });

              return false;
            })
          );
        });
      });
}

function onDeleteContainerFactory(dispatch: Action => void) {
  return (containerId: string) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: containerId,
          type: 'Container',
        },
        callback: (shipments: Array<Object>) => {
          const shipmentIdx = shipments.findIndex(
            shipment => !!shipment.containers.find(container => container.id === containerId)
          );
          if (shipmentIdx === -1) {
            return null;
          }

          return {
            item: {
              ...shipments[shipmentIdx],
              containers: shipments[shipmentIdx].containers.filter(
                container => container.id !== containerId
              ),
            },
            index: shipmentIdx,
          };
        },
      },
    });
  };
}

function onDeleteBatchQuantityRevisionFactory(dispatch: Action => void) {
  return (batchQuantityRevisionId: string, items: Array<Object>) =>
    items.every((shipment, shipmentIdx) => {
      const done = !shipment.batchesWithoutContainer.every((batch, batchIdx) => {
        if (batch.id !== batchQuantityRevisionId) {
          return true;
        }

        const batches = [...shipment.batchesWithoutContainer];
        batches[batchIdx] = {
          ...batch,
          batchQuantityRevisions: batch.batchQuantityRevisions.filter(
            bqr => bqr.id !== batchQuantityRevisionId
          ),
        };

        dispatch({
          type: Actions.REPLACE_ITEM,
          payload: {
            item: {
              ...shipment,
              batchesWithoutContainer: batches,
            },
            index: shipmentIdx,
          },
        });

        return false;
      });
      if (done) {
        return false;
      }

      return shipment.containers.every((container, containerIdx) =>
        container.batches.every((batch, batchIdx) => {
          if (batch.id !== batchQuantityRevisionId) {
            return true;
          }

          const containers = [...shipment.containers];
          const batches = [...container.batches];
          batches[batchIdx] = {
            ...batch,
            batchQuantityRevisions: batch.batchQuantityRevisions.filter(
              bqr => bqr.id !== batchQuantityRevisionId
            ),
          };
          containers[containerIdx] = {
            ...container,
            batches,
          };

          dispatch({
            type: Actions.REPLACE_ITEM,
            payload: {
              item: {
                ...shipment,
                containers,
              },
              index: shipmentIdx,
            },
          });

          return false;
        })
      );
    });
}

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const onCreateContainer = onCreateContainerFactory(client, dispatch);
  const onBatchQuantityRevision = onBatchQuantityRevisionFactory(client, dispatch);
  const onDeleteContainer = onDeleteContainerFactory(dispatch);
  const onDeleteBatchQuantityRevision = onDeleteBatchQuantityRevisionFactory(dispatch);

  return async (event: EntityEvent, shipments: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'Container': {
            await onCreateContainer(event.entity.id);
            break;
          }
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, shipments);
            break;
          }
          default:
            break;
        }
        break;
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          case 'Shipment': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'importer':
                case 'exporter':
                  if (change.new?.entity) {
                    return client
                      .query({
                        query: organizationByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: change.field,
                        new: newCustomValue(data.organization),
                      }));
                  }
                  break;
                case 'forwarders':
                  return client
                    .query({
                      query: organizationsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.organizationsByIDs),
                    }));
                case 'transportType':
                  return {
                    ...change,
                    new: {
                      string: change.new?.int === 1 ? 'Air' : 'Sea',
                      __typename: 'StringValue',
                    },
                  };
                case 'inCharges':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
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
            break;
          }
          case 'TimelineDate': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'approvedBy':
                  return client
                    .query({
                      query: userByIDQuery,
                      variables: { id: change.new?.entity?.id },
                    })
                    .then(({ data }) => ({
                      field: 'approvedBy',
                      new: newCustomValue(data.user),
                    }));
                case 'assignedTo':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });

            const shipment = shipments.find(s => {
              if (
                s.cargoReady.id === event.entity?.id ||
                s.containerGroups[0].customClearance.id === event.entity?.id ||
                s.containerGroups[0].warehouseArrival.id === event.entity?.id ||
                s.containerGroups[0].deliveryReady.id === event.entity?.id
              ) {
                return true;
              }

              return !!s.voyages.find(
                voyage =>
                  voyage.departure.id === event.entity?.id || voyage.arrival.id === event.entity?.id
              );
            });

            if (shipment) {
              const timelineDate = (() => {
                if (shipment.cargoReady?.id === event.entity?.id) {
                  return shipment.cargoReady;
                }
                if (shipment.containerGroups[0].customClearance.id === event.entity?.id) {
                  return shipment.containerGroups[0].customClearance;
                }
                if (shipment.containerGroups[0].warehouseArrival.id === event.entity?.id) {
                  return shipment.containerGroups[0].warehouseArrival;
                }
                if (shipment.containerGroups[0].deliveryReady.id === event.entity?.id) {
                  return shipment.containerGroups[0].deliveryReady;
                }

                const voyage = shipment.voyages.find(
                  v => v.departure.id === event.entity?.id || v.arrival.id === event.entity?.id
                );

                if (voyage.departure.id === event.entity?.id) {
                  return voyage.departure;
                }

                return voyage.arrival;
              })();

              changes = mergeChanges(
                changes,
                {
                  approvedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  approvedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'approved',
                timelineDate.approved
              );
            }

            break;
          }
          case 'Voyage':
            changes = changes.map(change => {
              switch (change.field) {
                case 'departurePort':
                case 'arrivalPort': {
                  return {
                    ...change,
                    new: {
                      custom: {
                        seaport: change.new?.string,
                        airport: change.new?.string,
                      },
                      __typename: 'CustomValue',
                    },
                  };
                }
                default:
                  return change;
              }
            });
            break;
          case 'ContainerGroup':
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'warehouse':
                  if (change.new?.entity) {
                    return client
                      .query({
                        query: warehouseByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: 'warehouse',
                        new: newCustomValue(data.warehouse),
                      }));
                  }
                  break;
                default:
                  break;
              }

              return change;
            });
            break;
          case 'Container': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'warehouseArrivalAgreedDateApprovedBy':
                case 'warehouseArrivalActualDateApprovedBy':
                case 'departureDateApprovedBy':
                  return client
                    .query({
                      query: userByIDQuery,
                      variables: { id: change.new?.entity?.id },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.user),
                    }));
                case 'warehouseArrivalAgreedDateAssignedTo':
                case 'warehouseArrivalActualDateAssignedTo':
                case 'departureDateAssignedTo':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
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

            const container = shipments
              .map(shipment => shipment.containers)
              // $FlowFixMe flat not supported by flow
              .flat()
              .find(c => c.id === event.entity?.id);

            if (container) {
              changes = mergeChanges(
                changes,
                {
                  freeTimeStartDate: (i, v) => ({
                    ...i,
                    value: v,
                  }),
                  autoCalculatedFreeTimeStartDate: (i, v) => ({
                    ...i,
                    auto: v,
                  }),
                },
                'freeTimeStartDate',
                container.freeTimeStartDate
              );
              changes = mergeChanges(
                changes,
                {
                  warehouseArrivalAgreedDateApprovedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  warehouseArrivalAgreedDateApprovedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'warehouseArrivalAgreedDateApproved',
                container.warehouseArrivalAgreedDateApproved
              );
              changes = mergeChanges(
                changes,
                {
                  warehouseArrivalActualDateApprovedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  warehouseArrivalActualDateApprovedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'warehouseArrivalActualDateApproved',
                container.warehouseArrivalActualDateApproved
              );
              changes = mergeChanges(
                changes,
                {
                  departureDateApprovedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  departureDateApprovedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'departureDateApproved',
                container.departureDateApproved
              );
            }

            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'warehouse':
                  if (change.new?.entity) {
                    return client
                      .query({
                        query: warehouseByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: 'warehouse',
                        new: newCustomValue(data.warehouse),
                      }));
                  }
                  break;
                default:
                  break;
              }

              return change;
            });
            break;
          }
          case 'Batch': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'orderItem':
                  // TODO: handle replace order item
                  return false;
                case 'container':
                case 'shipment':
                  // TODO: handle move batch
                  return false;
                default:
                  return true;
              }
            });

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

            const batch = shipments
              .map(shipment => [
                ...shipment.batchesWithoutContainer,
                ...shipment.containers.map(c => c.batches).flat(),
              ])
              .flat()
              .find(b => b.id === event.entity.id);
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

            break;
          }
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, shipments);
            return;
          }
          default:
            break;
        }

        if (changes.length > 0) {
          dispatch({
            type: Actions.CHANGE_VALUES,
            payload: {
              changes: changes.map(change => {
                return defaultEntityEventChangeTransformer(event, change);
              }),
            },
          });
        }
        break;
      }
      case 'Delete':
        switch (event.entity.__typename) {
          case 'Container':
            onDeleteContainer(event.entity.id);
            break;
          case 'BatchQuantityRevision':
            onDeleteBatchQuantityRevision(event.entity.id, shipments);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
}
