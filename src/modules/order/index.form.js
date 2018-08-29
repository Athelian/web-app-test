// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import { SaveButton, CancelButton } from 'components/NavButtons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import SlideView from 'components/SlideView';
import JumpToSection from 'components/JumpToSection';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import OrderForm from './form';
import OrderFormProvider, { OrderFormConsumer } from './form/provider';
import SectionNavigation from './form/components/SectionNavigation';
import LogsButton from './form/components/LogsButton';
import query from './form/query';
import {
  createOrderMutation,
  prepareCreateOrderInput,
  updateOrderMutation,
  prepareUpdateOrderInput,
} from './form/mutation';

type Props = {
  orderId?: string,
};

const defaultProps = {
  orderId: '',
};

class OrderFormContainer extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate(`/order`);
  };

  onSave = (formData: Object, saveOrder: Function) => {
    const { orderId } = this.props;

    const isNew = orderId === 'new';
    const input = isNew ? prepareCreateOrderInput(formData) : prepareUpdateOrderInput(formData);

    if (isNew) {
      saveOrder({ variables: { input } });
    } else if (orderId) {
      saveOrder({ variables: { input, id: decodeId(orderId) } });
    }
  };

  onMutationCompleted = (result: Object, onFinish: Function) => {
    const { orderId } = this.props;
    const isNew = orderId === 'new';
    onFinish();
    if (isNew) {
      const {
        createDeepOrder: { id },
      } = result;
      navigate(`/order/${encodeId(id)}`);
    }
  };

  render() {
    const { orderId } = this.props;
    const isNew = orderId === 'new';
    let mutationKey = {};
    if (orderId && !isNew) {
      mutationKey = { key: decodeId(orderId) };
    }

    return (
      <Provider>
        <OrderFormProvider>
          <OrderFormConsumer>
            {({ formData, isReady, isDirty, onChange, onFinish }) => (
              <UIConsumer>
                {uiState => (
                  <Mutation
                    mutation={isNew ? createOrderMutation : updateOrderMutation}
                    onCompleted={result => this.onMutationCompleted(result, onFinish)}
                    {...mutationKey}
                  >
                    {(saveOrder, { loading: isLoading, error: apiError }) => (
                      <Layout
                        {...uiState}
                        navBar={
                          <NavBar>
                            <EntityIcon icon="ORDER" color="ORDER" />
                            <JumpToSection>
                              <SectionNavigation link="orderSection" label="ORDER" icon="ORDER" />
                              <SectionNavigation
                                link="itemsSection"
                                label="ITEMS"
                                icon="ORDER_ITEM"
                              />
                              <SectionNavigation
                                link="documentsSection"
                                label="DOCUMENTS"
                                icon="DOCUMENT"
                              />
                              <SectionNavigation
                                link="shipmentsSection"
                                label="SHIPMENTS"
                                icon="SHIPMENT"
                              />
                            </JumpToSection>
                            <BooleanValue>
                              {({ value: opened, toggle }) => (
                                <React.Fragment>
                                  {!isNew && <LogsButton onClick={toggle} />}
                                  <SlideView
                                    isOpen={opened}
                                    onRequestClose={toggle}
                                    options={{ width: '1030px' }}
                                  >
                                    <div style={{ padding: '50px', textAlign: 'center' }}>
                                      <h1>Logs</h1>
                                    </div>
                                  </SlideView>
                                </React.Fragment>
                              )}
                            </BooleanValue>

                            {(isNew || isDirty({ items: [], files: [] })) && (
                              <React.Fragment>
                                <CancelButton disabled={false} onClick={this.onCancel}>
                                  Cancel
                                </CancelButton>
                                <SaveButton
                                  disabled={!isReady}
                                  onClick={() => this.onSave(formData, saveOrder)}
                                >
                                  Save
                                </SaveButton>
                              </React.Fragment>
                            )}
                          </NavBar>
                        }
                      >
                        {isLoading && <LoadingIcon />}
                        {apiError && <p>Error: Please try again.</p>}
                        {isNew || !orderId ? (
                          <OrderForm order={{}} onChange={onChange} />
                        ) : (
                          <Query
                            query={query}
                            variables={{ id: decodeId(orderId) }}
                            fetchPolicy="network-only"
                          >
                            {({ loading, data, error }) => {
                              if (error) {
                                return error.message;
                              }

                              if (loading) return <LoadingIcon />;
                              return (
                                <OrderForm
                                  onChange={onChange}
                                  order={getByPathWithDefault({}, 'order', data)}
                                />
                              );
                            }}
                          </Query>
                        )}
                      </Layout>
                    )}
                  </Mutation>
                )}
              </UIConsumer>
            )}
          </OrderFormConsumer>
        </OrderFormProvider>
      </Provider>
    );
  }
}

export default OrderFormContainer;
