// @flow
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ApolloConsumer } from 'react-apollo';
import type { IntlShape } from 'react-intl';
import { FormattedMessage, injectIntl } from 'react-intl';
import { diff } from 'deep-object-diff';
import { HotKeys } from 'react-hotkeys';
import { range, set, isEqual, cloneDeep } from 'lodash';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, PRODUCT, CONTAINER } from 'constants/keywords';
import { usePrevious } from 'modules/form/hooks';
import { UserConsumer } from 'modules/user';
import emitter from 'utils/emitter';
import { trackingError } from 'utils/trackingError';
import { getByPathWithDefault } from 'utils/fp';
import Layout from 'components/Layout';
import SlideView from 'components/SlideView';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import {
  SaveButton,
  CancelButton,
  SelectTemplateButton,
  ExportGenericButton,
} from 'components/Buttons';
import { ToggleInput, Label, Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import logger from 'utils/logger';
import orderValidator from 'modules/order/form/validator';
import batchValidator from 'modules/batch/form/validator';
import shipmentValidator from 'modules/shipment/form/validator';
import productValidator from 'modules/product/form/validator';
import SelectTemplate from 'modules/tableTemplate/common/SelectTemplate';
import {
  orderColumnFields,
  orderItemColumnFields,
  batchColumnFields,
  containerColumnFields,
  shipmentColumnFields,
  productColumnFields,
  orderColumns,
  orderItemColumns,
  batchColumns,
  containerColumns,
  shipmentColumns,
  productColumns,
  allColumnIds,
} from 'modules/tableTemplate/constants';
import QueryForAllCustomFields from 'modules/tableTemplate/common/QueryForAllCustomFields';
import {
  TableRow,
  LineNumber,
  TableHeader,
  TableHeaderForCustomFields,
  TableItem,
  TableEmptyItem,
} from './components';
import TableItemForCustomFields from './components/TableItem/index.customFields';
import { formatOrders } from './formatter';
import { entitiesUpdateManyMutation } from './mutation';
import {
  totalLinePerOrder,
  parseChangedData,
  getOrderItemIdsByOrderId,
  getExportColumns,
  getExportRows,
  setPackageBatchData,
} from './helpers';
import normalize from './normalize';
import {
  EditTableViewWrapperStyle,
  NavbarWrapperStyle,
  HeaderWrapperStyle,
  SidebarWrapperStyle,
  SidebarFadeStyle,
  BodyWrapperStyle,
  LastTemplateUsedStyle,
  TableHeaderClearFixStyle,
} from './style';

type Props = {
  onCancel: () => void,
  allId: {
    orderIds: Array<string>,
    orderItemIds: Array<string>,
    batchIds: Array<string>,
    shipmentIds: Array<string>,
    productIds: Array<string>,
    containerIds: Array<string>,
  },
  targetIds: {
    orderIds: Array<string>,
    orderItemIds: Array<string>,
    batchIds: Array<string>,
    shipmentIds: Array<string>,
  },
  orders: Array<Object>,
  shipments: Array<Object>,
  intl: IntlShape,
};

const keyMap = {
  firstRight: ['command+right', 'ctrl+right'],
  firstLeft: ['command+left', 'ctrl+left'],
  firstTop: ['command+up', 'ctrl+up', 'shift+enter'],
  firstBottom: ['command+down', 'ctrl+down', 'enter'],
  tab: ['tab'],
  reverseTab: ['shift+tab'],
};

const calculatePosition = (position, type) => {
  const [row, column] = position;
  switch (type) {
    default:
      return position;
    case 'tab':
    case 'right':
      return [Number(row), Number(column) + 1];
    case 'reverseTab':
    case 'left':
      return [Number(row), Number(column) - 1];
    case 'top':
      return [Number(row) - 1, column];
    case 'bottom':
      return [Number(row) + 1, column];
    case 'newLine':
      return [Number(row) + 1, 1];
    case 'previousLine':
      return [Number(row) - 1, 1];
  }
};

const focusCell = (position, type) => {
  const [row, column] = calculatePosition(position, type);
  const cell = document.getElementById(`input-${row}-${column}`);
  if (cell && cell.hasAttribute('disabled')) {
    focusCell([row, column], type);
  } else if (cell && !cell.hasAttribute('disabled')) {
    cell.focus();
  } else if (!cell && type === 'tab') {
    focusCell([row, column], 'newLine');
  } else if (!cell && type === 'reverseTab') {
    focusCell([row, column], 'previousLine');
  }
};

const getCellById = id => id && id.match(/\d+/g);

const handlers = {
  tab: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'tab');
  },
  reverseTab: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'reverseTab');
  },
  firstRight: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'right');
  },
  firstLeft: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'left');
  },
  firstTop: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'top');
  },
  firstBottom: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'bottom');
  },
};

function findColumns({
  entity,
  fields,
  templateColumns,
  showAll,
}: {
  entity: string,
  fields: Array<Object>,
  templateColumns: Array<string>,
  showAll: boolean,
}) {
  if (templateColumns.length) {
    return showAll
      ? fields
      : fields.filter((item, idx) => templateColumns.includes(`${entity}-${idx}`));
  }
  return fields;
}

function findColumnsForCustomFields({ showAll, fields: customFields, templateColumns, entity }) {
  if (templateColumns && templateColumns.length > 0) {
    return showAll
      ? customFields
      : customFields.filter((field, index) =>
          templateColumns.includes(`${entity}-customFields-${index}`)
        );
  }
  return customFields;
}

const getRowCounter = (counter, type) => {
  if (!counter[type]) {
    // eslint-disable-next-line no-param-reassign
    counter[type] = 0;
  }
  // eslint-disable-next-line no-param-reassign
  counter[type] += 1;
  return counter[type];
};

const mapCustomField = (entity: string) => (_, index) => `${entity}-customFields-${index}`;

const TableInlineEdit = ({ allId, targetIds, onCancel, intl, ...dataSource }: Props) => {
  const initShowAll = window.localStorage.getItem('filterRMEditViewShowAll');
  const initTemplateColumn = window.localStorage.getItem('filterRMTemplateColumns');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [templateColumns, setTemplateColumns] = useState(
    initTemplateColumn ? JSON.parse(initTemplateColumn) : [...allColumnIds]
  );
  const [isReady, setIsReady] = useState(false);
  const [showAll, setShowAll] = useState(Number.isInteger(+initShowAll) ? !!+initShowAll : true);
  const [loading, setLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [touched, setTouched] = useState({});
  const [editData, setEditData] = useState({
    orders: {},
    orderItems: {},
    batches: {},
    shipments: {},
    products: {},
    containers: {},
  });
  const [isChangeData, setIsChangeData] = useState(false);

  const headerRef = useRef();
  const sidebarRef = useRef();
  const bodyRef = useRef();

  const handleScroll = () => {
    if (bodyRef.current) {
      if (headerRef.current) headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
      if (sidebarRef.current) sidebarRef.current.scrollTop = bodyRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const { current: activeNode } = bodyRef;
    if (activeNode) activeNode.addEventListener('scroll', handleScroll);

    return () => {
      if (activeNode) activeNode.removeEventListener('scroll', handleScroll);
    };
  });

  const onToggle = useCallback(
    selectedColumn => {
      if (templateColumns && selectedColumn) {
        const filteredTemplateColumns = templateColumns.includes(selectedColumn)
          ? templateColumns.filter(item => item !== selectedColumn)
          : [...templateColumns, selectedColumn];
        setTemplateColumns(filteredTemplateColumns);
        window.localStorage.setItem(
          'filterRMTemplateColumns',
          JSON.stringify(filteredTemplateColumns)
        );
      }
    },
    [templateColumns]
  );

  const { entities } = normalize(dataSource);
  const mappingObjects = formatOrders(dataSource);
  const prevEntities = usePrevious(entities);

  useEffect(() => {
    if (!isEqual(prevEntities, entities) || isChangeData) {
      logger.warn('copy data');
      setEditData(entities);
      setIsChangeData(false);
    }
  }, [prevEntities, entities, isChangeData]);
  useEffect(() => {
    if (dataSource.orders.length || dataSource.shipments.length) {
      const listener = emitter.once('INLINE_CHANGE', newData => {
        logger.warn({ newData });
        setErrorMessage('');

        const { name, value, hasError } = newData;

        let newEditData = cloneDeep(editData);
        const [entityType, id, field] = name.split('.');
        if (entityType === 'orders' && field === 'currency') {
          const orderItemIds = getOrderItemIdsByOrderId(id, mappingObjects);
          orderItemIds.forEach(orderItemId => {
            newEditData = set(newEditData, `orderItems.${orderItemId}.price.currency`, value);
          });
        }
        newEditData = set(newEditData, name, value);
        setEditData(newEditData);

        if (!touched[name]) {
          setTouched({
            ...touched,
            [name]: true,
          });
        }

        if (hasError) {
          setErrors({ ...errors, [name]: true });
        } else {
          delete errors[name];
          setErrors(errors);
        }
      });
      return () => {
        listener.remove();
      };
    }
    return () => {};
  });

  const { orderIds, orderItemIds, productIds, batchIds } = allId;

  const orderColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: orderColumnFields,
    entity: ORDER,
  });

  const orderItemColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: orderItemColumnFields,
    entity: ORDER_ITEM,
  });
  const batchColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: batchColumnFields,
    entity: BATCH,
  });
  const containerColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: containerColumnFields,
    entity: CONTAINER,
  });
  const shipmentColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: shipmentColumnFields,
    entity: SHIPMENT,
  });
  const productColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: productColumnFields,
    entity: PRODUCT,
  });

  return (
    <QueryForAllCustomFields
      onCompleted={customFields => {
        if (!isReady) {
          setIsReady(true);
        }
        const orderCustomFieldIds = getByPathWithDefault([], 'order', customFields).map(
          mapCustomField(ORDER)
        );
        const orderItemCustomFieldIds = getByPathWithDefault([], 'orderItem', customFields).map(
          mapCustomField(ORDER_ITEM)
        );
        const batchCustomFieldIds = getByPathWithDefault([], 'batch', customFields).map(
          mapCustomField(BATCH)
        );
        const shipmentCustomFieldIds = getByPathWithDefault([], 'shipment', customFields).map(
          mapCustomField(SHIPMENT)
        );
        const productCustomFieldIds = getByPathWithDefault([], 'product', customFields).map(
          mapCustomField(PRODUCT)
        );
        const allCustomColumnIds = [
          ...orderCustomFieldIds,
          ...orderItemCustomFieldIds,
          ...batchCustomFieldIds,
          ...shipmentCustomFieldIds,
          ...productCustomFieldIds,
        ];
        const haveCustomFields =
          orderCustomFieldIds.length > 0 ||
          orderItemCustomFieldIds.length > 0 ||
          batchCustomFieldIds.length > 0 ||
          shipmentCustomFieldIds.length > 0 ||
          productCustomFieldIds.length > 0;

        if (haveCustomFields && templateColumns.length === allColumnIds.length) {
          setTemplateColumns([...new Set([...templateColumns, ...allCustomColumnIds])]);
        }
      }}
      render={({
        orderCustomFields,
        orderItemCustomFields,
        batchCustomFields,
        shipmentCustomFields,
        productCustomFields,
      }) => {
        const orderCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: orderCustomFields,
          templateColumns,
          entity: ORDER,
        });
        const orderItemCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: orderItemCustomFields,
          templateColumns,
          entity: ORDER_ITEM,
        });
        const batchCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: batchCustomFields,
          templateColumns,
          entity: BATCH,
        });
        const shipmentCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: shipmentCustomFields,
          templateColumns,
          entity: SHIPMENT,
        });
        const productCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: productCustomFields,
          templateColumns,
          entity: PRODUCT,
        });

        const rowCounter = {};
        const columnOrderCustomNo = orderColumnFieldsFilter.length;
        const columnOrderItemNo = columnOrderCustomNo + orderCustomFieldsFilter.length;
        const columnOrderItemCustomNo = columnOrderItemNo + orderItemColumnFieldsFilter.length;
        const columnBatchNo = columnOrderItemCustomNo + orderItemCustomFieldsFilter.length;
        const columnBatchCustomNo = columnBatchNo + batchColumnFieldsFilter.length;
        const columnContainerNo = columnBatchCustomNo + containerColumnFieldsFilter.length;
        const columnShipmentNo = columnContainerNo + batchCustomFieldsFilter.length;
        const columnShipmentCustomNo = columnShipmentNo + shipmentColumnFieldsFilter.length;
        const columnProductNo = columnShipmentCustomNo + shipmentCustomFieldsFilter.length;
        const columnProductCustomNo = columnProductNo + productColumnFieldsFilter.length;

        const allColumns = {
          orderColumnFieldsFilter,
          orderCustomFieldsFilter,
          orderItemColumnFieldsFilter,
          orderItemCustomFieldsFilter,
          batchColumnFieldsFilter,
          batchCustomFieldsFilter,
          shipmentColumnFieldsFilter,
          shipmentCustomFieldsFilter,
          productColumnFieldsFilter,
          productCustomFieldsFilter,
        };
        logger.warn({ mappingObjects, editData, entities });
        return (
          <ApolloConsumer>
            {client => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <EntityIcon icon="EDIT_TABLE" color="RELATION_MAP" />
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      isLoading={loading}
                      onClick={async () => {
                        const changedData = diff(entities, editData);
                        setLoading(true);
                        try {
                          const result: {
                            data: ?{
                              entitiesUpdateMany: {
                                orders: {
                                  violations?: Array<{ message: string }>,
                                },
                                shipments: {
                                  violations?: Array<{ message: string }>,
                                },
                                batches: {
                                  violations?: Array<{ message: string }>,
                                },
                              },
                            },
                            errors?: Array<Object>,
                          } = await client.mutate({
                            mutation: entitiesUpdateManyMutation,
                            variables: parseChangedData({ changedData, editData, mappingObjects }),
                          });
                          setLoading(false);
                          logger.warn({ result });
                          if (result && result.data && result.data.entitiesUpdateMany) {
                            if (
                              result.data.entitiesUpdateMany.orders.violations &&
                              result.data.entitiesUpdateMany.orders.violations.length
                            ) {
                              const errorMessages = result.data.entitiesUpdateMany.orders.violations.filter(
                                item => !!item
                              );
                              if (errorMessages.length)
                                setErrorMessage(errorMessages[0][0].message);
                            }
                            if (
                              result.data.entitiesUpdateMany.shipments.violations &&
                              result.data.entitiesUpdateMany.shipments.violations.length
                            ) {
                              const errorMessages = result.data.entitiesUpdateMany.shipments.violations.filter(
                                item => !!item
                              );
                              if (errorMessages.length)
                                setErrorMessage(errorMessages[0][0].message);
                            }
                            if (
                              result.data.entitiesUpdateMany.batches.violations &&
                              result.data.entitiesUpdateMany.batches.violations.length
                            ) {
                              const errorMessages = result.data.entitiesUpdateMany.batches.violations.filter(
                                item => !!item
                              );
                              if (errorMessages.length)
                                setErrorMessage(errorMessages[0][0].message);
                            }
                            setIsChangeData(true);
                          } else if (result.errors) {
                            trackingError(result.errors);
                            toast.error('There was an error. Please try again later');
                          }
                        } catch (error) {
                          toast.error('There was an error. Please try again later');
                          setLoading(false);
                          trackingError(error);
                        }
                      }}
                      disabled={
                        !(
                          !isEqual(entities, editData) &&
                          Object.keys(touched).length > 0 &&
                          Object.keys(errors).length === 0
                        )
                      }
                    />
                    <ExportGenericButton
                      columns={() => getExportColumns(intl, allColumns)}
                      rows={() =>
                        getExportRows({
                          data: { editData, mappingObjects },
                          ids: allId,
                          columns: allColumns,
                        })
                      }
                    />
                    {errorMessage && errorMessage.length > 0 && (
                      <div style={{ width: 400 }}> Error: {errorMessage} </div>
                    )}
                  </SlideViewNavBar>
                }
              >
                <div className={NavbarWrapperStyle}>
                  <UserConsumer>
                    {({ user }) => {
                      const lastUsedTemplate = window.localStorage.getItem(
                        `${user.id}-table-template`
                      );
                      return (
                        <>
                          {lastUsedTemplate && (
                            <div className={LastTemplateUsedStyle}>
                              <Label>
                                <FormattedMessage
                                  id="modules.RelationMaps.lastUsed"
                                  defaultMessage="LAST USED TEMPLATE:"
                                />
                              </Label>
                              <Display width="400px" align="left">
                                {lastUsedTemplate}
                              </Display>
                            </div>
                          )}
                          <SelectTemplateButton onClick={() => setShowTemplate(true)} />
                          <SlideView
                            isOpen={showTemplate}
                            onRequestClose={() => setShowTemplate(false)}
                          >
                            <SelectTemplate
                              onSelect={template => {
                                setShowTemplate(false);
                                setShowAll(false);
                                window.localStorage.setItem(
                                  `${user.id}-table-template`,
                                  template.name
                                );
                                window.localStorage.setItem(
                                  'filterRMTemplateColumns',
                                  JSON.stringify(template.fields)
                                );
                                setTemplateColumns(template.fields);
                              }}
                              onCancel={() => setShowTemplate(false)}
                            />
                          </SlideView>
                          <ToggleInput
                            toggled={showAll}
                            onToggle={() => {
                              setShowAll(!showAll);
                              window.localStorage.setItem(
                                'filterRMEditViewShowAll',
                                showAll ? '0' : '1'
                              );
                            }}
                          >
                            <Label>
                              <FormattedMessage
                                id="modules.RelationMaps.showAll"
                                defaultMessage="SHOW ALL"
                              />
                            </Label>
                          </ToggleInput>
                        </>
                      );
                    }}
                  </UserConsumer>
                </div>
                <HotKeys keyMap={keyMap} handlers={handlers} className={EditTableViewWrapperStyle}>
                  <div className={BodyWrapperStyle} ref={bodyRef}>
                    {Object.keys(editData.orders || {}).length === 0 &&
                      Object.keys(editData.shipments || {}).length === 0 && <LoadingIcon />}
                    {/* Shipment has no relation rendering logic */}
                    {(Object.entries(mappingObjects.shipmentNoRelation || {}): any).map(
                      ([shipmentId]) => (
                        <TableRow key={`shipment-row-${shipmentId}`}>
                          <div>
                            <TableEmptyItem
                              fields={orderColumnFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'order')}
                            />
                          </div>
                          <div>
                            <TableEmptyItem
                              fields={orderCustomFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'orderCustom')}
                              columnNo={columnOrderItemCustomNo}
                            />
                          </div>
                          <div>
                            <TableEmptyItem
                              fields={orderItemColumnFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'orderItem')}
                              columnNo={columnOrderItemNo}
                            />
                          </div>
                          <div>
                            <TableEmptyItem
                              fields={orderItemCustomFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                              columnNo={columnOrderItemCustomNo}
                            />
                          </div>
                          <div>
                            <TableEmptyItem
                              fields={batchColumnFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'batch')}
                              columnNo={columnBatchNo}
                            />
                          </div>
                          <div>
                            <TableEmptyItem
                              fields={batchCustomFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'batchCustom')}
                              columnNo={columnBatchCustomNo}
                            />
                          </div>
                          <div>
                            {/* TODO: render the row base on container or batches of shipment */}
                            <TableEmptyItem
                              fields={containerColumnFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'container')}
                              columnNo={columnBatchNo}
                            />
                          </div>
                          <div>
                            <TableItem
                              rowNo={getRowCounter(rowCounter, 'shipment')}
                              columnNo={columnShipmentNo}
                              key={`shipment.${shipmentId}`}
                              cell={`shipments.${shipmentId}`}
                              fields={shipmentColumnFieldsFilter}
                              values={editData.shipments[shipmentId]}
                              editData={editData}
                              validator={shipmentValidator}
                            />
                          </div>
                          <div>
                            <TableItemForCustomFields
                              rowNo={getRowCounter(rowCounter, 'shipmentCustom')}
                              columnNo={columnShipmentCustomNo}
                              cell={`shipments.${shipmentId}`}
                              key={`shipments.customFields.1.${shipmentId}`}
                              fields={shipmentCustomFieldsFilter}
                              values={editData.shipments[shipmentId]}
                              editData={editData}
                              validator={shipmentValidator}
                            />
                          </div>
                          <div>
                            <TableEmptyItem
                              fields={productColumnFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'product')}
                              columnNo={columnProductNo}
                            />
                          </div>
                          <div>
                            <TableEmptyItem
                              fields={productCustomFieldsFilter}
                              rowNo={getRowCounter(rowCounter, 'productCustom')}
                              columnNo={columnProductCustomNo}
                            />
                          </div>
                        </TableRow>
                      )
                    )}
                    {/* Shipment has empty containers rendering logic */}
                    {(Object.entries(mappingObjects.shipment || {}): any)
                      .filter(([shipmentId]) => targetIds.shipmentIds.includes(shipmentId))
                      .map(([shipmentId]) =>
                        mappingObjects.shipment[shipmentId].data.containers
                          .filter(item => item.batches.length === 0)
                          .map(container => (
                            <TableRow key={`shipment-row-${container.id}-${shipmentId}`}>
                              <div>
                                <TableEmptyItem
                                  fields={orderColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'order')}
                                />
                              </div>
                              <div>
                                <TableEmptyItem
                                  fields={orderCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'orderCustom')}
                                  columnNo={columnOrderItemCustomNo}
                                />
                              </div>
                              <div>
                                <TableEmptyItem
                                  fields={orderItemColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'orderItem')}
                                  columnNo={columnOrderItemNo}
                                />
                              </div>
                              <div>
                                <TableEmptyItem
                                  fields={orderItemCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                  columnNo={columnOrderItemCustomNo}
                                />
                              </div>
                              <div>
                                <TableEmptyItem
                                  fields={batchColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'batch')}
                                  columnNo={columnBatchNo}
                                />
                              </div>
                              <div>
                                <TableEmptyItem
                                  fields={batchCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'batchCustom')}
                                  columnNo={columnBatchCustomNo}
                                />
                              </div>
                              <div>
                                <TableItem
                                  key={`empty-container-${container.id}`}
                                  rowNo={getRowCounter(rowCounter, 'container')}
                                  fields={containerColumnFieldsFilter}
                                  columnNo={columnContainerNo}
                                  cell={`containers.${container.id}`}
                                  values={editData.containers[container.id]}
                                  editData={editData}
                                  validator={shipmentValidator}
                                />
                              </div>
                              <div>
                                <TableItem
                                  rowNo={getRowCounter(rowCounter, 'shipment')}
                                  columnNo={columnShipmentNo}
                                  key={`shipment.${shipmentId}`}
                                  cell={`shipments.${shipmentId}`}
                                  fields={shipmentColumnFieldsFilter}
                                  values={editData.shipments[shipmentId]}
                                  editData={editData}
                                  validator={shipmentValidator}
                                />
                              </div>
                              <div>
                                <TableItemForCustomFields
                                  rowNo={getRowCounter(rowCounter, 'shipmentCustom')}
                                  columnNo={columnShipmentCustomNo}
                                  cell={`shipments.${shipmentId}`}
                                  key={`shipments.customFields.1.${shipmentId}`}
                                  fields={shipmentCustomFieldsFilter}
                                  values={editData.shipments[shipmentId]}
                                  editData={editData}
                                  validator={shipmentValidator}
                                />
                              </div>
                              <div>
                                <TableEmptyItem
                                  fields={productColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'product')}
                                  columnNo={columnProductNo}
                                />
                              </div>
                              <div>
                                <TableEmptyItem
                                  fields={productCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'productCustom')}
                                  columnNo={columnProductCustomNo}
                                />
                              </div>
                            </TableRow>
                          ))
                      )}
                    {/* order rendering logic */}
                    {orderIds.map((orderId, counter) => {
                      const order = mappingObjects.order[orderId];
                      if (!order) return null;
                      const orderItems = (Object.values(
                        mappingObjects.orderItem || {}
                      ): any).filter(
                        item =>
                          order.relation.orderItem[item.data.id] &&
                          orderItemIds.includes(item.data.id)
                      );
                      const batches = (Object.values(mappingObjects.batch || {}): any).filter(
                        item =>
                          order.relation.batch[item.data.id] && batchIds.includes(item.data.id)
                      );
                      const totalLines = totalLinePerOrder(orderItems, batchIds);

                      return (
                        <TableRow key={`order-row-${orderId}`}>
                          {/* ORDER */}
                          <div>
                            {orderItems.length === 0 ? (
                              <TableItem
                                rowNo={getRowCounter(rowCounter, 'order')}
                                cell={`orders.${order.data.id}`}
                                fields={orderColumnFieldsFilter}
                                values={editData.orders[orderId]}
                                editData={editData}
                                validator={orderValidator}
                              />
                            ) : (
                              orderItems.map(orderItem =>
                                Object.keys(orderItem.relation.batch || {}).length === 0 ? (
                                  <TableItem
                                    rowNo={getRowCounter(rowCounter, 'order')}
                                    key={`order.${order.data.id}.${counter + 1}.duplication.${
                                      orderItem.data.id
                                    }`}
                                    cell={`orders.${order.data.id}`}
                                    fields={orderColumnFieldsFilter}
                                    values={editData.orders[orderId]}
                                    editData={editData}
                                    validator={orderValidator}
                                  />
                                ) : (
                                  <React.Fragment
                                    key={`order.${order.data.id}.${counter + 1}.duplication.${
                                      orderItem.data.id
                                    }`}
                                  >
                                    {Object.keys(orderItem.relation.batch || {})
                                      .filter(batchId => batchIds.includes(batchId))
                                      .map(batchId => (
                                        <TableItem
                                          key={`order.${order.data.id}.${counter + 1}.duplication.${
                                            orderItem.data.id
                                          }.batch.${batchId}`}
                                          rowNo={getRowCounter(rowCounter, 'order')}
                                          cell={`orders.${order.data.id}`}
                                          fields={orderColumnFieldsFilter}
                                          values={editData.orders[orderId]}
                                          editData={editData}
                                          validator={orderValidator}
                                        />
                                      ))}
                                  </React.Fragment>
                                )
                              )
                            )}
                          </div>
                          <div>
                            {orderItems.length === 0 ? (
                              <TableItemForCustomFields
                                rowNo={getRowCounter(rowCounter, 'orderCustom')}
                                columnNo={columnOrderCustomNo}
                                cell={`orders.${order.data.id}`}
                                key={`orders.customField.${order.data.id}`}
                                fields={orderCustomFieldsFilter}
                                values={editData.orders[orderId]}
                                validator={orderValidator}
                              />
                            ) : (
                              orderItems.map(orderItem =>
                                Object.keys(orderItem.relation.batch || {}).length === 0 ? (
                                  <TableItemForCustomFields
                                    rowNo={getRowCounter(rowCounter, 'orderCustom')}
                                    columnNo={columnOrderCustomNo}
                                    key={`order.${order.data.id}.${counter + 1}.duplication.${
                                      orderItem.data.id
                                    }`}
                                    cell={`orders.${order.data.id}`}
                                    fields={orderCustomFieldsFilter}
                                    values={editData.orders[orderId]}
                                    validator={orderValidator}
                                  />
                                ) : (
                                  <React.Fragment
                                    key={`order.${order.data.id}.${counter + 1}.duplication.${
                                      orderItem.data.id
                                    }`}
                                  >
                                    {Object.keys(orderItem.relation.batch || {})
                                      .filter(batchId => batchIds.includes(batchId))
                                      .map(batchId => (
                                        <TableItemForCustomFields
                                          rowNo={getRowCounter(rowCounter, 'orderCustom')}
                                          columnNo={columnOrderCustomNo}
                                          key={`order.${order.data.id}.${counter + 1}.duplication.${
                                            orderItem.data.id
                                          }.batch.${batchId}`}
                                          cell={`orders.${order.data.id}`}
                                          fields={orderCustomFieldsFilter}
                                          values={editData.orders[orderId]}
                                          validator={orderValidator}
                                        />
                                      ))}
                                  </React.Fragment>
                                )
                              )
                            )}
                          </div>

                          {/* ORDER ITEM */}
                          <div>
                            {orderItems.length ? (
                              orderItems.map(orderItem =>
                                Object.keys(orderItem.relation.batch || {}).length === 0 ? (
                                  <TableItem
                                    rowNo={getRowCounter(rowCounter, 'orderItem')}
                                    columnNo={columnOrderItemNo}
                                    cell={`orderItems.${orderItem.data.id}`}
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                    fields={orderItemColumnFieldsFilter}
                                    values={editData.orderItems[orderItem.data.id]}
                                    editData={editData}
                                    validator={orderValidator}
                                  />
                                ) : (
                                  <React.Fragment
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                  >
                                    {Object.keys(orderItem.relation.batch || {})
                                      .filter(batchId => batchIds.includes(batchId))
                                      .map(batchId => (
                                        <TableItem
                                          rowNo={getRowCounter(rowCounter, 'orderItem')}
                                          columnNo={columnOrderItemNo}
                                          cell={`orderItems.${orderItem.data.id}`}
                                          key={`orderItem.${counter + 1}.duplication.${batchId}`}
                                          fields={orderItemColumnFieldsFilter}
                                          values={editData.orderItems[orderItem.data.id]}
                                          editData={editData}
                                          validator={orderValidator}
                                        />
                                      ))}
                                  </React.Fragment>
                                )
                              )
                            ) : (
                              <TableEmptyItem
                                fields={orderItemColumnFieldsFilter}
                                rowNo={getRowCounter(rowCounter, 'orderItem')}
                                columnNo={columnOrderItemNo}
                              />
                            )}
                          </div>
                          <div>
                            {orderItems.length ? (
                              orderItems.map(orderItem =>
                                Object.keys(orderItem.relation.batch || {}).length === 0 ? (
                                  <TableItemForCustomFields
                                    rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                    columnNo={columnOrderItemCustomNo}
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                    cell={`orderItems.${orderItem.data.id}`}
                                    fields={orderItemCustomFieldsFilter}
                                    values={editData.orderItems[orderItem.data.id]}
                                    validator={orderValidator}
                                  />
                                ) : (
                                  <React.Fragment
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                  >
                                    {Object.keys(orderItem.relation.batch || {})
                                      .filter(batchId => batchIds.includes(batchId))
                                      .map(batchId => (
                                        <TableItemForCustomFields
                                          rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                          columnNo={columnOrderItemCustomNo}
                                          key={`orderItem.${counter + 1}.duplication.${batchId}`}
                                          cell={`orders.${order.data.id}`}
                                          fields={orderItemCustomFieldsFilter}
                                          values={editData.orderItems[orderItem.data.id]}
                                          validator={orderValidator}
                                        />
                                      ))}
                                  </React.Fragment>
                                )
                              )
                            ) : (
                              <TableEmptyItem
                                fields={orderItemCustomFieldsFilter}
                                rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                columnNo={columnOrderItemCustomNo}
                              />
                            )}
                          </div>
                          {/* BATCH */}
                          <div>
                            {batchIds.length ? (
                              <>
                                {orderItems.map(orderItem =>
                                  orderItem.data.batches
                                    .filter(batch => batchIds.includes(batch.id))
                                    .map(batch => (
                                      <TableItem
                                        rowNo={getRowCounter(rowCounter, 'batch')}
                                        columnNo={columnBatchNo}
                                        cell={`batches.${batch.id}`}
                                        key={batch.id}
                                        fields={batchColumnFieldsFilter}
                                        values={setPackageBatchData(editData.batches[batch.id])}
                                        editData={editData}
                                        validator={batchValidator}
                                      />
                                    ))
                                )}
                                {range(totalLines - batches.length).map(index => (
                                  <TableEmptyItem
                                    key={index}
                                    fields={batchColumnFieldsFilter}
                                    rowNo={getRowCounter(rowCounter, 'batch')}
                                    columnNo={columnBatchNo}
                                  />
                                ))}
                              </>
                            ) : (
                              range(totalLines).map(index => (
                                <TableEmptyItem
                                  key={index}
                                  fields={batchColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'batch')}
                                  columnNo={columnBatchNo}
                                />
                              ))
                            )}
                          </div>
                          <div>
                            {batchIds.length ? (
                              <>
                                {orderItems.map(orderItem =>
                                  orderItem.data.batches
                                    .filter(batch => batchIds.includes(batch.id))
                                    .map(batch => (
                                      <TableItemForCustomFields
                                        rowNo={getRowCounter(rowCounter, 'batchCustom')}
                                        columnNo={columnBatchCustomNo}
                                        cell={`batches.${batch.id}`}
                                        key={`batches.customFields.${batch.id}`}
                                        fields={batchCustomFieldsFilter}
                                        values={setPackageBatchData(editData.batches[batch.id])}
                                        validator={batchValidator}
                                      />
                                    ))
                                )}
                                {range(totalLines - batches.length).map(index => (
                                  <TableEmptyItem
                                    key={index}
                                    fields={batchCustomFieldsFilter}
                                    rowNo={getRowCounter(rowCounter, 'batchCustom')}
                                    columnNo={columnBatchCustomNo}
                                  />
                                ))}
                              </>
                            ) : (
                              range(totalLines).map(index => (
                                <TableEmptyItem
                                  key={index}
                                  fields={batchCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'batchCustom')}
                                  columnNo={columnBatchCustomNo}
                                />
                              ))
                            )}
                          </div>

                          {/* Container */}
                          <div>
                            <>
                              {orderItems.map(orderItem =>
                                orderItem.data.batches
                                  .filter(batch => batchIds.includes(batch.id))
                                  .map(batch => {
                                    const containerId = batch.container;

                                    if (!containerId) {
                                      return (
                                        <TableEmptyItem
                                          key={batch.id}
                                          rowNo={getRowCounter(rowCounter, 'container')}
                                          fields={containerColumnFieldsFilter}
                                          columnNo={columnContainerNo}
                                        />
                                      );
                                    }
                                    return (
                                      <TableItem
                                        key={batch.id}
                                        rowNo={getRowCounter(rowCounter, 'container')}
                                        fields={containerColumnFieldsFilter}
                                        columnNo={columnContainerNo}
                                        cell={`containers.${containerId}`}
                                        values={editData.containers[containerId]}
                                        editData={editData}
                                        validator={shipmentValidator}
                                      />
                                    );
                                  })
                              )}
                              {range(totalLines - batches.length).map(index => (
                                <TableEmptyItem
                                  key={index}
                                  rowNo={getRowCounter(rowCounter, 'container')}
                                  fields={containerColumnFieldsFilter}
                                  columnNo={columnContainerNo}
                                />
                              ))}
                            </>
                          </div>

                          {/* SHIPMENT */}
                          <div>
                            <>
                              {orderItems.map(orderItem =>
                                orderItem.data.batches
                                  .filter(batch => batchIds.includes(batch.id))
                                  .map(batch => {
                                    const shipmentId = batch.shipment && batch.shipment.id;
                                    if (!shipmentId) {
                                      return (
                                        <TableEmptyItem
                                          key={`empty-shipment-${order.id}-${batch.id}`}
                                          fields={shipmentColumnFieldsFilter}
                                          rowNo={getRowCounter(rowCounter, 'shipment')}
                                          columnNo={columnShipmentNo}
                                        />
                                      );
                                    }
                                    const shipment = mappingObjects.shipment[batch.shipment.id];
                                    return (
                                      <TableItem
                                        rowNo={getRowCounter(rowCounter, 'shipment')}
                                        columnNo={columnShipmentNo}
                                        key={`shipment.${
                                          batch.id
                                        }.${shipmentId}-${columnShipmentNo}`}
                                        cell={`shipments.${shipment.data.id}`}
                                        fields={shipmentColumnFieldsFilter}
                                        values={editData.shipments[shipment.data.id]}
                                        editData={editData}
                                        validator={shipmentValidator}
                                      />
                                    );
                                  })
                              )}
                              {range(totalLines - batches.length).map(index => (
                                <TableEmptyItem
                                  key={index}
                                  fields={shipmentColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'shipment')}
                                  columnNo={columnShipmentNo}
                                />
                              ))}
                            </>
                          </div>
                          <div>
                            <>
                              {orderItems.map(orderItem =>
                                orderItem.data.batches
                                  .filter(batch => batchIds.includes(batch.id))
                                  .map(batch => {
                                    const shipmentId = batch.shipment && batch.shipment.id;
                                    if (!shipmentId) {
                                      return (
                                        <TableEmptyItem
                                          key={`empty-shipment-custom-${order.id}-${batch.id}`}
                                          fields={shipmentCustomFieldsFilter}
                                          rowNo={getRowCounter(rowCounter, 'shipmentCustom')}
                                          columnNo={columnShipmentNo}
                                        />
                                      );
                                    }
                                    const shipment = mappingObjects.shipment[batch.shipment.id];
                                    return (
                                      <TableItemForCustomFields
                                        rowNo={getRowCounter(rowCounter, 'shipmentCustom')}
                                        columnNo={columnShipmentCustomNo}
                                        cell={`shipments.${batch.id}.${shipment.data.id}`}
                                        key={`shipments.customFields.${batch.id}.${
                                          shipment.data.id
                                        }`}
                                        fields={shipmentCustomFieldsFilter}
                                        values={editData.shipments[shipment.data.id]}
                                        validator={shipmentValidator}
                                      />
                                    );
                                  })
                              )}
                              {range(totalLines - batches.length).map(index => (
                                <TableEmptyItem
                                  key={index}
                                  fields={shipmentCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'shipmentCustom')}
                                  columnNo={columnShipmentCustomNo}
                                />
                              ))}
                            </>
                          </div>

                          {/* product */}
                          <div>
                            {productIds.length ? (
                              orderItems.map(orderItem =>
                                Object.keys(orderItem.relation.batch || {}).length === 0 ? (
                                  <TableItem
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                    fields={productColumnFieldsFilter}
                                    rowNo={getRowCounter(rowCounter, 'product')}
                                    columnNo={columnProductNo}
                                    cell={`products.${orderItem.data.productProvider.product}`}
                                    values={
                                      editData.products[`${orderItem.data.productProvider.product}`]
                                    }
                                    editData={editData}
                                    validator={productValidator}
                                  />
                                ) : (
                                  <React.Fragment
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                  >
                                    {Object.keys(orderItem.relation.batch || {})
                                      .filter(batchId => batchIds.includes(batchId))
                                      .map(batchId => (
                                        <TableItem
                                          key={`orderItem.${counter +
                                            1}.duplication.${batchId}.product`}
                                          fields={productColumnFieldsFilter}
                                          rowNo={getRowCounter(rowCounter, 'product')}
                                          columnNo={columnProductNo}
                                          cell={`products.${
                                            orderItem.data.productProvider.product
                                          }`}
                                          values={
                                            editData.products[
                                              `${orderItem.data.productProvider.product}`
                                            ]
                                          }
                                          editData={editData}
                                          validator={productValidator}
                                        />
                                      ))}
                                  </React.Fragment>
                                )
                              )
                            ) : (
                              <TableEmptyItem
                                fields={productColumnFieldsFilter}
                                rowNo={getRowCounter(rowCounter, 'product')}
                                columnNo={columnProductNo}
                              />
                            )}
                          </div>
                          <div>
                            {orderItems.length ? (
                              orderItems.map(orderItem =>
                                Object.keys(orderItem.relation.batch || {}).length === 0 ? (
                                  <TableItemForCustomFields
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                    fields={productCustomFieldsFilter}
                                    rowNo={getRowCounter(rowCounter, 'productCustom')}
                                    columnNo={columnProductCustomNo}
                                    cell={`products.${orderItem.data.productProvider.product}`}
                                    values={
                                      editData.products[`${orderItem.data.productProvider.product}`]
                                    }
                                    validator={productValidator}
                                  />
                                ) : (
                                  <React.Fragment
                                    key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                  >
                                    {Object.keys(orderItem.relation.batch || {})
                                      .filter(batchId => batchIds.includes(batchId))
                                      .map(batchId => (
                                        <TableItemForCustomFields
                                          key={`orderItem.${counter + 1}.duplication.${batchId}`}
                                          fields={productCustomFieldsFilter}
                                          rowNo={getRowCounter(rowCounter, 'productCustom')}
                                          columnNo={columnProductCustomNo}
                                          cell={`products.${
                                            orderItem.data.productProvider.product
                                          }`}
                                          values={
                                            editData.products[
                                              `${orderItem.data.productProvider.product}`
                                            ]
                                          }
                                          validator={productValidator}
                                        />
                                      ))}
                                  </React.Fragment>
                                )
                              )
                            ) : (
                              <TableEmptyItem
                                fields={productCustomFieldsFilter}
                                rowNo={getRowCounter(rowCounter, 'productCustom')}
                                columnNo={columnProductCustomNo}
                              />
                            )}
                          </div>
                        </TableRow>
                      );
                    })}
                  </div>
                  <div className={HeaderWrapperStyle} ref={headerRef}>
                    <TableHeader
                      entity="ORDER"
                      showAll={showAll}
                      info={orderColumns}
                      templateColumns={templateColumns}
                      onToggle={onToggle}
                    />
                    <TableHeaderForCustomFields
                      entity="ORDER"
                      customFields={orderCustomFields}
                      onToggle={onToggle}
                      showAll={showAll}
                      templateColumns={templateColumns}
                    />
                    <TableHeader
                      entity="ORDER_ITEM"
                      showAll={showAll}
                      info={orderItemColumns}
                      templateColumns={templateColumns}
                      onToggle={onToggle}
                    />
                    <TableHeaderForCustomFields
                      entity="ORDER_ITEM"
                      customFields={orderItemCustomFields}
                      onToggle={onToggle}
                      showAll={showAll}
                      templateColumns={templateColumns}
                    />
                    <TableHeader
                      entity="BATCH"
                      showAll={showAll}
                      info={batchColumns}
                      templateColumns={templateColumns}
                      onToggle={onToggle}
                    />
                    <TableHeaderForCustomFields
                      entity="BATCH"
                      customFields={batchCustomFields}
                      onToggle={onToggle}
                      showAll={showAll}
                      templateColumns={templateColumns}
                    />
                    <TableHeader
                      entity="CONTAINER"
                      showAll={showAll}
                      info={containerColumns}
                      templateColumns={templateColumns}
                      onToggle={onToggle}
                    />
                    <TableHeader
                      entity="SHIPMENT"
                      showAll={showAll}
                      info={shipmentColumns}
                      templateColumns={templateColumns}
                      onToggle={onToggle}
                    />
                    <TableHeaderForCustomFields
                      entity="SHIPMENT"
                      customFields={shipmentCustomFields}
                      onToggle={onToggle}
                      showAll={showAll}
                      templateColumns={templateColumns}
                    />
                    <TableHeader
                      showAll={showAll}
                      entity="PRODUCT"
                      info={productColumns}
                      templateColumns={templateColumns}
                      onToggle={onToggle}
                    />
                    <TableHeaderForCustomFields
                      showAll={showAll}
                      entity="PRODUCT"
                      customFields={productCustomFields}
                      onToggle={onToggle}
                      templateColumns={templateColumns}
                    />
                    <div className={TableHeaderClearFixStyle} />
                  </div>
                  <div className={SidebarWrapperStyle} ref={sidebarRef}>
                    {/* Add counter for shipment has no relation */}
                    {(Object.entries(mappingObjects.shipmentNoRelation || {}): any).map(
                      ([shipmentId], idx) => (
                        <LineNumber
                          height="40px"
                          line={idx + 1}
                          key={`shipment-line-${shipmentId}`}
                        />
                      )
                    )}
                    {/* Add row for shipment has empty container */}
                    {(Object.entries(mappingObjects.shipment || {}): any)
                      .filter(([shipmentId]) => targetIds.shipmentIds.includes(shipmentId))
                      .map(([shipmentId]) =>
                        mappingObjects.shipment[shipmentId].data.containers
                          .filter(item => item.batches.length === 0)
                          .map((container, idx) => (
                            <LineNumber
                              height="40px"
                              line={
                                idx +
                                1 +
                                Object.entries(mappingObjects.shipmentNoRelation || {}).length
                              }
                              key={`shipment-line-empty-container-${container.id}`}
                            />
                          ))
                      )}
                    {/* Row for each order */}
                    {orderIds.map((orderId, counter) => {
                      const order = mappingObjects.order[orderId];
                      if (!order) return null;
                      const orderItems = (Object.values(
                        mappingObjects.orderItem || {}
                      ): any).filter(
                        item =>
                          order.relation.orderItem[item.data.id] &&
                          orderItemIds.includes(item.data.id)
                      );
                      const totalLines = totalLinePerOrder(orderItems, batchIds);
                      const shipmentLines =
                        Object.entries(mappingObjects.shipmentNoRelation || {}).length +
                        (Object.entries(mappingObjects.shipment || {}): any)
                          .filter(([shipmentId]) => targetIds.shipmentIds.includes(shipmentId))
                          .map(([shipmentId]) =>
                            mappingObjects.shipment[shipmentId].data.containers.filter(
                              item => item.batches.length === 0
                            )
                          )
                          .reduce((total, currentContainer) => total + currentContainer.length, 0);

                      return (
                        <LineNumber
                          height={`${totalLines * 40}px`}
                          line={shipmentLines + counter + 1}
                          key={`line-for-${orderId}`}
                        />
                      );
                    })}
                  </div>

                  <div className={SidebarFadeStyle} />
                </HotKeys>
              </Layout>
            )}
          </ApolloConsumer>
        );
      }}
    />
  );
};

export default injectIntl(TableInlineEdit);
