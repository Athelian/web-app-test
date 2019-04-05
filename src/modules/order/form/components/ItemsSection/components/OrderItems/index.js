// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue, ArrayValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import scrollIntoView from 'utils/scrollIntoView';
import { ORDER_UPDATE, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/order';
import { getBatchByFillBatch, generateBatchItem } from 'modules/order/helpers';
import SlideView from 'components/SlideView';
import { OrderItemCard, OrderBatchCard } from 'components/Cards';
import { NewButton, BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import { generateBatchForClone } from 'utils/batch';
import {
  ItemGridStyle,
  ItemStyle,
  BatchAreaStyle,
  BatchAreaHeaderStyle,
  TitleWrapperStyle,
  TitleStyle,
  IconStyle,
  BatchGridStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  selected: Array<string>,
  orderItems: Array<Object>,
  currency: string,
  arrayHelpers: {
    push: Function,
    set: Function,
  },
  onClone: Function,
  onRemove: Function,
  onSave: Function,
};

const OrderItems = ({
  selected,
  orderItems,
  currency,
  arrayHelpers: { push, set },
  onClone,
  onRemove,
  onSave,
}: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(ORDER_UPDATE);
  return orderItems.length > 0 ? (
    <div className={ItemGridStyle}>
      {orderItems.map((item, index) => (
        <div id={`orderItem_${item.id}`} className={ItemStyle} key={item.id}>
          <OrderItemCard
            viewPrice={hasPermission(ORDER_ITEMS_GET_PRICE)}
            readOnly={!allowUpdate}
            item={item}
            currency={currency}
            saveOnBlur={newValue => onSave(index, newValue)}
            selected={selected.includes(item.id)}
            onClick={() => {
              scrollIntoView({
                targetId: `orderItem_${item.id}`,
                boundaryId: 'orderItemsSection',
              });
              if (!selected.includes(item.id)) {
                push(item.id);
              } else {
                set(selected.filter(selectedId => selectedId !== item.id));
              }
            }}
            onClone={onClone}
            onRemove={onRemove}
          />

          {selected.includes(item.id) &&
            (item.batches && (
              <ArrayValue value={item.batches} onChange={batches => onSave(index, { batches })}>
                {({ value: batches, push: addNewBatch, splice: changeBatch, filter }) => (
                  <div className={BatchAreaStyle}>
                    <div className={BatchAreaHeaderStyle}>
                      <div className={TitleWrapperStyle}>
                        <div className={IconStyle}>
                          <Icon icon="BATCH" />
                        </div>
                        <div className={TitleStyle}>BATCHES ({batches.length})</div>
                      </div>
                      {allowUpdate && (
                        <>
                          <NewButton
                            label={
                              <FormattedMessage
                                id="modules.Orders.newBatch"
                                defaultMessage="NEW BATCH"
                              />
                            }
                            onClick={() => addNewBatch(generateBatchItem(item, batches))}
                          />
                          <BaseButton
                            label={
                              <FormattedMessage
                                id="modules.Orders.autoFillBatch"
                                defaultMessage="AUTOFILL BATCH"
                              />
                            }
                            onClick={() => {
                              const newBatch = getBatchByFillBatch(item);
                              if (newBatch) {
                                addNewBatch(newBatch);
                              }
                            }}
                          />
                        </>
                      )}
                    </div>

                    <div className={BatchGridStyle}>
                      {batches.map((batch, position) => (
                        <BooleanValue key={batch.id}>
                          {({ value: opened, set: slideToggle }) => (
                            <>
                              <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                                {opened && (
                                  <BatchFormWrapper
                                    batch={batch}
                                    onSave={value => {
                                      slideToggle(false);
                                      changeBatch(position, 1, value);
                                    }}
                                  />
                                )}
                              </SlideView>
                              <OrderBatchCard
                                readOnly={!allowUpdate}
                                batch={batch}
                                currency={currency}
                                price={item.price}
                                onClick={() => slideToggle(true)}
                                saveOnBlur={updatedBatch => {
                                  changeBatch(position, 1, updatedBatch);
                                }}
                                onRemove={() => filter(({ id }) => id !== batch.id)}
                                onClone={value => {
                                  changeBatch(batches.length, 1, generateBatchForClone(value));
                                }}
                              />
                            </>
                          )}
                        </BooleanValue>
                      ))}
                    </div>
                  </div>
                )}
              </ArrayValue>
            ))}
        </div>
      ))}
    </div>
  ) : (
    <div className={EmptyMessageStyle}>
      <FormattedMessage
        id="modules.Orders.form.noItems"
        defaultMessage="No items found (needs Exporter to be chosen first as well)"
      />
    </div>
  );
};

export default OrderItems;
