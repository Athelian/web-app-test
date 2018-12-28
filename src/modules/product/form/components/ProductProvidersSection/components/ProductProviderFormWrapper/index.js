// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import validator from 'modules/productProvider/form/validator';
import ProductProviderForm from 'modules/productProvider/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { contains, getByPathWithDefault } from 'utils/fp';

type OptionalProps = {
  isAddedProvider: boolean,
};

type Props = OptionalProps & {
  productProviders: Array<Object>,
  productProvider: Object,
  isNew: boolean,
  initDetailValues: Function,
  onSave: Function,
  onCancel: Function,
};

const defaultProps = {
  isAddedProvider: false,
};

const formContainer = new FormContainer();

function isExist(
  productProvider: Object,
  productProviders: Array<Object>,
  isAddedProvider: boolean
): boolean {
  const provider = {
    exporter: getByPathWithDefault(0, 'exporter.id', productProvider),
    supplier: getByPathWithDefault(0, 'supplier.id', productProvider),
  };
  const providers = isAddedProvider
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

  return contains(provider, providers);
}

class ProductProviderFormWrapper extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { productProvider, initDetailValues } = this.props;
    initDetailValues(productProvider);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  handleCancel = (state: Object) => {
    const { isNew, onCancel } = this.props;
    if (isNew) {
      onCancel();
    } else {
      resetFormState(state);
    }
  };

  render() {
    const { isNew, onSave, productProviders, isAddedProvider } = this.props;

    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[ProductProviderContainer]}>
          {formState => (
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
                    <SectionTabs
                      link="documentsSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.documents"
                          defaultMessage="DOCUMENTS"
                        />
                      }
                      icon="DOCUMENT"
                    />
                  </JumpToSection>
                  <CancelButton onClick={() => this.handleCancel(formState)} />
                  <SaveButton
                    disabled={
                      !formState.isDirty() ||
                      !formContainer.isReady(formState.state, validator) ||
                      isExist(formState.state, productProviders, isAddedProvider)
                    }
                    onClick={() => onSave(formState.state)}
                    data-testid="saveProviderButton"
                  />
                </SlideViewNavBar>
              }
            >
              <ProductProviderForm
                productProvider={formState.state}
                isExist={isExist(formState.state, productProviders, isAddedProvider)}
                isNew={isNew}
              />
            </Layout>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default ProductProviderFormWrapper;
