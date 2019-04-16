// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { QueryForm } from 'components/common';
import { UIConsumer } from 'modules/ui';
import { FormContainer, resetFormState } from 'modules/form';
import Timeline from 'modules/timeline/components/Timeline';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import { orderExportQuery, orderTimelineQuery } from './query';
import OrderForm from './form';
import validator from './form/validator';
import {
  OrderItemsContainer,
  OrderInfoContainer,
  OrderTagsContainer,
  OrderFilesContainer,
  OrderTasksContainer,
} from './form/containers';
import { orderFormQuery } from './form/query';
import { createOrderMutation, updateOrderMutation, prepareParsedOrderInput } from './form/mutation';

type OptionalProps = {
  path: string,
  isSlideView: boolean,
  redirectAfterSuccess: boolean,
  onSuccessCallback: ?Function,
  onCancel?: Function,
};

type Props = OptionalProps & {
  orderId?: string,
};

const defaultProps = {
  path: '',
  orderId: '',
  isSlideView: false,
  onSuccessCallback: null,
  redirectAfterSuccess: true,
};

type OrderFormState = {
  orderInfoState: Object,
  orderItemState: Object,
  orderTagsState: Object,
  orderFilesState: Object,
  orderTasksState: Object,
};

class OrderFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  onCancel = () => navigate('/order');

  onReset = ({
    orderInfoState,
    orderItemState,
    orderTagsState,
    orderFilesState,
    orderTasksState,
    form,
  }: OrderFormState & { form: Object }) => {
    resetFormState(orderInfoState);
    resetFormState(orderItemState, 'orderItems');
    resetFormState(orderTagsState, 'tags');
    resetFormState(orderFilesState, 'files');
    resetFormState(orderTasksState, 'todo');
    form.onReset();
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveOrder: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { orderId, onSuccessCallback } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = prepareParsedOrderInput(
      isNewOrClone ? null : removeTypename(originalValues),
      removeTypename(formData)
    );

    if (isNewOrClone) {
      const { data } = await saveOrder({ variables: { input } });
      const {
        orderCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }
    } else if (orderId) {
      const { data } = await saveOrder({ variables: { input, id: decodeId(orderId) } });
      const {
        orderUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }
    }
  };

  onFormReady = ({
    orderItemState,
    orderInfoState,
    orderTagsState,
    orderFilesState,
    orderTasksState,
  }: {
    orderItemState: Object,
    orderInfoState: Object,
    orderTagsState: Object,
    orderFilesState: Object,
    orderTasksState: Object,
  }) => (order: Object) => {
    const { orderItems, tags, files, todo, ...info } = order;
    const { currency } = info;
    orderInfoState.initDetailValues({ currency });
    if (this.isClone()) {
      const { issuedAt, poNo, ...cloneInfo } = info;
      orderInfoState.initDetailValues({
        ...cloneInfo,
        shipments: [],
        poNo: `[cloned] ${poNo}`,
      });
      orderItemState.initDetailValues(orderItems.map(item => ({ ...item, batches: [] })));
      orderFilesState.initDetailValues([]);
    } else {
      orderItemState.initDetailValues(orderItems);
      orderInfoState.initDetailValues(info);
      orderFilesState.initDetailValues(files);
      orderTasksState.initDetailValues(todo);
    }
    orderTagsState.initDetailValues(tags);
  };

  onMutationCompleted = ({
    orderItemState,
    orderInfoState,
    orderTagsState,
    orderFilesState,
    orderTasksState,
  }: {
    orderItemState: Object,
    orderInfoState: Object,
    orderTagsState: Object,
    orderFilesState: Object,
    orderTasksState: Object,
  }) => (result: Object) => {
    const { redirectAfterSuccess } = this.props;
    if (!result) {
      toast.error('There was an error. Please try again later');
      return;
    }

    if (this.isNewOrClone()) {
      const { orderCreate } = result;
      if (redirectAfterSuccess) {
        navigate(`/order/${encodeId(orderCreate.id)}`);
      }
    } else {
      const { orderUpdate } = result;
      this.onFormReady({
        orderItemState,
        orderInfoState,
        orderTagsState,
        orderFilesState,
        orderTasksState,
      })(orderUpdate);
    }
  };

  render() {
    const { orderId, isSlideView, onCancel } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (orderId && !isNewOrClone) {
      mutationKey = { key: decodeId(orderId) };
    }
    const updateOrder = updateOrderMutation;
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;
    return (
      <UIConsumer>
        {uiState => (
          <Subscribe
            to={[
              OrderItemsContainer,
              OrderInfoContainer,
              OrderTagsContainer,
              OrderFilesContainer,
              OrderTasksContainer,
              FormContainer,
            ]}
          >
            {(
              orderItemState,
              orderInfoState,
              orderTagsState,
              orderFilesState,
              orderTasksState,
              form
            ) => (
              <Mutation
                mutation={isNewOrClone ? createOrderMutation : updateOrder}
                onCompleted={this.onMutationCompleted({
                  orderItemState,
                  orderInfoState,
                  orderTagsState,
                  orderFilesState,
                  orderTasksState,
                })}
                {...mutationKey}
              >
                {(saveOrder, { loading: isLoading, error: apiError }) => (
                  <Layout
                    {...(isSlideView ? {} : uiState)}
                    navBar={
                      <CurrentNavBar>
                        <EntityIcon icon="ORDER" color="ORDER" />
                        <JumpToSection>
                          <SectionTabs
                            link="order_orderSection"
                            label={
                              <FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />
                            }
                            icon="ORDER"
                          />
                          <SectionTabs
                            link="order_itemsSection"
                            label={
                              <FormattedMessage id="modules.Orders.items" defaultMessage="ITEMS" />
                            }
                            icon="ORDER_ITEM"
                          />
                          <SectionTabs
                            link="order_documentsSection"
                            label={
                              <FormattedMessage
                                id="modules.Orders.documents"
                                defaultMessage="DOCUMENTS"
                              />
                            }
                            icon="DOCUMENT"
                          />
                          <SectionTabs
                            link="order_taskSection"
                            label={
                              <FormattedMessage id="modules.Orders.task" defaultMessage="TASK" />
                            }
                            icon="TASK"
                          />
                          <SectionTabs
                            link="order_shipmentsSection"
                            label={
                              <FormattedMessage
                                id="modules.Orders.shipments"
                                defaultMessage="SHIPMENTS"
                              />
                            }
                            icon="SHIPMENT"
                          />
                          <SectionTabs
                            link="order_containersSection"
                            label={
                              <FormattedMessage
                                id="modules.Orders.containers"
                                defaultMessage="CONTAINERS"
                              />
                            }
                            icon="CONTAINER"
                          />
                        </JumpToSection>
                        <BooleanValue>
                          {({ value: opened, set: slideToggle }) =>
                            !isNewOrClone && (
                              <>
                                <LogsButton onClick={() => slideToggle(true)} />
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => slideToggle(false)}
                                >
                                  <Layout
                                    navBar={
                                      <SlideViewNavBar>
                                        <EntityIcon icon="LOGS" color="LOGS" />
                                      </SlideViewNavBar>
                                    }
                                  >
                                    {orderId && opened ? (
                                      <Timeline
                                        query={orderTimelineQuery}
                                        queryField="order"
                                        variables={{
                                          id: decodeId(orderId),
                                        }}
                                        entity={{
                                          orderId: decodeId(orderId),
                                        }}
                                      />
                                    ) : null}
                                  </Layout>
                                </SlideView>
                              </>
                            )
                          }
                        </BooleanValue>
                        <>
                          {(isNewOrClone ||
                            orderItemState.isDirty() ||
                            orderInfoState.isDirty() ||
                            orderTagsState.isDirty() ||
                            orderFilesState.isDirty() ||
                            orderTasksState.isDirty()) && (
                            <>
                              {this.isNewOrClone() ? (
                                <CancelButton
                                  onClick={() => (onCancel ? onCancel() : this.onCancel())}
                                />
                              ) : (
                                <ResetButton
                                  onClick={() =>
                                    this.onReset({
                                      orderItemState,
                                      orderInfoState,
                                      orderTagsState,
                                      orderFilesState,
                                      orderTasksState,
                                      form,
                                    })
                                  }
                                />
                              )}

                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    {
                                      ...orderItemState.state,
                                      ...orderInfoState.state,
                                      ...orderTagsState.state,
                                      ...orderFilesState.state,
                                      ...orderTasksState.state,
                                    },
                                    validator
                                  )
                                }
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...orderItemState.originalValues,
                                      ...orderInfoState.originalValues,
                                      ...orderTagsState.originalValues,
                                      ...orderFilesState.originalValues,
                                      ...orderTasksState.originalValues,
                                    },
                                    {
                                      ...orderItemState.state,
                                      ...orderInfoState.state,
                                      ...orderTagsState.state,
                                      ...orderFilesState.state,
                                      ...orderTasksState.state,
                                    },
                                    saveOrder,
                                    () => {
                                      orderItemState.onSuccess();
                                      orderInfoState.onSuccess();
                                      orderTagsState.onSuccess();
                                      orderFilesState.onSuccess();
                                      orderTasksState.onSuccess();
                                      form.onReset();
                                    },
                                    form.onErrors
                                  )
                                }
                              />
                            </>
                          )}
                          {orderId &&
                            !isNewOrClone &&
                            !orderItemState.isDirty() &&
                            !orderInfoState.isDirty() &&
                            !orderTagsState.isDirty() &&
                            !orderFilesState.isDirty() &&
                            !orderTasksState.isDirty() && (
                              <ExportButton
                                type="Order"
                                exportQuery={orderExportQuery}
                                variables={{ id: decodeId(orderId) }}
                              />
                            )}
                        </>
                      </CurrentNavBar>
                    }
                  >
                    {apiError && <p>Error: Please try again.</p>}
                    {this.isNew() || !orderId ? (
                      <OrderForm isNew />
                    ) : (
                      <QueryForm
                        query={orderFormQuery}
                        entityId={orderId}
                        entityType="order"
                        render={order => (
                          <OrderForm
                            order={order}
                            isClone={this.isClone()}
                            onFormReady={() => {
                              this.onFormReady({
                                orderItemState,
                                orderInfoState,
                                orderTagsState,
                                orderFilesState,
                                orderTasksState,
                              })(order);
                            }}
                          />
                        )}
                      />
                    )}
                  </Layout>
                )}
              </Mutation>
            )}
          </Subscribe>
        )}
      </UIConsumer>
    );
  }
}

export default OrderFormModule;
