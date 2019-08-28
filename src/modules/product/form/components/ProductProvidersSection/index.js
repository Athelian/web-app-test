// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { isForbidden } from 'utils/data';
import usePermission from 'hooks/usePermission';
import { SectionNavBar } from 'components/NavBar';
import { ProductProviderCard } from 'components/Cards';
import { BooleanValue, ObjectValue } from 'react-values';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import generateEndProduct from 'utils/product';
import { ProductProvidersContainer } from 'modules/product/form/containers';
import {
  PRODUCT_PROVIDER_FORM,
  PRODUCT_PROVIDER_CREATE,
} from 'modules/permission/constants/product';
import ProductProviderFormWrapper from './components/ProductProviderFormWrapper';
import {
  ProductProviderSectionWrapperStyle,
  ProductProviderSectionBodyStyle,
  ItemGridStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  isOwner: boolean,
  productIsArchived: boolean,
};

function ProductProvidersSection({ isOwner, productIsArchived }: Props) {
  const { hasPermission } = usePermission(isOwner);
  return (
    hasPermission(PRODUCT_PROVIDER_FORM) && (
      <Subscribe to={[ProductProvidersContainer]}>
        {({ state: { productProviders }, setFieldValue, removeArrayItem }) => (
          <div className={ProductProviderSectionWrapperStyle}>
            <SectionNavBar>
              {hasPermission(PRODUCT_PROVIDER_CREATE) && (
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) => (
                    <>
                      <NewButton
                        label={
                          <FormattedMessage
                            id="modules.Products.newProvider"
                            defaultMessage="NEW END PRODUCT"
                          />
                        }
                        onClick={() => slideToggle(true)}
                        data-testid="newProviderButton"
                      />
                      <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                        {opened && (
                          <ProductProviderFormWrapper
                            isAddedProvider
                            productProviders={productProviders}
                            productProvider={{
                              isNew: true,
                              hideLogs: true,
                              ...generateEndProduct(),
                              archived: productIsArchived,
                            }}
                            isNew
                            onCancel={() => slideToggle(false)}
                            onSave={newProvider => {
                              slideToggle(false);
                              setFieldValue(
                                `productProviders.${productProviders.length}`,
                                newProvider
                              );
                            }}
                          />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              )}
            </SectionNavBar>
            <div className={ProductProviderSectionBodyStyle}>
              {productProviders.length === 0 ? (
                <div className={EmptyMessageStyle}>
                  <Icon icon="WARNING" />
                  <FormattedMessage
                    id="modules.Products.noProviderFound"
                    defaultMessage="Please create at least one end product"
                  />
                </div>
              ) : (
                <div className={ItemGridStyle}>
                  {productProviders
                    .filter(item => !isForbidden(item))
                    .map((productProvider, index): React.Node => (
                      <ObjectValue
                        key={productProvider.id}
                        defaultValue={{
                          updateFormOpened: false,
                          cloneFormOpened: false,
                        }}
                      >
                        {({ value: { updateFormOpened, cloneFormOpened }, set: slideToggle }) => (
                          <>
                            <SlideView
                              isOpen={updateFormOpened}
                              onRequestClose={() => slideToggle('updateFormOpened', false)}
                            >
                              {updateFormOpened && (
                                <ProductProviderFormWrapper
                                  isOwner={isOwner}
                                  productProviders={productProviders}
                                  productProvider={productProvider}
                                  onCancel={() => slideToggle('updateFormOpened', false)}
                                  onSave={newProvider => {
                                    slideToggle('updateFormOpened', false);
                                    setFieldValue(`productProviders.${index}`, newProvider);
                                  }}
                                />
                              )}
                            </SlideView>

                            <SlideView
                              isOpen={cloneFormOpened}
                              onRequestClose={() => slideToggle('cloneFormOpened', false)}
                            >
                              {cloneFormOpened && (
                                <ProductProviderFormWrapper
                                  isNew
                                  isOwner={isOwner}
                                  productProviders={productProviders}
                                  productProvider={{
                                    ...productProvider,
                                    referenced: false,
                                    isNew: true,
                                    id: uuid(),
                                  }}
                                  onCancel={() => slideToggle('cloneFormOpened', false)}
                                  onSave={newProvider => {
                                    slideToggle('cloneFormOpened', false);
                                    setFieldValue(
                                      `productProviders.${productProviders.length}`,
                                      newProvider
                                    );
                                  }}
                                />
                              )}
                            </SlideView>

                            <ProductProviderCard
                              showActionsOnHover
                              productProvider={productProvider}
                              onRemove={() => removeArrayItem(index)}
                              onClick={() => slideToggle('updateFormOpened', true)}
                              onClone={() => slideToggle('cloneFormOpened', true)}
                            />
                          </>
                        )}
                      </ObjectValue>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Subscribe>
    )
  );
}

export default ProductProvidersSection;
