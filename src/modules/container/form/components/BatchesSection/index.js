// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectUid } from 'utils/id';
import { isNullOrUndefined } from 'utils/fp';
import { calculatePackageQuantity } from 'utils/batch';
import { CONTAINER_UPDATE } from 'modules/permission/constants/container';
import usePermission from 'hooks/usePermission';
import { SectionNavBar } from 'components/NavBar';
import { ContainerBatchCard } from 'components/Cards';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import ContainerFormContainer from 'modules/container/form/container';
import SelectBatches from 'modules/shipment/form/components/SelectBatches';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import SelectOrderItems from 'providers/SelectOrderItems';
import BatchFormContainer from 'modules/batch/form/container';
import {
  BatchesSectionWrapperStyle,
  BatchesSectionBodyStyle,
  BatchesGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';

function BatchesSection() {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(CONTAINER_UPDATE);

  return (
    <div className={BatchesSectionWrapperStyle}>
      <SectionNavBar>
        {allowUpdate && (
          <>
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
                      <Subscribe to={[ContainerFormContainer]}>
                        {({ state: { batches }, setFieldValue }) => (
                          <SelectBatches
                            selectedBatches={batches}
                            onSelect={selected => {
                              const selectedBatches = selected.map(selectedBatch => ({
                                ...selectedBatch,
                                packageQuantity: calculatePackageQuantity(selectedBatch),
                              }));
                              if (batches.length === 0 && selectedBatches.length > 0) {
                                setFieldValue('representativeBatch', selectedBatches[0]);
                              }
                              setFieldValue('batches', [...batches, ...selectedBatches]);

                              selectBatchesSlideToggle(false);
                            }}
                            onCancel={() => selectBatchesSlideToggle(false)}
                          />
                        )}
                      </Subscribe>
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
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
                      <Subscribe to={[ContainerFormContainer]}>
                        {({ state: { batches }, setFieldValue }) => (
                          <SelectOrderItems
                            onSelect={selectedOrderItems => {
                              const newBatches = selectedOrderItems.map((orderItem, counter) => {
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
                              if (batches.length === 0 && newBatches.length > 0) {
                                setFieldValue('representativeBatch', newBatches[0]);
                              }
                              setFieldValue('batches', [...batches, ...newBatches]);
                              createBatchesSlideToggle(false);
                            }}
                            onCancel={() => createBatchesSlideToggle(false)}
                          />
                        )}
                      </Subscribe>
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          </>
        )}
      </SectionNavBar>
      <div className={BatchesSectionBodyStyle}>
        <Subscribe to={[ContainerFormContainer]}>
          {({ state: { batches = [], representativeBatch }, setFieldValue, setDeepFieldValue }) => {
            if (batches.length === 0) {
              return (
                <div className={EmptyMessageStyle}>
                  <FormattedMessage
                    id="modules.container.noBatches"
                    defaultMessage="No batches found"
                  />
                </div>
              );
            }

            if (isNullOrUndefined(representativeBatch)) {
              setDeepFieldValue('representativeBatch', batches[0]);
            }

            return (
              <div className={BatchesGridStyle}>
                {batches.map((batch, position) => (
                  <BooleanValue key={batch.id}>
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
                                    setDeepFieldValue(`batches.${position}`, updatedBatch);
                                  }}
                                />
                              )}
                            </Subscribe>
                          )}
                        </SlideView>
                        <div className={ItemStyle}>
                          <ContainerBatchCard
                            readOnly={!allowUpdate}
                            position={position}
                            batch={batch}
                            saveOnBlur={updatedBatch => {
                              setDeepFieldValue(`batches.${position}`, updatedBatch);
                            }}
                            isRepresented={
                              !isNullOrUndefined(representativeBatch) &&
                              representativeBatch.id === batch.id
                            }
                            onClickRepresentative={() =>
                              setDeepFieldValue(`representativeBatch`, batch)
                            }
                            onClick={() => batchSlideToggle(true)}
                            onClear={({ id }) => {
                              const newBatches = batches.filter(
                                ({ id: batchId }) => id !== batchId
                              );
                              setFieldValue('batches', newBatches);
                              if (id === representativeBatch.id) {
                                if (newBatches.length > 0) {
                                  setDeepFieldValue('representativeBatch', newBatches[0]);
                                } else {
                                  setDeepFieldValue('representativeBatch', null);
                                }
                              }
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
                        </div>
                      </>
                    )}
                  </BooleanValue>
                ))}
              </div>
            );
          }}
        </Subscribe>
      </div>
    </div>
  );
}

export default BatchesSection;
