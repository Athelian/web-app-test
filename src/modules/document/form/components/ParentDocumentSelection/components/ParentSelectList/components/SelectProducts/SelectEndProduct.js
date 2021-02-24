// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { ProductProvider } from 'generated/graphql';
import GridView from 'components/GridView';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { CancelButton } from 'components/Buttons';
import { ProductProviderCard } from 'components/Cards';

type Props = {
  onCancel: () => void,
  onSelect: (selectedEndProduct: ?ProductProvider) => void,
  productProviders: Array<ProductProvider>,
};

function SelectEndProduct({ onCancel, onSelect, productProviders }: Props) {
  const [selectedProductProvider, setSelectedProductProvider] = React.useState(null);

  const onSelectProductProvider = React.useCallback(
    (productProvider: ProductProvider) => {
      setSelectedProductProvider(productProvider);
      onSelect(productProvider);
    },
    [onSelect]
  );

  return (
    <SlideViewLayout>
      <SlideViewNavBar>
        <EntityIcon icon="PRODUCT_PROVIDER" color="PRODUCT_PROVIDER" />
        <CancelButton
          onClick={() => {
            setSelectedProductProvider(null);
            onCancel();
          }}
        />
      </SlideViewNavBar>

      <Content>
        <GridView
          items={productProviders}
          hasMore={false}
          isLoading={false}
          isEmpty={productProviders.length === 0}
          onLoadMore={() => {}}
          emptyMessage={
            <FormattedMessage id="modules.Milestones.noFound" defaultMessage="No milestone found" />
          }
          itemWidth="195px"
        >
          {productProviders.map(productProvider => {
            return (
              <ProductProviderCard
                key={productProvider.id}
                productProvider={productProvider}
                selectable
                selected={selectedProductProvider?.id === productProvider.id}
                onSelect={onSelectProductProvider}
              />
            );
          })}
        </GridView>
      </Content>
    </SlideViewLayout>
  );
}

export default SelectEndProduct;
