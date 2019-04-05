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
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import { contains, getByPathWithDefault } from 'utils/fp';

type OptionalProps = {
  isAddedProvider: boolean,
  isOwner: boolean,
  isNew: boolean,
};

type Props = OptionalProps & {
  productProviders: Array<Object>,
  productProvider: Object,
  onSave: Function,
  onCancel: Function,
};

const defaultProps = {
  isAddedProvider: false,
  isOwner: true,
  isNew: false,
};

const formContainer = new FormContainer();

const exist = (
  productProvider: Object,
  productProviders: Array<Object>,
  isAddedProvider: boolean
): boolean => {
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
};

const ProductProviderFormWrapper = ({
  isOwner,
  isNew,
  onSave,
  productProviders,
  productProvider,
  isAddedProvider,
  onCancel,
}: Props) => {
  return (
    <Provider inject={[formContainer]}>
      <Subscribe to={[ProductProviderContainer]}>
        {productProviderContainer => {
          const isExist = exist(productProviderContainer.state, productProviders, isAddedProvider);
          return (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="PROVIDER" color="PROVIDER" />
                  <JumpToSection>
                    <SectionTabs
                      link="productProvider_productProviderSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.provider"
                          defaultMessage="END PRODUCT"
                        />
                      }
                      icon="PROVIDER"
                    />
                    <SectionTabs
                      link="productProvider_specificationsSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.specifications"
                          defaultMessage="SPECIFICATIONS"
                        />
                      }
                      icon="SPECIFICATIONS"
                    />
                    <SectionTabs
                      link="productProvider_productProviderPackagingSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.packaging"
                          defaultMessage="PACKAGING"
                        />
                      }
                      icon="PACKAGING"
                    />
                    <SectionTabs
                      link="productProvider_documentsSection"
                      label={
                        <FormattedMessage
                          id="modules.Products.documents"
                          defaultMessage="DOCUMENTS"
                        />
                      }
                      icon="DOCUMENT"
                    />
                  </JumpToSection>

                  {productProviderContainer.isDirty() && (
                    <>
                      {isNew ? (
                        <CancelButton onClick={() => onCancel()} />
                      ) : (
                        <ResetButton
                          onClick={() => {
                            resetFormState(productProviderContainer);
                            formContainer.onReset();
                          }}
                        />
                      )}
                      <SaveButton
                        data-testid="saveProviderButton"
                        disabled={
                          !productProviderContainer.isDirty() ||
                          !formContainer.isReady(productProviderContainer.state, validator) ||
                          isExist
                        }
                        onClick={() => onSave(productProviderContainer.state)}
                      />
                    </>
                  )}
                </SlideViewNavBar>
              }
            >
              <ProductProviderForm
                productProvider={productProvider}
                initDetailValues={productProviderContainer.initDetailValues}
                isExist={isExist}
                isNew={isNew}
                isOwner={isOwner}
              />
            </Layout>
          );
        }}
      </Subscribe>
    </Provider>
  );
};

ProductProviderFormWrapper.defaultProps = defaultProps;

export default ProductProviderFormWrapper;
