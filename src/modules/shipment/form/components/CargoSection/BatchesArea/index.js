// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
  SHIPMENT_REMOVE_BATCH_IN_CONTAINER,
  SHIPMENT_ADD_BATCH_IN_CONTAINER,
} from 'modules/permission/constants/shipment';
import {
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
} from 'modules/permission/constants/batch';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { calculatePackageQuantity } from 'utils/batch';
import { injectUid } from 'utils/id';
import { ShipmentBatchCard } from 'components/Cards';
import { NewButton, MoveButton, CancelButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import BatchFormContainer from 'modules/batch/form/container';
import SelectOrderItems from 'providers/SelectOrderItems';
import { getBatchesInPool } from 'modules/shipment/helpers';
import SelectBatches from 'modules/shipment/form/components/SelectBatches';
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
  isSelectedBatchesPool: boolean,
  isSelectBatchesMode: boolean,
  setIsSelectBatchesMode: Function,
  selectedBatches: Array<Object>,
  setSelectedBatches: Function,
};

function BatchesArea({
  isSelectedBatchesPool,
  isSelectBatchesMode,
  setIsSelectBatchesMode,
  selectedBatches,
  setSelectedBatches,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  return (
    <Subscribe to={[ShipmentBatchesContainer, ShipmentContainersContainer]}>
      {(
        { state: { batches }, setFieldValue, setFieldArrayValue },
        { state: { containers }, setFieldValue: setContainersState }
      ) => {
        const usefulBatches = isSelectedBatchesPool ? getBatchesInPool(batches) : [...batches];
        return (
          <div className={BatchesWrapperStyle}>
            <div className={BatchesNavbarWrapperStyle} />
            <div className={BatchesBodyWrapperStyle}>
              {usefulBatches.length === 0 ? (
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
                        {isSelectedBatchesPool ? (
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
                        (<FormattedNumber value={usefulBatches.length} />)
                      </div>
                    </div>

                    {isSelectedBatchesPool &&
                      hasPermission([SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH_IN_CONTAINER]) &&
                      usefulBatches.length > 0 &&
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
                                      <FormattedNumber value={selectedBatches.length} />
                                    ),
                                  }}
                                />
                                <div className={SubTitleIconStyle}>
                                  <Icon icon="BATCH" />
                                </div>
                              </div>
                              <CancelButton onClick={() => setIsSelectBatchesMode(false)} />
                            </>
                          ) : (
                            <MoveButton
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.moveBatches"
                                  defaultMessage="MOVE BATCHES"
                                />
                              }
                              onClick={() => setIsSelectBatchesMode(true)}
                            />
                          )}
                        </>
                      )}
                  </div>

                  <div className={BatchesGridStyle}>
                    {usefulBatches.map((batch, position) => (
                      <React.Fragment key={batch.id}>
                        {isSelectBatchesMode ? (
                          <ShipmentBatchCard
                            batch={batch}
                            selectable
                            selected={selectedBatches.includes(batch)}
                            onSelect={() => setSelectedBatches(batch)}
                          />
                        ) : (
                          <BooleanValue>
                            {({ value: opened, set: batchSlideToggle }) => (
                              <>
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => batchSlideToggle(false)}
                                  options={{ width: '1030px' }}
                                >
                                  {opened && (
                                    <Subscribe to={[BatchFormContainer]}>
                                      {({ initDetailValues }) => (
                                        <BatchFormWrapper
                                          initDetailValues={initDetailValues}
                                          batch={batch}
                                          isNew={!!batch.isNew}
                                          orderItem={batch.orderItem}
                                          onCancel={() => batchSlideToggle(false)}
                                          onSave={updatedBatch => {
                                            batchSlideToggle(false);
                                            setFieldArrayValue(position, updatedBatch);
                                          }}
                                        />
                                      )}
                                    </Subscribe>
                                  )}
                                </SlideView>

                                <ShipmentBatchCard
                                  editable={{
                                    // TODO: change all shipment_update to batch update
                                    no: hasPermission([SHIPMENT_UPDATE, BATCH_SET_NO]),
                                    quantity: hasPermission([SHIPMENT_UPDATE, BATCH_SET_QUANTITY]),
                                    deliveredAt: hasPermission([
                                      SHIPMENT_UPDATE,
                                      BATCH_SET_DELIVERY_DATE,
                                    ]),
                                    desiredAt: hasPermission([
                                      SHIPMENT_UPDATE,
                                      BATCH_SET_DESIRED_DATE,
                                    ]),
                                    // TODO: if has container SHIPMENT_REMOVE_BATCH_IN_CONTAINER else SHIPMENT_REMOVE_BATCH
                                    deleteBatch: hasPermission([
                                      SHIPMENT_UPDATE,
                                      SHIPMENT_REMOVE_BATCH_IN_CONTAINER,
                                    ]),
                                    // TODO: (if has container SHIPMENT_ADD_BATCH_IN_CONTAINER else SHIPMENT_ADD_BATCH) && batch.create
                                    cloneBatch: hasPermission([
                                      SHIPMENT_UPDATE,
                                      SHIPMENT_ADD_BATCH_IN_CONTAINER,
                                    ]),
                                    viewOrder: hasPermission([ORDER_FORM]),
                                    // TODO: add for product icon product_form
                                    // TODO: add for container icon container_form
                                  }}
                                  batch={batch}
                                  saveOnBlur={updateBatch => {
                                    const indexOfAllBatches = batches.indexOf(batch);
                                    setFieldArrayValue(indexOfAllBatches, updateBatch);
                                  }}
                                  onClick={() => batchSlideToggle(true)}
                                  onClear={({ id }) => {
                                    setFieldValue(
                                      'batches',
                                      batches.filter(({ id: batchId }) => id !== batchId)
                                    );
                                    const newContainers = containers.map(container => {
                                      const {
                                        batches: containerBatches,
                                        representativeBatch,
                                        ...rest
                                      } = container;

                                      const newContainerBatches = containerBatches.filter(
                                        ({ id: batchId }) => id !== batchId
                                      );

                                      const newRepresentativeBatch =
                                        representativeBatch && representativeBatch.id === id
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
                                  onClone={({
                                    id,
                                    deliveredAt,
                                    desired,
                                    expiredAt,
                                    producedAt,
                                    no,
                                    ...rest
                                  }) => {
                                    setFieldValue('batches', [
                                      ...batches,
                                      injectUid({
                                        ...rest,
                                        isNew: true,
                                        batchAdjustments: [],
                                        no: `${no}- clone`,
                                      }),
                                    ]);
                                  }}
                                />
                              </>
                            )}
                          </BooleanValue>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className={BatchesFooterWrapperStyle}>
              {/* TODO: remove the full wrap */}
              {!isSelectBatchesMode && hasPermission([SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH]) && (
                <>
                  {/* TODO: (shipment_update || shipment_add_batch) && batch list */}
                  <BooleanValue>
                    {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
                      <>
                        <NewButton
                          data-testid="selectBatchesButton"
                          label={
                            <FormattedMessage
                              id="modules.Shipments.selectBatches"
                              defaultMessage="SELECT BATCHES"
                            />
                          }
                          onClick={() => selectBatchesSlideToggle(true)}
                        />
                        <SlideView
                          isOpen={selectBatchesIsOpen}
                          onRequestClose={() => selectBatchesSlideToggle(false)}
                          options={{ width: '1030px' }}
                        >
                          {selectBatchesIsOpen && (
                            <SelectBatches
                              selectedBatches={batches}
                              onSelect={selected => {
                                const newSelectBatches = selected.map(selectedBatch => ({
                                  ...selectedBatch,
                                  packageQuantity: calculatePackageQuantity(selectedBatch),
                                }));
                                setFieldValue('batches', [...batches, ...newSelectBatches]);
                                selectBatchesSlideToggle(false);
                              }}
                              onCancel={() => selectBatchesSlideToggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                  {/* TODO: (shipment_update || shipment_add_batch) && batch create && items list */}
                  <BooleanValue>
                    {({ value: createBatchesIsOpen, set: createBatchesSlideToggle }) => (
                      <>
                        <NewButton
                          label={
                            <FormattedMessage
                              id="modules.Shipments.newBatch"
                              defaultMessage="NEW BATCH"
                            />
                          }
                          onClick={() => createBatchesSlideToggle(true)}
                        />
                        <SlideView
                          isOpen={createBatchesIsOpen}
                          onRequestClose={() => createBatchesSlideToggle(false)}
                          options={{ width: '1030px' }}
                        >
                          {createBatchesIsOpen && (
                            <SelectOrderItems
                              onSelect={selectedOrderItems => {
                                const result = selectedOrderItems.map((orderItem, counter) => {
                                  const {
                                    productProvider: {
                                      packageName,
                                      packageCapacity,
                                      packageGrossWeight,
                                      packageVolume,
                                      packageSize,
                                    },
                                  } = orderItem;
                                  return injectUid({
                                    orderItem,
                                    tags: [],
                                    packageName,
                                    packageCapacity,
                                    packageGrossWeight,
                                    packageVolume,
                                    packageSize,
                                    quantity: 0,
                                    isNew: true,
                                    batchAdjustments: [],
                                    no: `batch no ${batches.length + counter + 1}`,
                                    autoCalculatePackageQuantity: true,
                                  });
                                });
                                setFieldValue('batches', [...batches, ...result]);
                                createBatchesSlideToggle(false);
                              }}
                              onCancel={() => createBatchesSlideToggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                </>
              )}
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default BatchesArea;
