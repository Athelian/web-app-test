// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';
import TaskRing from 'components/TaskRing';
import { Display } from 'components/Form';
import DocumentsDeleteDialog from 'components/Dialog/DocumentsDeleteDialog';
import { FullValueTooltip } from 'components/Tooltip';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ProductProviderCardWrapperStyle,
  InfoWrapperStyle,
  NameStyle,
  ExporterStyle,
  SupplierStyle,
  TaskWrapperStyle,
} from './style';

type Props = {|
  onClick: Function,
  onSelect: Function,
  onClone: Function,
  setNeedDeletedFiles: Function,
  unsetNeedDeletedFiles: Function,
  onRemove: Function,
  saveOnBlur: Function,
  selectable: boolean,
  productProvider: Object,
|};

const defaultProps = {
  onClick: () => {},
  onSelect: () => {},
  setNeedDeletedFiles: () => {},
  unsetNeedDeletedFiles: () => {},
  onRemove: () => {},
  onClone: () => {},
  saveOnBlur: () => {},
  selectable: false,
};

const ProductProviderCard = ({
  productProvider,
  onClick,
  setNeedDeletedFiles,
  unsetNeedDeletedFiles,
  onRemove,
  onClone,
  saveOnBlur,
  selectable,
  ...rest
}: Props) => {
  const { archived, name, exporter, supplier, referenced, todo, files } = productProvider;
  const exporterName = exporter?.partner?.name || exporter?.name;
  const supplierName = supplier?.partner?.name || supplier?.name;
  const actions = [];

  if (!selectable) {
    actions.push(
      <CardAction key="btn-clone" icon="CLONE" onClick={() => onClone(productProvider)} />
    );
  }

  if (!referenced) {
    if (files.length > 0) {
      actions.push(
        <BooleanValue>
          {({ value: opened, set: dialogToggle }) => (
            <>
              <DocumentsDeleteDialog
                entityType="END_PRODUCT"
                isOpen={opened}
                files={files}
                onCancel={() => dialogToggle(false)}
                onKeep={needKeepFiles => {
                  unsetNeedDeletedFiles(needKeepFiles);
                  onRemove();
                  dialogToggle(false);
                }}
                onDelete={needDeletedFiles => {
                  setNeedDeletedFiles(needDeletedFiles);
                  onRemove();
                  dialogToggle(false);
                }}
              />

              <CardAction icon="REMOVE" hoverColor="RED" onClick={() => dialogToggle(true)} />
            </>
          )}
        </BooleanValue>
      );
    } else {
      actions.push(
        <CardAction key="btn-remove" icon="REMOVE" hoverColor="RED" onClick={() => onRemove()} />
      );
    }
  }

  return (
    <BaseCard
      icon="PRODUCT_PROVIDER"
      color="PRODUCT_PROVIDER"
      selectable={selectable}
      actions={actions.filter(Boolean)}
      isArchived={archived}
      {...rest}
    >
      <div className={ProductProviderCardWrapperStyle} onClick={onClick} role="presentation">
        <FullValueTooltip message={name}>
          <div className={NameStyle}>
            <Display align="left">{name}</Display>
          </div>
        </FullValueTooltip>

        <div className={InfoWrapperStyle}>
          <div className={ExporterStyle}>
            <Icon icon="EXPORTER" />
            {exporterName && (
              <FullValueTooltip message={exporterName}>
                <span>{exporterName}</span>
              </FullValueTooltip>
            )}
          </div>

          <div className={SupplierStyle}>
            <Icon icon="SUPPLIER" />
            {supplierName && (
              <FullValueTooltip message={supplierName}>
                <span>{supplierName}</span>
              </FullValueTooltip>
            )}
          </div>

          <div className={TaskWrapperStyle}>
            <TaskRing {...todo} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ProductProviderCard.defaultProps = defaultProps;

export default withForbiddenCard(ProductProviderCard, 'productProvider', {
  width: '195px',
  height: '106px',
  entityIcon: 'PRODUCT_PROVIDER',
  entityColor: 'PRODUCT_PROVIDER',
});