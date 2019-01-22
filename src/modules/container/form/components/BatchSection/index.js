// @flow
// FIXME: same with shipment/form/components/SelectBatches
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { ContainerBatchCard } from 'components/Cards';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import messages from 'modules/shipment/messages';
import ContainerFormContainer from 'modules/container/form/container';
import SelectBatches from 'modules/shipment/form/components/SelectBatches';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import SelectOrderItems from 'providers/SelectOrderItems';
import BatchFormContainer, { calculatePackageQuantity } from 'modules/batch/form/container';

import {
  ItemsSectionWrapperStyle,
  ItemsSectionBodyStyle,
  ItemGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  intl: IntlShape,
};

function BatchSection({ intl }: Props) {
  return (
    <div className={ItemsSectionWrapperStyle}>
      <SectionNavBar>
        <BooleanValue>
          {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
            <>
              <NewButton
                data-testid="selectBatchesButton"
                label={intl.formatMessage(messages.selectBatches)}
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
                label={intl.formatMessage(messages.newBatch)}
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
                  </Subscribe>
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      </SectionNavBar>
      <div className={ItemsSectionBodyStyle}>
        <Subscribe to={[ContainerFormContainer]}>
          {({ state: { batches = [] }, setFieldValue, setDeepFieldValue }) =>
            batches.length === 0 ? (
              <div className={EmptyMessageStyle}>
                <FormattedMessage
                  id="modules.container.noBatches"
                  defaultMessage="No batches found"
                />
              </div>
            ) : (
              <div className={ItemGridStyle}>
                {batches.map((item, position) => (
                  <BooleanValue key={item.id}>
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
                                  batch={item}
                                  isNew={!!item.isNew}
                                  orderItem={item.orderItem}
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
                            position={position}
                            batch={item}
                            saveOnBlur={updatedBatch => {
                              setDeepFieldValue(`batches.${position}`, updatedBatch);
                            }}
                            onClick={() => batchSlideToggle(true)}
                            onClear={({ id }) => {
                              setFieldValue(
                                'batches',
                                batches.filter(({ id: itemId }) => id !== itemId)
                              );
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
            )
          }
        </Subscribe>
      </div>
    </div>
  );
}

export default injectIntl(BatchSection);
