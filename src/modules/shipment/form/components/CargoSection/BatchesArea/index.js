// @flow
import * as React from 'react';
import type { BatchPayload } from 'generated/graphql';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { maxBy, intersection } from 'lodash';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { getByPath, getByPathWithDefault, isEquals } from 'utils/fp';
import useSortAndFilter from 'hooks/useSortAndFilter';
import messages from 'modules/batch/messages';
import FilterToolBar from 'components/common/FilterToolBar';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { Tooltip } from 'components/Tooltip';
import {
  CONTAINER_FORM,
  CONTAINER_UPDATE,
  CONTAINER_BATCHES_ADD,
  CONTAINER_BATCHES_REMOVE,
} from 'modules/permission/constants/container';
import {
  SHIPMENT_SET,
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
  SHIPMENT_REMOVE_BATCH,
} from 'modules/permission/constants/shipment';
import {
  BATCH_LIST,
  BATCH_CREATE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_UPDATE,
  BATCH_TASK_LIST,
} from 'modules/permission/constants/batch';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_LIST, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  calculatePackageQuantity,
  generateCloneBatch,
  generateBatchByOrderItem,
} from 'utils/batch';
import { ShipmentBatchCard } from 'components/Cards';
import { NewButton, MoveButton, CancelButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';
import {
  ShipmentInfoContainer,
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import useUser from 'hooks/useUser';
import SelectOrderItems from 'providers/SelectOrderItems';
import { getBatchesInPool, getBatchesByContainerId } from 'modules/shipment/helpers';
import SelectShipmentBatches from 'components/SelectShipmentBatches';
import { HIDE, NAVIGABLE } from 'modules/batch/constants';
import { initDatetimeToContainer } from 'utils/date';
import sortBy from './helper';
import {
  BatchesWrapperStyle,
  BatchesNavbarWrapperStyle,
  BatchesBodyWrapperStyle,
  BatchesHeaderWrapperStyle,
  TitleWrapperStyle,
  SubTitleWrapperStyle,
  SubTitleIconStyle,
  IconStyle,
  TitleStyle,
  BatchesGridStyle,
  EmptyMessageStyle,
  BatchesFooterWrapperStyle,
} from './style';

type Props = {
  exporterId: string,
  intl: IntlShape,
  isFocusedBatchesPool: boolean,
  isSelectBatchesMode: boolean,
  onChangeSelectMode: Function,
  focusedContainerIndex: number,
  selectedBatches: Array<BatchPayload>,
  onSelectBatch: Function,
  shipmentIsArchived: boolean,
  importerId: string,
};

const getInitFilter = () => {
  const state = {
    filter: {
      query: '',
    },
    sort: {
      field: 'sort',
      direction: 'ASCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};

function BatchesArea({
  isFocusedBatchesPool,
  isSelectBatchesMode,
  onChangeSelectMode,
  focusedContainerIndex,
  selectedBatches,
  onSelectBatch,
  shipmentIsArchived,
  exporterId,
  importerId,
  intl,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { user } = useUser();
  const sortFields = [
    { title: intl.formatMessage(messages.sort), value: 'sort' },
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.batchNo), value: 'no' },
    { title: intl.formatMessage(messages.poNo), value: 'poNo' },
    { title: intl.formatMessage(messages.productName), value: 'productName' },
    { title: intl.formatMessage(messages.productSerial), value: 'productSerial' },
    { title: intl.formatMessage(messages.deliveredAt), value: 'deliveredAt' },
    { title: intl.formatMessage(messages.expiredAt), value: 'expiredAt' },
    { title: intl.formatMessage(messages.producedAt), value: 'producedAt' },
  ];
  const { filterAndSort, onChangeFilter } = useSortAndFilter(getInitFilter());
  const lastFilterAndSort = React.useRef({
    ...filterAndSort.sort,
    ...filterAndSort.filter,
  });
  const lastBatchIds = React.useRef([]);
  const lastBatchInputIds = React.useRef([]);
  const lastFocusedContainerIndex = React.useRef(focusedContainerIndex);
  return (
    <Subscribe to={[ShipmentInfoContainer, ShipmentBatchesContainer, ShipmentContainersContainer]}>
      {(
        { state: shipmentInfo },
        {
          state: { batches },
          setFieldValue,
          setFieldArrayValue,
          addExistingBatches,
          removeExistingBatches,
        },
        { state: { containers }, setFieldValue: setContainersState, setDeepFieldValue }
      ) => {
        const isFocusedContainer = focusedContainerIndex >= 0;
        let representativeBatchId = null;
        const containerId = isFocusedContainer
          ? getByPath(`${focusedContainerIndex}.id`, containers)
          : null;
        const batchesSelector = isFocusedBatchesPool
          ? getBatchesInPool(batches)
          : getBatchesByContainerId(batches, containerId);

        const currentBatches = [];

        if (
          !isEquals(lastFilterAndSort.current, {
            ...filterAndSort.sort,
            ...filterAndSort.filter,
          }) ||
          (batchesSelector.length > 0 &&
            lastBatchIds.current &&
            lastBatchIds.current.length === 0) ||
          lastFocusedContainerIndex.current !== focusedContainerIndex
        ) {
          lastFocusedContainerIndex.current = focusedContainerIndex;
          lastFilterAndSort.current = {
            ...filterAndSort.sort,
            ...filterAndSort.filter,
          };
          const filterBatches = sortBy(batchesSelector, {
            ...filterAndSort.sort,
            ...filterAndSort.filter,
          });
          lastBatchIds.current = filterBatches.map(item => getByPath('id', item));
          lastBatchInputIds.current = batchesSelector.map(item => getByPath('id', item));
          currentBatches.push(...filterBatches);
        } else {
          lastBatchIds.current.forEach(batchId => {
            const findBatch = batchesSelector.find(item => getByPath('id', item) === batchId);
            if (findBatch) {
              currentBatches.push(findBatch);
            }
          });
          batchesSelector.forEach(batch => {
            if (!lastBatchInputIds.current.includes(getByPath('id', batch))) {
              currentBatches.push(batch);
            }
          });
        }

        const selectedBatchIds = intersection(
          currentBatches.map(item => getByPath('id', item)),
          selectedBatches.map(item => getByPath('id', item))
        );

        if (selectedBatches.length !== 0 && selectedBatchIds.length === 0) {
          onChangeSelectMode(false);
        }

        if (isFocusedContainer) {
          const container = containers[focusedContainerIndex];
          representativeBatchId = getByPath(`representativeBatch.id`, container);
        }

        const allowMoveBatches =
          hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE]) ||
          (hasPermission(CONTAINER_BATCHES_ADD) && isFocusedContainer
            ? hasPermission(CONTAINER_BATCHES_REMOVE)
            : true);

        const allowSelectBatches =
          hasPermission(BATCH_LIST) &&
          (hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE]) ||
            (hasPermission(SHIPMENT_ADD_BATCH) && isFocusedContainer
              ? hasPermission(CONTAINER_BATCHES_ADD)
              : true));

        const allowNewBatches =
          hasPermission(BATCH_CREATE) &&
          hasPermission(ORDER_ITEMS_LIST) &&
          (hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE]) ||
            (hasPermission(SHIPMENT_ADD_BATCH) && isFocusedContainer
              ? hasPermission(CONTAINER_BATCHES_ADD)
              : true));

        return (
          <div className={BatchesWrapperStyle}>
            <div className={BatchesNavbarWrapperStyle}>
              <FilterToolBar
                canSort
                canSearch
                sortFields={sortFields}
                filtersAndSort={filterAndSort}
                onChange={onChangeFilter}
              />
            </div>
            <div className={BatchesBodyWrapperStyle}>
              {currentBatches.length === 0 ? (
                <div className={EmptyMessageStyle}>
                  <FormattedMessage
                    id="modules.Shipments.noBatches"
                    defaultMessage="No batches found"
                  />
                </div>
              ) : (
                <>
                  <div className={BatchesHeaderWrapperStyle}>
                    <div className={TitleWrapperStyle}>
                      <div className={IconStyle}>
                        <Icon icon="BATCH" />
                      </div>
                      <div className={TitleStyle}>
                        {isFocusedBatchesPool || isFocusedContainer ? (
                          <FormattedMessage
                            id="modules.Shipments.batches"
                            defaultMessage="BATCHES"
                          />
                        ) : (
                          <FormattedMessage
                            id="modules.Shipments.allBatches"
                            defaultMessage="ALL BATCHES"
                          />
                        )}{' '}
                        (<FormattedNumber value={currentBatches.length} />)
                      </div>
                    </div>

                    {(isFocusedBatchesPool || isFocusedContainer) &&
                      allowMoveBatches &&
                      currentBatches.length > 0 &&
                      containers.length > 0 && (
                        <>
                          {isSelectBatchesMode ? (
                            <>
                              <div className={SubTitleWrapperStyle}>
                                <FormattedMessage
                                  id="modules.Shipments.selected"
                                  defaultMessage="SELECTED {numOfBatches}"
                                  values={{
                                    numOfBatches: (
                                      <FormattedNumber value={selectedBatchIds.length} />
                                    ),
                                  }}
                                />
                                <div className={SubTitleIconStyle}>
                                  <Icon icon="BATCH" />
                                </div>
                              </div>
                              <CancelButton onClick={() => onChangeSelectMode(false)} />
                            </>
                          ) : (
                            <MoveButton
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.moveBatches"
                                  defaultMessage="MOVE BATCHES"
                                />
                              }
                              onClick={() => onChangeSelectMode(true)}
                            />
                          )}
                        </>
                      )}
                  </div>

                  <div className={BatchesGridStyle}>
                    {currentBatches.map(batch => {
                      const allowRemoveBatch = getByPath('container', batch)
                        ? hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE]) ||
                          (hasPermission(CONTAINER_BATCHES_REMOVE) &&
                            hasPermission(SHIPMENT_REMOVE_BATCH))
                        : hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE, SHIPMENT_REMOVE_BATCH]);

                      const allowCloneBatch = getByPath('container', batch)
                        ? hasPermission(BATCH_CREATE) &&
                          hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE, CONTAINER_BATCHES_ADD])
                        : hasPermission(BATCH_CREATE) &&
                          hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH]);

                      return (
                        <React.Fragment key={getByPath('id', batch)}>
                          {isSelectBatchesMode ? (
                            <ShipmentBatchCard
                              batch={{ ...batch, shipment: { ...batch.shipment, ...shipmentInfo } }}
                              isRepresented={
                                isFocusedBatchesPool ||
                                (!isFocusedBatchesPool && !isFocusedContainer)
                                  ? null
                                  : getByPath('id', batch) === representativeBatchId
                              }
                              selectable
                              selected={selectedBatchIds.includes(getByPath('id', batch))}
                              onSelect={() => (allowMoveBatches ? onSelectBatch(batch) : () => {})}
                              viewable={{
                                price: hasPermission(ORDER_ITEMS_GET_PRICE),
                                tasks: hasPermission(BATCH_TASK_LIST),
                              }}
                            />
                          ) : (
                            <BooleanValue>
                              {({ value: opened, set: batchSlideToggle }) => (
                                <>
                                  <SlideView
                                    isOpen={opened}
                                    onRequestClose={() => batchSlideToggle(false)}
                                    shouldConfirm={() => {
                                      const button = document.getElementById(
                                        'batch_form_save_button'
                                      );
                                      return button;
                                    }}
                                  >
                                    {opened && (
                                      <BatchFormInSlide
                                        isNew={!batch.updatedAt}
                                        batch={{
                                          ...batch,
                                          shipment: { ...batch.shipment, ...shipmentInfo },
                                        }}
                                        onSave={value => {
                                          batchSlideToggle(false);

                                          const indexOfAllBatches = batches.indexOf(batch);
                                          setFieldArrayValue(indexOfAllBatches, value);
                                          if (batch.container) {
                                            const indexOfContainer = containers.findIndex(
                                              container =>
                                                container.id === getByPath('container.id', batch)
                                            );
                                            if (indexOfContainer >= 0) {
                                              const indexOfBatch = containers[
                                                indexOfContainer
                                              ].batches.findIndex(
                                                containersBatch =>
                                                  containersBatch.id === getByPath('id', batch)
                                              );
                                              if (indexOfBatch >= 0) {
                                                setDeepFieldValue(
                                                  `containers.${indexOfContainer}.batches.${indexOfBatch}`,
                                                  value
                                                );
                                              }
                                            }
                                          }
                                        }}
                                        itemConfig={NAVIGABLE}
                                        shipmentConfig={HIDE}
                                        containerConfig={HIDE}
                                        orderConfig={NAVIGABLE}
                                      />
                                    )}
                                  </SlideView>

                                  <ShipmentBatchCard
                                    editable={{
                                      no: hasPermission([BATCH_UPDATE, BATCH_SET_NO]),
                                      quantity: hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY]),
                                      deliveredAt: hasPermission([
                                        BATCH_UPDATE,
                                        BATCH_SET_DELIVERY_DATE,
                                      ]),
                                      desiredAt: hasPermission([
                                        BATCH_UPDATE,
                                        BATCH_SET_DESIRED_DATE,
                                      ]),
                                      removeBatch: allowRemoveBatch,
                                      cloneBatch: allowCloneBatch,
                                      representativeBatch: hasPermission([
                                        CONTAINER_UPDATE,
                                        CONTAINER_BATCHES_ADD,
                                        CONTAINER_BATCHES_REMOVE,
                                      ]),
                                    }}
                                    viewable={{
                                      price: hasPermission(ORDER_ITEMS_GET_PRICE),
                                      tasks: hasPermission(BATCH_TASK_LIST),
                                    }}
                                    navigable={{
                                      order: hasPermission(ORDER_FORM),
                                      product: hasPermission(PRODUCT_FORM),
                                      container: hasPermission(CONTAINER_FORM),
                                    }}
                                    batch={{
                                      ...batch,
                                      shipment: { ...batch.shipment, ...shipmentInfo },
                                    }}
                                    isRepresented={
                                      isFocusedBatchesPool ||
                                      (!isFocusedBatchesPool && !isFocusedContainer)
                                        ? null
                                        : getByPath('id', batch) === representativeBatchId
                                    }
                                    saveOnBlur={updatedBatch => {
                                      const indexOfAllBatches = batches.indexOf(batch);
                                      setFieldArrayValue(indexOfAllBatches, updatedBatch);
                                      if (batch.container) {
                                        const indexOfContainer = containers.findIndex(
                                          container =>
                                            container.id === getByPath('container.id', batch)
                                        );
                                        if (indexOfContainer >= 0) {
                                          const indexOfBatch = containers[
                                            indexOfContainer
                                          ].batches.findIndex(
                                            containersBatch =>
                                              containersBatch.id === getByPath('id', batch)
                                          );
                                          if (indexOfBatch >= 0) {
                                            setDeepFieldValue(
                                              `containers.${indexOfContainer}.batches.${indexOfBatch}`,
                                              updatedBatch
                                            );
                                          }
                                        }
                                      }
                                    }}
                                    onClick={() => batchSlideToggle(true)}
                                    onClear={clearedBatch => {
                                      setFieldValue(
                                        'batches',
                                        batches.filter(
                                          ({ id: batchId }) => batchId !== clearedBatch.id
                                        )
                                      );

                                      removeExistingBatches([clearedBatch]);

                                      const newContainers = containers.map(container => {
                                        const {
                                          batches: containerBatches,
                                          representativeBatch,
                                          ...rest
                                        } = container;

                                        const newContainerBatches = containerBatches.filter(
                                          ({ id: batchId }) => batchId !== clearedBatch.id
                                        );

                                        const newRepresentativeBatch =
                                          representativeBatch &&
                                          representativeBatch.id === clearedBatch.id
                                            ? newContainerBatches[0]
                                            : representativeBatch;

                                        return {
                                          ...rest,
                                          batches: newContainerBatches,
                                          representativeBatch: newRepresentativeBatch,
                                        };
                                      });
                                      setContainersState('containers', newContainers);
                                    }}
                                    onClickRepresentative={() =>
                                      isFocusedContainer
                                        ? setDeepFieldValue(
                                            `containers.${focusedContainerIndex}.representativeBatch`,
                                            batch
                                          )
                                        : () => {}
                                    }
                                    onClone={value => {
                                      const newBatch = generateCloneBatch(value, hasPermission);

                                      setFieldValue('batches', [...batches, newBatch]);

                                      if (value.container) {
                                        const index = containers.findIndex(
                                          container => container.id === value.container.id
                                        );
                                        setDeepFieldValue(`containers.${index}.batches`, [
                                          ...containers[index].batches,
                                          newBatch,
                                        ]);
                                      }
                                    }}
                                  />
                                </>
                              )}
                            </BooleanValue>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className={BatchesFooterWrapperStyle}>
              {!isSelectBatchesMode && (
                <>
                  {allowSelectBatches && (
                    <BooleanValue>
                      {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
                        <>
                          {importerId.length === 0 ? (
                            <Tooltip
                              message={
                                <FormattedMessage
                                  id="modules.Shipments.chooseImporterFirst"
                                  defaultMessage="Please choose an Importer first"
                                />
                              }
                            >
                              <div>
                                <NewButton
                                  data-testid="btnSelectBatches"
                                  label={
                                    <FormattedMessage
                                      id="modules.Shipments.selectBatches"
                                      defaultMessage="SELECT BATCHES"
                                    />
                                  }
                                  disabled
                                  onClick={() => selectBatchesSlideToggle(true)}
                                />
                              </div>
                            </Tooltip>
                          ) : (
                            <NewButton
                              data-testid="btnSelectBatches"
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.selectBatches"
                                  defaultMessage="SELECT BATCHES"
                                />
                              }
                              onClick={() => selectBatchesSlideToggle(true)}
                            />
                          )}

                          <SlideView
                            isOpen={selectBatchesIsOpen}
                            onRequestClose={() => selectBatchesSlideToggle(false)}
                          >
                            {selectBatchesIsOpen && (
                              <SelectShipmentBatches
                                filter={{
                                  orderImporterIds: importerId ? [importerId] : null,
                                  orderExporterIds: exporterId ? [exporterId] : null,
                                }}
                                selectedBatches={batches}
                                onSelect={selected => {
                                  const maxSort =
                                    getByPathWithDefault(
                                      0,
                                      'shipmentSort',
                                      maxBy(batches, 'shipmentSort')
                                    ) + 1;
                                  const newSelectBatches = selected.map(
                                    (selectedBatch, counter) => ({
                                      shipmentSort: maxSort + counter,
                                      ...selectedBatch,
                                      ...(isFocusedContainer
                                        ? { container: containers[focusedContainerIndex] }
                                        : {}),
                                      packageQuantity: calculatePackageQuantity(selectedBatch),
                                      ...initDatetimeToContainer(
                                        selectedBatch?.deliveredAt ?? null,
                                        'deliveredAt',
                                        user.timezone
                                      ),
                                      ...initDatetimeToContainer(
                                        selectedBatch?.desiredAt ?? null,
                                        'desiredAt',
                                        user.timezone
                                      ),
                                      ...initDatetimeToContainer(
                                        selectedBatch?.expiredAt ?? null,
                                        'expiredAt',
                                        user.timezone
                                      ),
                                      ...initDatetimeToContainer(
                                        selectedBatch?.producedAt ?? null,
                                        'producedAt',
                                        user.timezone
                                      ),
                                    })
                                  );
                                  if (isFocusedContainer) {
                                    setDeepFieldValue(
                                      `containers.${focusedContainerIndex}.batches`,
                                      [...currentBatches, ...newSelectBatches]
                                    );
                                    if (currentBatches.length === 0) {
                                      setDeepFieldValue(
                                        `containers.${focusedContainerIndex}.representativeBatch`,
                                        newSelectBatches[0]
                                      );
                                    }
                                  }
                                  setFieldValue('batches', [...batches, ...newSelectBatches]);
                                  addExistingBatches(newSelectBatches);

                                  selectBatchesSlideToggle(false);
                                }}
                                onCancel={() => selectBatchesSlideToggle(false)}
                              />
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  )}

                  {allowNewBatches && (
                    <BooleanValue>
                      {({ value: createBatchesIsOpen, set: createBatchesSlideToggle }) => (
                        <>
                          {importerId.length === 0 ? (
                            <Tooltip
                              message={
                                <FormattedMessage
                                  id="modules.Shipments.chooseImporterFirst"
                                  defaultMessage="Please choose an Importer first"
                                />
                              }
                            >
                              <div>
                                <NewButton
                                  label={
                                    <FormattedMessage
                                      id="modules.Shipments.newBatch"
                                      defaultMessage="NEW BATCH"
                                    />
                                  }
                                  disabled
                                  onClick={() => createBatchesSlideToggle(true)}
                                />
                              </div>
                            </Tooltip>
                          ) : (
                            <NewButton
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.newBatch"
                                  defaultMessage="NEW BATCH"
                                />
                              }
                              onClick={() => createBatchesSlideToggle(true)}
                            />
                          )}

                          <SlideView
                            isOpen={createBatchesIsOpen}
                            onRequestClose={() => createBatchesSlideToggle(false)}
                          >
                            {createBatchesIsOpen && (
                              <SelectOrderItems
                                cacheKey="ShipmentSelectOrderItems"
                                filter={{
                                  importerId,
                                  ...(exporterId ? { exporterId } : {}),
                                }}
                                onSelect={selectedOrderItems => {
                                  const maxSort =
                                    getByPathWithDefault(
                                      0,
                                      'shipmentSort',
                                      maxBy(batches, 'shipmentSort')
                                    ) + 1;
                                  const createdBatches: Array<BatchPayload> = selectedOrderItems.map(
                                    (orderItem, index) => ({
                                      ...generateBatchByOrderItem(orderItem),
                                      shipmentSort: maxSort + index,
                                      no: `batch no ${batches.length + index + 1}`,
                                      ...(isFocusedContainer
                                        ? { container: containers[focusedContainerIndex] }
                                        : {}),
                                      archived: orderItem.archived && shipmentIsArchived,
                                    })
                                  );
                                  setFieldValue('batches', [...batches, ...createdBatches]);
                                  if (isFocusedContainer) {
                                    setDeepFieldValue(
                                      `containers.${focusedContainerIndex}.batches`,
                                      [...currentBatches, ...createdBatches]
                                    );
                                    if (currentBatches.length === 0) {
                                      setDeepFieldValue(
                                        `containers.${focusedContainerIndex}.representativeBatch`,
                                        createdBatches[0]
                                      );
                                    }
                                  }
                                  createBatchesSlideToggle(false);
                                }}
                                onCancel={() => createBatchesSlideToggle(false)}
                              />
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  )}
                </>
              )}
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default injectIntl(React.memo<Props>(BatchesArea));
