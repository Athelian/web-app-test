// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import validator from 'modules/productProvider/form/validator';
import ProductProviderForm from 'modules/productProvider/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { contains, getByPathWithDefault } from 'utils/fp';

type Props = {
  productProviders: Array<Object>,
  productProvider: Object,
  isNew: boolean,
  initDetailValues: Function,
  onSave: Function,
  onCancel: Function,
};

const formContainer = new FormContainer();

function isExist(
  productProvider: Object,
  productProviders: Array<Object>,
  isNew: boolean
): boolean {
  // const { isNew } = productProvider;
  const provider = {
    exporter: getByPathWithDefault(0, 'exporter.id', productProvider),
    supplier: getByPathWithDefault(0, 'supplier.id', productProvider),
  };
  const providers = isNew
    ? productProviders.map(item => ({
        exporter: getByPathWithDefault(0, 'exporter.id', item),
        supplier: getByPathWithDefault(0, 'supplier.id', item),
      }))
    : productProviders
        .filter(item => item.id !== productProvider.id)
        .map(item => ({
          exporter: getByPathWithDefault(0, 'exporter.id', item),
          supplier: getByPathWithDefault(0, 'supplier.id', item),
        }));

  console.log({ provider, providers, isNew, isExist: contains(provider, providers) });
  return contains(provider, providers);
}

class ProductProviderFormWrapper extends React.Component<Props> {
  componentDidMount() {
    const { productProvider, initDetailValues } = this.props;
    initDetailValues(productProvider);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  render() {
    const { isNew, onSave, onCancel, productProviders } = this.props;

    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[ProductProviderContainer]}>
          {({ state, isDirty }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="PROVIDER" color="PROVIDER" />
                  <JumpToSection>
                    <SectionTabs
                      link="productProviderSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.provider"
                          defaultMessage="END PRODUCT"
                        />
                      }
                      icon="PROVIDER"
                    />
                    <SectionTabs
                      link="specificationsSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.specifications"
                          defaultMessage="SPECIFICATIONS"
                        />
                      }
                      icon="SPECIFICATIONS"
                    />
                    <SectionTabs
                      link="productProviderPackagingSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.packaging"
                          defaultMessage="PACKAGING"
                        />
                      }
                      icon="PACKAGING"
                    />
                  </JumpToSection>
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    disabled={
                      !isDirty() ||
                      !formContainer.isReady(state, validator) ||
                      isExist(state, productProviders, isNew)
                    }
                    onClick={() => onSave(state)}
                    data-testid="saveProviderButton"
                  />
                </SlideViewNavBar>
              }
            >
              <ProductProviderForm productProvider={state} isNew={isNew} />
            </Layout>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default ProductProviderFormWrapper;
