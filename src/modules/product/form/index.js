// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import { SectionWrapper, SectionHeader, LastModified, StatusToggle } from 'components/Form';
import { CloneButton } from 'components/Buttons';
import { encodeId } from 'utils/id';
import { isEquals, isDataType } from 'utils/fp';
import { FormContainer } from 'modules/form';
import { ProductSection, ProductProvidersSection } from './components';
import { ProductFormWrapperStyle } from './style';

type OptionalProps = {
  isNewOrClone: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  product: Object,
};

const defaultProps = {
  isNewOrClone: false,
  onFormReady: () => {},
};

class ProductForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { product } = this.props;

    return !isEquals(product, nextProps.product);
  }

  onClone = () => {
    const { product } = this.props;
    navigate(`/product/clone/${encodeId(product.id)}`);
  };

  render() {
    const { product, isNewOrClone } = this.props;
    const { updatedAt, updatedBy, archived } = product;

    return (
      <div className={ProductFormWrapperStyle}>
        <SectionWrapper id="productSection">
          <SectionHeader
            icon="PRODUCT"
            title={<FormattedMessage id="modules.product.product" defaultMessage="PRODUCT" />}
          >
            {!isNewOrClone && (
              <>
                <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
                <BooleanValue>
                  {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                    <StatusToggle
                      archived={archived}
                      openStatusDialog={() => dialogToggle(true)}
                      activateDialog={
                        <ProductActivateDialog
                          product={product}
                          isOpen={statusDialogIsOpen && !!archived}
                          onRequestClose={() => dialogToggle(false)}
                          onConfirm={() => window.location.reload()}
                        />
                      }
                      archiveDialog={
                        <ProductArchiveDialog
                          product={product}
                          isOpen={statusDialogIsOpen && !archived}
                          onRequestClose={() => dialogToggle(false)}
                          onConfirm={() => window.location.reload()}
                        />
                      }
                    />
                  )}
                </BooleanValue>
                <CloneButton onClick={this.onClone} />
              </>
            )}
          </SectionHeader>
          <ProductSection isNew={isNewOrClone} />
        </SectionWrapper>

        <SectionWrapper id="productProvidersSection">
          <SectionHeader
            icon="PROVIDER"
            title={
              <FormattedMessage id="modules.product.providers" defaultMessage="END PRODUCTS" />
            }
          />
          <Subscribe to={[FormContainer]}>
            {({ state: { touched, errors } }) => {
              const errorMessage: ?string | ?Object = errors.productProviders;
              if (errorMessage && touched.productProviders) {
                if (isDataType(Object, errorMessage)) {
                  const [topErrorMessage]: Array<string> = Object.values(errorMessage);
                  return <p>{topErrorMessage}</p>;
                }

                return <p>{errorMessage}</p>;
              }

              return '';
            }}
          </Subscribe>
          <ProductProvidersSection />
        </SectionWrapper>
      </div>
    );
  }
}

export default ProductForm;
