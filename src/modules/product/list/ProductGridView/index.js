// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { ProductCard } from 'components/Cards';
import ProductActivateDialog from 'modules/product/common/ProductActivateDialog';
import ProductArchiveDialog from 'modules/product/common/ProductArchiveDialog';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
  <BooleanValue key={item.id}>
    {({ value: statusDialogIsOpen, set: dialogToggle }) => (
      <>
        {item.archived ? (
          <ProductActivateDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            product={item}
          />
        ) : (
          <ProductArchiveDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            product={item}
          />
        )}
        <ProductCard product={item} onArchive={() => dialogToggle(true)} />
      </>
    )}
  </BooleanValue>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const ProductGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.product.noProductFound" defaultMessage="No products found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

ProductGridView.defaultProps = defaultProps;

export default ProductGridView;
