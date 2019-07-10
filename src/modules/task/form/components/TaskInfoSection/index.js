// @flow
import React from 'react';
import type { Task } from 'generated/graphql';
import { type IntlShape, injectIntl, FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { ObjectValue, BooleanValue } from 'react-values';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { UserConsumer } from 'modules/user';
import { isNotFound, isForbidden } from 'utils/data';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { encodeId } from 'utils/id';
import emitter from 'utils/emitter';
import { spreadOrderItem } from 'utils/item';
import { checkEditableFromEntity } from 'utils/task';
import { formatToGraphql, isBefore } from 'utils/date';
import {
  ShipmentCard,
  OrderCard,
  ItemCard,
  BatchCard,
  ProductCard,
  OrderProductProviderCard,
  ProjectCard,
  MilestoneCard,
  GrayCard,
} from 'components/Cards';
import SlideView from 'components/SlideView';
import {
  SectionWrapper,
  SectionHeader,
  LastModified,
  TextInputFactory,
  DateInputFactory,
  TextAreaInputFactory,
  FieldItem,
  Label,
  TagsInput,
  Display,
  TaskStatusInput,
  ToggleInput,
  ApproveRejectMenu,
  TaskApprovalStatusInput,
  RadioInput,
  MetricInputFactory,
  SelectInputFactory,
  UserAssignmentInputFactory,
  DashedPlusButton,
  FormTooltip,
} from 'components/Form';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import FormattedNumber from 'components/FormattedNumber';
import { FormField, FormContainer } from 'modules/form';
import TaskContainer from 'modules/task/form/container';
import validator, { circleValidator } from 'modules/task/form/validator';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import SelectProjectAndMilestone from 'providers/SelectProjectAndMilestone';
import { START_DATE, DUE_DATE, PROJECT_DUE_DATE, MILESTONE_DUE_DATE } from './constants';
import {
  convertBindingToSelection,
  getFieldsByEntity,
  calculateDate,
  findDuration,
} from './helpers';
import {
  TaskFormWrapperStyle,
  TaskSectionWrapperStyle,
  MainFieldsWrapperStyle,
  MemoWrapperStyle,
  TaskStatusWrapperStyle,
  AssignedToStyle,
  ApprovalToggleWrapperStyle,
  AutoDateBackgroundStyle,
  RadioWrapperStyle,
  AutoDateWrapperStyle,
  AutoDateOffsetWrapperStyle,
  AutoDateSyncIconStyle,
  UnapprovedButtonStyle,
} from './style';

type Props = {|
  task: Object,
  groupIds: Array<string>,
  intl: IntlShape,
  isInTemplate?: boolean,
  isInProject?: boolean,
  hideParentInfo?: boolean,
  parentEntity?: string,
|};

function defaultBindingOptions(intl: IntlShape, isStartDate: boolean) {
  return [
    !isStartDate
      ? {
          value: START_DATE,
          label: intl.formatMessage({
            id: 'modules.Tasks.startDate',
            defaultMessage: 'START DATE',
          }),
        }
      : {
          value: DUE_DATE,
          label: intl.formatMessage({
            id: 'modules.Tasks.dueDate',
            defaultMessage: 'DUE DATE',
          }),
        },
    {
      value: PROJECT_DUE_DATE,
      label: intl.formatMessage({
        id: 'modules.Tasks.projectDueDate',
        defaultMessage: 'PROJECT DUE DATE',
      }),
    },
    {
      value: MILESTONE_DUE_DATE,
      label: intl.formatMessage({
        id: 'modules.Tasks.milestoneDueDate',
        defaultMessage: 'MILESTONE DUE DATE',
      }),
    },
  ];
}

function triggerAutoBinding({
  manualSettings,
  values,
  entity,
  hasCircleBindingError,
  task,
}: {|
  manualSettings: Object,
  values: Object,
  entity: string,
  hasCircleBindingError: boolean,
  task: Task,
|}) {
  if (!manualSettings.dueDate || !manualSettings.startDate) {
    setTimeout(() => {
      if (!manualSettings.dueDate) {
        const { months = 0, weeks = 0, days = 0 } = values.dueDateInterval || {};
        emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
          hasCircleBindingError,
          selectedField: 'dueDate',
          field: values.dueDateBinding,
          entityId: getByPath('entity.id', task),
          autoDateDuration: {
            metric: findDuration({ months, weeks }),
            value: months || weeks || days,
          },
          autoDateOffset: -(months || weeks || days) > 0 ? 'before' : 'after',
        });
      }
      if (!manualSettings.startDate) {
        const { months = 0, weeks = 0, days = 0 } = values.startDateInterval || {};
        emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
          hasCircleBindingError,
          selectedField: 'startDate',
          field: values.startDateBinding,
          entityId: getByPath('entity.id', task),
          autoDateDuration: {
            metric: findDuration({ months, weeks }),
            value: months || weeks || days,
          },
          autoDateOffset: -(months || weeks || days) > 0 ? 'before' : 'after',
        });
      }
    }, 200);
  }
}

const TaskInfoSection = ({
  intl,
  groupIds,
  task,
  isInTemplate,
  isInProject,
  hideParentInfo,
  parentEntity,
}: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canViewOrderForm = hasPermission(ORDER_FORM);
  const canViewProductForm = hasPermission(PRODUCT_FORM);

  const initDuration = {};
  let isBeforeStartDate = true;
  let isBeforeDueDate = true;
  if (task && task.startDateBinding) {
    const { months = 0, weeks = 0, days = 0 } = task.startDateInterval || {};
    if ((months || weeks || days) > 0) {
      isBeforeStartDate = false;
    }
    initDuration[task.startDateBinding] = calculateDate({
      duration: findDuration({ months, weeks }),
      date: task.startDate,
      offset: -(months || weeks || days),
    });
  }

  if (task && task.dueDateBinding) {
    const { months = 0, weeks = 0, days = 0 } = task.dueDateInterval || {};
    if ((months || weeks || days) > 0) {
      isBeforeDueDate = false;
    }
    initDuration[task.dueDateBinding] = calculateDate({
      duration: findDuration({ months, weeks }),
      date: task.dueDate,
      offset: -(months || weeks || days),
    });
  }

  const parentValues = React.useRef(initDuration);
  const [isBeforeStartDateBinding, setIsBeforeStartDateBinding] = React.useState(isBeforeStartDate);
  const [isBeforeDueDateBinding, setIsBeforeDueDateBinding] = React.useState(isBeforeDueDate);

  const onChangeBinding = React.useCallback(
    ({
      isManual,
      field,
      hasCircleBindingError,
      type,
      onChange,
    }: {
      isManual: boolean,
      hasCircleBindingError: boolean,
      type: string,
      field: 'startDate' | 'dueDate',
      onChange: Object => void,
    }) => {
      if (!isManual) {
        switch (type) {
          case 'Shipment': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'Batch': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'Order': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'OrderItem': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'Product': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'ProductProvider': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          default: {
            onChange({
              [`${field}Binding`]: START_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              START_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
        }
      } else {
        onChange({
          [`${field}Binding`]: null,
          [`${field}Interval`]: null,
        });
      }
    },
    [task]
  );

  React.useEffect(() => {
    emitter.addListener('LIVE_VALUE', (field: mixed, value: mixed) => {
      if (value && parentValues.current) {
        parentValues.current[String(field)] = value;
      }
    });

    return () => {
      emitter.removeAllListeners('LIVE_VALUE');
    };
  });

  return (
    <div className={TaskFormWrapperStyle}>
      <SectionWrapper id="task_taskSection">
        <SectionHeader
          icon="TASK"
          title={<FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />}
        >
          {task.updatedAt && <LastModified updatedAt={task.updatedAt} updatedBy={task.updatedBy} />}
        </SectionHeader>
        <Subscribe to={[TaskContainer, FormContainer]}>
          {(
            { originalValues, state: values, setFieldValue, setFieldValues },
            { setFieldTouched }
          ) => {
            const isCompleted = !!values.completedBy;
            const isUnapproved = !(
              (values.approvedBy && values.approvedBy.id) ||
              (values.rejectedBy && values.rejectedBy.id)
            );
            const manualSettings = {
              startDate: !values.startDateBinding,
              dueDate: !values.dueDateBinding,
            };

            const entity = getByPathWithDefault(parentEntity, 'entity.__typename', task);
            const editable = checkEditableFromEntity(entity, hasPermission);
            const hasCircleBindingError = !circleValidator.isValidSync(values);
            return (
              <div className={TaskSectionWrapperStyle}>
                {!hideParentInfo &&
                  getByPathWithDefault('', 'entity.__typename', task) === 'Shipment' && (
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage id="modules.Tasks.shipment" defaultMessage="SHIPMENT" />
                        </Label>
                      }
                      vertical
                      input={
                        <ShipmentCard
                          shipment={task.shipment}
                          onClick={() => navigate(`/shipment/${encodeId(task.shipment.id)}`)}
                        />
                      }
                    />
                  )}

                <div className={MainFieldsWrapperStyle}>
                  <GridColumn>
                    <FieldItem
                      label={
                        <Label height="30px">
                          <FormattedMessage id="modules.Tasks.taskNo" defaultMessage="TASK No." />
                        </Label>
                      }
                      input={
                        <Display height="30px">
                          <FormattedNumber value={task.sort + 1} />
                        </Display>
                      }
                    />

                    <FormField
                      name="name"
                      initValue={values.name}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextInputFactory
                          name={name}
                          label={<FormattedMessage id="modules.Tasks.name" defaultMessage="NAME" />}
                          required
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          editable={editable.name}
                        />
                      )}
                    </FormField>

                    <FieldItem
                      tooltip={
                        hasCircleBindingError && (
                          <FormTooltip
                            errorMessage={
                              <FormattedMessage
                                id="modules.Tasks.bindingErrorMessage"
                                defaultMessage="Start Date and Due Date cannot be binded to each other at the same time."
                              />
                            }
                          />
                        )
                      }
                      label={
                        <Label height="30px">
                          <FormattedMessage id="modules.Tasks.dueDate" defaultMessage="DUE DATE" />
                        </Label>
                      }
                      input={
                        <GridColumn gap="10px">
                          <div
                            className={AutoDateBackgroundStyle(
                              manualSettings.dueDate ? 'top' : 'bottom'
                            )}
                          />

                          <div className={RadioWrapperStyle('top')}>
                            <RadioInput
                              align="right"
                              selected={manualSettings.dueDate}
                              onToggle={() =>
                                !manualSettings.dueDate
                                  ? onChangeBinding({
                                      type: entity,
                                      field: 'dueDate',
                                      isManual: true,
                                      onChange: setFieldValues,
                                      hasCircleBindingError: false,
                                    })
                                  : () => {}
                              }
                              editable={editable.dueDate}
                            />
                          </div>

                          <div className={RadioWrapperStyle('bottom')}>
                            <RadioInput
                              align="right"
                              selected={!manualSettings.dueDate}
                              onToggle={() =>
                                manualSettings.dueDate
                                  ? onChangeBinding({
                                      type: entity,
                                      field: 'dueDate',
                                      isManual: false,
                                      onChange: setFieldValues,
                                      hasCircleBindingError: values.startDateBinding === DUE_DATE,
                                    })
                                  : () => {}
                              }
                              editable={editable.dueDate}
                            />
                          </div>

                          {isInTemplate ? (
                            <Display
                              color={manualSettings.dueDate ? 'GRAY' : 'GRAY_LIGHT'}
                              height="30px"
                            >
                              <FormattedMessage
                                id="modules.Tasks.datePlaceholder"
                                defaultMessage="yyyy/mm/dd"
                              />
                            </Display>
                          ) : (
                            <FormField
                              name="dueDate"
                              initValue={values.dueDate}
                              values={values}
                              validator={validator}
                              setFieldValue={setFieldValue}
                            >
                              {({ name, ...inputHandlers }) => (
                                <DateInputFactory
                                  name={name}
                                  inputColor={
                                    values.dueDate &&
                                    isBefore(new Date(values.dueDate), new Date()) &&
                                    isCompleted
                                      ? 'RED'
                                      : 'BLACK'
                                  }
                                  {...inputHandlers}
                                  onBlur={evt => {
                                    inputHandlers.onBlur(evt);
                                    triggerAutoBinding({
                                      manualSettings,
                                      values,
                                      entity,
                                      hasCircleBindingError,
                                      task,
                                    });
                                  }}
                                  originalValue={originalValues[name]}
                                  editable={editable.dueDate && manualSettings.dueDate}
                                  hideTooltip={!manualSettings.dueDate}
                                />
                              )}
                            </FormField>
                          )}

                          {!manualSettings.dueDate ? (
                            <ObjectValue
                              value={{
                                autoDateField: values.dueDateBinding,
                                startDateBinding: values.startDateBinding,
                                autoDateOffset: isBeforeDueDateBinding ? 'before' : 'after',
                                ...convertBindingToSelection(values.dueDateInterval),
                              }}
                              onChange={({
                                autoDateField,
                                startDateBinding,
                                autoDateOffset,
                                autoDateDuration,
                              }) => {
                                setFieldValue('dueDateInterval', {
                                  [autoDateDuration.metric]:
                                    autoDateOffset === 'after'
                                      ? Math.abs(autoDateDuration.value)
                                      : -Math.abs(autoDateDuration.value),
                                });
                                emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
                                  selectedField: 'dueDate',
                                  field: autoDateField,
                                  entityId: getByPath('entity.id', task),
                                  autoDateDuration: {
                                    ...autoDateDuration,
                                    value:
                                      autoDateOffset === 'after'
                                        ? Math.abs(autoDateDuration.value)
                                        : -Math.abs(autoDateDuration.value),
                                  },
                                  autoDateOffset,
                                  hasCircleBindingError:
                                    autoDateField === START_DATE && startDateBinding === DUE_DATE,
                                });
                              }}
                            >
                              {({
                                value: { autoDateDuration, autoDateOffset, autoDateField },
                                set,
                              }) => (
                                <div className={AutoDateWrapperStyle}>
                                  <div className={AutoDateSyncIconStyle}>
                                    <Icon icon="SYNC" />
                                  </div>

                                  <div className={AutoDateOffsetWrapperStyle}>
                                    <FormField
                                      name="autoDueDateDuration"
                                      initValue={{
                                        ...autoDateDuration,
                                        value: Math.abs(autoDateDuration.value),
                                      }}
                                      setFieldValue={(field, value) =>
                                        set('autoDateDuration', value)
                                      }
                                      values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                    >
                                      {({ name, ...inputHandlers }) => (
                                        <MetricInputFactory
                                          name={name}
                                          metricType="duration"
                                          metricSelectWidth="60px"
                                          metricOptionWidth="65px"
                                          inputWidth="135px"
                                          {...inputHandlers}
                                          editable={editable.dueDateBinding}
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>

                                    <FormField
                                      name="autoDueDateOffset"
                                      initValue={autoDateOffset}
                                      setFieldValue={(field, value) => {
                                        setIsBeforeDueDateBinding(value === 'before');
                                        set('autoDateOffset', value);
                                      }}
                                      saveOnChange
                                      values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                    >
                                      {({ ...inputHandlers }) => (
                                        <SelectInputFactory
                                          items={[
                                            {
                                              label: 'Before',
                                              value: 'before',
                                            },
                                            { label: 'After', value: 'after' },
                                          ]}
                                          inputWidth="55px"
                                          {...inputHandlers}
                                          editable={editable.dueDateBinding}
                                          required
                                          hideDropdownArrow
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>
                                  </div>

                                  <FormField
                                    name="autoDateField"
                                    initValue={autoDateField}
                                    setFieldValue={(field, value) => {
                                      if (values.dueDateBinding !== value) {
                                        set(field, value);
                                        setFieldValue('dueDateBinding', value);
                                      }
                                    }}
                                    saveOnChange
                                    values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                  >
                                    {({ ...inputHandlers }) => (
                                      <SelectInputFactory
                                        {...inputHandlers}
                                        items={[
                                          ...defaultBindingOptions(intl, false),
                                          ...getFieldsByEntity(entity, intl),
                                        ]}
                                        editable={editable.dueDateBinding}
                                        required
                                        hideTooltip
                                      />
                                    )}
                                  </FormField>
                                </div>
                              )}
                            </ObjectValue>
                          ) : (
                            <Display color="GRAY_LIGHT" width="200px" height="30px">
                              {editable.dueDateBinding ? (
                                <FormattedMessage
                                  id="modules.Tasks.chooseDataBinding"
                                  defaultMessage="Choose data to sync from"
                                />
                              ) : (
                                <FormattedMessage
                                  id="modules.Tasks.noEventBindingChosen"
                                  defaultMessage="No event binding chosen"
                                />
                              )}
                            </Display>
                          )}
                        </GridColumn>
                      }
                    />

                    <FieldItem
                      tooltip={
                        hasCircleBindingError && (
                          <FormTooltip
                            errorMessage={
                              <FormattedMessage
                                id="modules.Tasks.bindingErrorMessage"
                                defaultMessage="Start Date and Due Date cannot be binded to each other at the same time."
                              />
                            }
                          />
                        )
                      }
                      label={
                        <Label height="30px">
                          <FormattedMessage
                            id="modules.Tasks.startDate"
                            defaultMessage="START DATE"
                          />
                        </Label>
                      }
                      input={
                        <GridColumn gap="10px">
                          <div
                            className={AutoDateBackgroundStyle(
                              manualSettings.startDate ? 'top' : 'bottom'
                            )}
                          />

                          <div className={RadioWrapperStyle('top')}>
                            <RadioInput
                              align="right"
                              selected={manualSettings.startDate}
                              onToggle={() =>
                                !manualSettings.startDate
                                  ? onChangeBinding({
                                      type: entity,
                                      field: 'startDate',
                                      isManual: true,
                                      onChange: setFieldValues,
                                      hasCircleBindingError: false,
                                    })
                                  : () => {}
                              }
                              editable={editable.startDate}
                            />
                          </div>

                          <div className={RadioWrapperStyle('bottom')}>
                            <RadioInput
                              align="right"
                              selected={!manualSettings.startDate}
                              onToggle={() =>
                                manualSettings.startDate
                                  ? onChangeBinding({
                                      type: entity,
                                      field: 'startDate',
                                      isManual: false,
                                      onChange: setFieldValues,
                                      hasCircleBindingError: values.dueDateBinding === START_DATE,
                                    })
                                  : () => {}
                              }
                              editable={editable.startDate}
                            />
                          </div>

                          {isInTemplate ? (
                            <Display
                              color={manualSettings.startDate ? 'GRAY' : 'GRAY_LIGHT'}
                              height="30px"
                            >
                              <FormattedMessage
                                id="modules.Tasks.datePlaceholder"
                                defaultMessage="yyyy/mm/dd"
                              />
                            </Display>
                          ) : (
                            <FormField
                              name="startDate"
                              initValue={values.startDate}
                              values={values}
                              validator={validator}
                              setFieldValue={(field, value) => {
                                setFieldValue(field, value);
                                if (
                                  !manualSettings.dueDate &&
                                  values.dueDateBinding === START_DATE
                                ) {
                                  const { weeks, months, days } = values.dueDateInterval || {};
                                  setFieldValue(
                                    'dueDate',
                                    calculateDate({
                                      date: value,
                                      duration: findDuration({ weeks, months }),
                                      offset: weeks || months || days,
                                    })
                                  );
                                }
                              }}
                            >
                              {({ name, ...inputHandlers }) => (
                                <DateInputFactory
                                  name={name}
                                  {...inputHandlers}
                                  onBlur={evt => {
                                    inputHandlers.onBlur(evt);
                                    triggerAutoBinding({
                                      manualSettings,
                                      values,
                                      entity,
                                      hasCircleBindingError,
                                      task,
                                    });
                                  }}
                                  originalValue={originalValues[name]}
                                  editable={editable.startDate && manualSettings.startDate}
                                  hideTooltip={!manualSettings.startDate}
                                />
                              )}
                            </FormField>
                          )}

                          {!manualSettings.startDate ? (
                            <ObjectValue
                              value={{
                                autoDateField: values.startDateBinding,
                                dueDateBinding: values.dueDateBinding,
                                ...convertBindingToSelection(values.startDateInterval),
                                autoDateOffset: isBeforeStartDateBinding ? 'before' : 'after',
                              }}
                              onChange={({
                                autoDateField,
                                dueDateBinding,
                                autoDateOffset,
                                autoDateDuration,
                              }) => {
                                setFieldValue('startDateInterval', {
                                  [autoDateDuration.metric]:
                                    autoDateOffset === 'after'
                                      ? Math.abs(autoDateDuration.value)
                                      : -Math.abs(autoDateDuration.value),
                                });
                                emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
                                  selectedField: 'startDate',
                                  field: autoDateField,
                                  entityId: getByPath('entity.id', task),
                                  autoDateDuration: {
                                    ...autoDateDuration,
                                    value:
                                      autoDateOffset === 'after'
                                        ? Math.abs(autoDateDuration.value)
                                        : -Math.abs(autoDateDuration.value),
                                  },
                                  autoDateOffset,
                                  hasCircleBindingError:
                                    autoDateField === DUE_DATE && dueDateBinding === START_DATE,
                                });
                              }}
                            >
                              {({
                                value: { autoDateDuration, autoDateOffset, autoDateField },
                                set,
                              }) => (
                                <div className={AutoDateWrapperStyle}>
                                  <div className={AutoDateSyncIconStyle}>
                                    <Icon icon="SYNC" />
                                  </div>

                                  <div className={AutoDateOffsetWrapperStyle}>
                                    <FormField
                                      name="autoStateDateDuration"
                                      initValue={{
                                        ...autoDateDuration,
                                        value: Math.abs(autoDateDuration.value),
                                      }}
                                      setFieldValue={(field, value) =>
                                        set('autoDateDuration', value)
                                      }
                                      values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                    >
                                      {({ name, ...inputHandlers }) => (
                                        <MetricInputFactory
                                          name={name}
                                          metricType="duration"
                                          metricSelectWidth="60px"
                                          metricOptionWidth="65px"
                                          inputWidth="135px"
                                          {...inputHandlers}
                                          editable={editable.startDateBinding}
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>

                                    <FormField
                                      name="autoStartDateOffset"
                                      initValue={autoDateOffset}
                                      setFieldValue={(field, value) => {
                                        setIsBeforeStartDateBinding(value === 'before');
                                        set('autoDateOffset', value);
                                      }}
                                      saveOnChange
                                      values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                    >
                                      {({ ...inputHandlers }) => (
                                        <SelectInputFactory
                                          items={[
                                            {
                                              label: 'Before',
                                              value: 'before',
                                            },
                                            { label: 'After', value: 'after' },
                                          ]}
                                          inputWidth="55px"
                                          {...inputHandlers}
                                          editable={editable.startDateBinding}
                                          required
                                          hideDropdownArrow
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>
                                  </div>

                                  <FormField
                                    name="autoDateField"
                                    initValue={autoDateField}
                                    setFieldValue={(field, value) => {
                                      if (values.startDateBinding !== value) {
                                        set(field, value);
                                        setFieldValue('startDateBinding', value);
                                      }
                                    }}
                                    values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                    saveOnChange
                                  >
                                    {({ ...inputHandlers }) => (
                                      <SelectInputFactory
                                        {...inputHandlers}
                                        items={[
                                          ...defaultBindingOptions(intl, true),
                                          ...getFieldsByEntity(entity, intl),
                                        ]}
                                        editable={editable.startDate}
                                        required
                                        hideTooltip
                                      />
                                    )}
                                  </FormField>
                                </div>
                              )}
                            </ObjectValue>
                          ) : (
                            <Display color="GRAY_LIGHT" width="200px" height="30px">
                              {editable.startDateBinding ? (
                                <FormattedMessage
                                  id="modules.Tasks.chooseDataBinding"
                                  defaultMessage="Choose data to sync from"
                                />
                              ) : (
                                <FormattedMessage
                                  id="modules.Tasks.noEventBindingChosen"
                                  defaultMessage="No event binding chosen"
                                />
                              )}
                            </Display>
                          )}
                        </GridColumn>
                      }
                    />

                    <FormField
                      name="description"
                      initValue={values.description}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextAreaInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Tasks.description"
                              defaultMessage="DESCRIPTION"
                            />
                          }
                          inputHeight="100px"
                          inputWidth="200px"
                          inputAlign="right"
                          vertical={false}
                          editable={editable.description}
                        />
                      )}
                    </FormField>

                    <FieldItem
                      vertical
                      label={
                        <Label height="30px">
                          <FormattedMessage id="modules.Tasks.tags" defaultMessage="TAGS" />
                        </Label>
                      }
                      input={
                        <TagsInput
                          id="tags"
                          name="tags"
                          tagType="Task"
                          values={values.tags}
                          onChange={(field, value) => {
                            setFieldValue(field, value);
                          }}
                          editable={{
                            set: hasPermission(TAG_LIST) && editable.tags,
                            remove: editable.tags,
                          }}
                        />
                      }
                    />
                  </GridColumn>

                  <GridColumn>
                    {!hideParentInfo &&
                      getByPathWithDefault('', 'entity.__typename', task) === 'Order' && (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage id="modules.Tasks.order" defaultMessage="ORDER" />
                            </Label>
                          }
                          vertical
                          input={
                            <OrderCard
                              order={task.order}
                              onClick={() => {
                                if (canViewOrderForm) {
                                  navigate(`/order/${encodeId(task.order.id)}`);
                                }
                              }}
                            />
                          }
                        />
                      )}

                    {!hideParentInfo &&
                      getByPathWithDefault('', 'entity.__typename', task) === 'OrderItem' &&
                      (() => {
                        const { orderItem, productProvider, product, order } = spreadOrderItem(
                          task.orderItem
                        );

                        const viewable = {
                          price: hasPermission(ORDER_ITEMS_GET_PRICE),
                        };

                        const navigable = {
                          order: canViewOrderForm,
                          product: canViewProductForm,
                        };

                        const config = {
                          hideOrder: false,
                        };
                        return (
                          <FieldItem
                            label={
                              <Label>
                                <FormattedMessage id="modules.Tasks.item" defaultMessage="ITEM" />
                              </Label>
                            }
                            vertical
                            input={
                              <ItemCard
                                orderItem={orderItem}
                                productProvider={productProvider}
                                product={product}
                                order={order}
                                viewable={viewable}
                                navigable={navigable}
                                config={config}
                                onClick={() => navigate(`/order-item/${encodeId(orderItem.id)}`)}
                              />
                            }
                          />
                        );
                      })()}

                    {!hideParentInfo &&
                      getByPathWithDefault('', 'entity.__typename', task) === 'Product' && (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage
                                id="modules.Tasks.product"
                                defaultMessage="PRODUCT"
                              />
                            </Label>
                          }
                          vertical
                          input={
                            <PartnerPermissionsWrapper data={task.product}>
                              {permissions => (
                                <ProductCard
                                  product={task.product}
                                  onClick={() => {
                                    if (permissions.includes(PRODUCT_FORM)) {
                                      navigate(`/product/${encodeId(task.product.id)}`);
                                    }
                                  }}
                                />
                              )}
                            </PartnerPermissionsWrapper>
                          }
                        />
                      )}

                    {!hideParentInfo &&
                      getByPathWithDefault('', 'entity.__typename', task) === 'ProductProvider' && (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage
                                id="modules.Tasks.endProduct"
                                defaultMessage="END PRODUCT"
                              />
                            </Label>
                          }
                          vertical
                          input={
                            <OrderProductProviderCard
                              productProvider={task.productProvider}
                              onClick={() =>
                                navigate(`/product/${encodeId(task.productProvider.product.id)}`)
                              }
                            />
                          }
                        />
                      )}

                    {!hideParentInfo &&
                      getByPathWithDefault('', 'entity.__typename', task) === 'Batch' && (
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage id="modules.Tasks.batch" defaultMessage="BATCH" />
                            </Label>
                          }
                          vertical
                          input={
                            <BatchCard
                              batch={task.batch}
                              onClick={() => navigate(`/batch/${encodeId(task.batch.id)}`)}
                            />
                          }
                        />
                      )}

                    {!isInTemplate && !isInProject && (
                      <div>
                        <BooleanValue>
                          {({ value: opened, set: toggleSlide }) => (
                            <>
                              {values.milestone ? (
                                <div
                                  role="presentation"
                                  onClick={() => (editable.milestone ? toggleSlide(true) : null)}
                                >
                                  {(() => {
                                    let milestoneObj;
                                    if (isNotFound(values.milestone)) {
                                      milestoneObj = null;
                                    } else if (isForbidden(values.milestone)) {
                                      milestoneObj = {
                                        __typename: 'Forbidden',
                                        project: {
                                          __typename: 'Forbidden',
                                        },
                                      };
                                    } else {
                                      milestoneObj = values.milestone;
                                    }
                                    return (
                                      <GridColumn>
                                        <FieldItem
                                          label={
                                            <Label>
                                              <FormattedMessage
                                                id="modules.task.project"
                                                defaultMessage="PROJECT"
                                              />
                                            </Label>
                                          }
                                          input={
                                            <ProjectCard
                                              project={getByPath('project', milestoneObj)}
                                            />
                                          }
                                          vertical
                                        />
                                        <FieldItem
                                          label={
                                            <Label>
                                              <FormattedMessage
                                                id="modules.task.milestone"
                                                defaultMessage="MILESTONE"
                                              />
                                            </Label>
                                          }
                                          input={<MilestoneCard milestone={milestoneObj} />}
                                          vertical
                                        />
                                      </GridColumn>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <FieldItem
                                  label={
                                    <Label>
                                      <FormattedMessage
                                        id="modules.task.project"
                                        defaultMessage="PROJECT"
                                      />
                                    </Label>
                                  }
                                  input={
                                    <>
                                      {editable.milestone ? (
                                        <DashedPlusButton
                                          width="195px"
                                          height="463px"
                                          onClick={() => toggleSlide(true)}
                                        />
                                      ) : (
                                        <GrayCard width="195px" height="463px" />
                                      )}
                                    </>
                                  }
                                  vertical
                                />
                              )}
                              <SlideView isOpen={opened} onRequestClose={() => toggleSlide(false)}>
                                {opened && (
                                  <SelectProjectAndMilestone
                                    cacheKey="TaskInfoSectionSelectProjectAndMilestone"
                                    milestone={values.milestone}
                                    onSelect={newMilestone => {
                                      setFieldValues({
                                        milestone: newMilestone,
                                      });
                                      toggleSlide(false);
                                      triggerAutoBinding({
                                        manualSettings,
                                        values,
                                        entity,
                                        hasCircleBindingError,
                                        task,
                                      });
                                    }}
                                    onCancel={() => toggleSlide(false)}
                                  />
                                )}
                              </SlideView>
                            </>
                          )}
                        </BooleanValue>
                      </div>
                    )}
                  </GridColumn>
                </div>

                <div className={MemoWrapperStyle}>
                  {isInTemplate ? (
                    <FieldItem
                      vertical
                      label={
                        <Label>
                          <FormattedMessage id="modules.Tasks.memo" defaultMessage="MEMO" />
                        </Label>
                      }
                      input={
                        <Display color="GRAY_LIGHT">
                          <FormattedMessage
                            id="modules.Tasks.memoPlaceholder"
                            defaultMessage="Value will be entered here"
                          />
                        </Display>
                      }
                    />
                  ) : (
                    <FormField
                      name="memo"
                      initValue={values.memo}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextAreaInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={<FormattedMessage id="modules.Tasks.memo" defaultMessage="MEMO" />}
                          vertical
                          inputWidth="680px"
                          inputHeight="65px"
                          editable={editable.memo}
                        />
                      )}
                    </FormField>
                  )}
                </div>

                <div className={TaskStatusWrapperStyle}>
                  <div className={AssignedToStyle}>
                    <GridColumn gap="5px">
                      <UserAssignmentInputFactory
                        cacheKey="TaskUserSelect"
                        name="assignedTo"
                        label={
                          <FormattedMessage
                            id="modules.Tasks.assignedToComplete"
                            defaultMessage="ASSIGNED TO COMPLETE"
                          />
                        }
                        groupIds={groupIds}
                        values={values.assignedTo}
                        onChange={setFieldValue}
                        editable={editable.assignedTo}
                      />
                    </GridColumn>

                    <GridColumn gap="5px">
                      <Label height="30px" align="right">
                        <FormattedMessage id="modules.Tasks.status" defaultMessage="STATUS" />
                      </Label>

                      {isInTemplate ? (
                        <Display color="GRAY_LIGHT">
                          <FormattedMessage
                            id="modules.Tasks.statusDisabled"
                            defaultMessage="Status will be displayed here"
                          />
                        </Display>
                      ) : (
                        <TaskStatusInput
                          task={values}
                          update={newTask => setFieldValues(newTask)}
                          editable={editable}
                        />
                      )}
                    </GridColumn>
                  </div>

                  {(() => {
                    if (values.completedAt) {
                      return (
                        <FormField
                          name="completedAt"
                          initValue={values.completedAt}
                          values={values}
                          validator={validator}
                          setFieldValue={setFieldValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              required
                              originalValue={originalValues[name]}
                              label={
                                <FormattedMessage
                                  id="modules.Tasks.completedAt"
                                  defaultMessage="DATE COMPLETED"
                                />
                              }
                              editable={editable.completed}
                            />
                          )}
                        </FormField>
                      );
                    }
                    if (values.skippedAt) {
                      return (
                        <FormField
                          name="skippedAt"
                          initValue={values.skippedAt}
                          values={values}
                          validator={validator}
                          setFieldValue={setFieldValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              required
                              originalValue={originalValues[name]}
                              label={
                                <FormattedMessage
                                  id="modules.Tasks.skippedAt"
                                  defaultMessage="DATE SKIPPED"
                                />
                              }
                              editable={editable.skipped}
                            />
                          )}
                        </FormField>
                      );
                    }
                    if (values.inProgressAt) {
                      return (
                        <FormField
                          name="inProgressAt"
                          initValue={values.inProgressAt}
                          values={values}
                          validator={validator}
                          setFieldValue={setFieldValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              required
                              originalValue={originalValues[name]}
                              label={
                                <FormattedMessage
                                  id="modules.Tasks.inProgressAt"
                                  defaultMessage="DATE INPROGRESS"
                                />
                              }
                              editable={editable.inProgress}
                            />
                          )}
                        </FormField>
                      );
                    }
                    return null;
                  })()}

                  <Divider />

                  <div className={ApprovalToggleWrapperStyle}>
                    <Icon icon="CONFIRM" />
                    <Label align="right" width="min-content">
                      <FormattedMessage id="modules.Tasks.approval" defaultMessage="APPROVAL" />
                    </Label>
                    <ToggleInput
                      toggled={values.approvable}
                      onToggle={() => {
                        if (values.approvable) {
                          setFieldValues({
                            approvedBy: null,
                            approvedAt: null,
                            rejectedBy: null,
                            rejectedAt: null,
                            approvers: [],
                          });
                        }
                        setFieldValue('approvable', !values.approvable);
                        setFieldTouched('approvable');
                      }}
                      editable={editable.approvable}
                    />
                  </div>

                  {values.approvable && (
                    <UserConsumer>
                      {({ user }) => (
                        <>
                          <div className={AssignedToStyle}>
                            <GridColumn gap="5px">
                              <UserAssignmentInputFactory
                                cacheKey="TaskUserSelect"
                                name="approvers"
                                label={
                                  <FormattedMessage
                                    id="modules.Tasks.assignedToApprove"
                                    defaultMessage="ASSIGNED TO APPROVE"
                                  />
                                }
                                groupIds={groupIds}
                                values={values.approvers}
                                onChange={setFieldValue}
                                editable={editable.approvers}
                              />
                            </GridColumn>

                            <GridColumn gap="5px">
                              <Label height="30px" align="right">
                                <FormattedMessage
                                  id="modules.Tasks.approval"
                                  defaultMessage="APPROVAL"
                                />
                              </Label>

                              {isInTemplate ? (
                                <Display color="GRAY_LIGHT">
                                  <FormattedMessage
                                    id="modules.Tasks.approvalDisabled"
                                    defaultMessage="Approval will be displayed here"
                                  />
                                </Display>
                              ) : (
                                <>
                                  {isUnapproved ? (
                                    <BooleanValue defaultValue={false}>
                                      {({ value: showMenu, set: toggleShowMenu }) =>
                                        showMenu ? (
                                          <ApproveRejectMenu
                                            width="200px"
                                            onApprove={() => {
                                              setFieldValues({
                                                approvedBy: user,
                                                approvedAt: formatToGraphql(new Date()),
                                                rejectedBy: null,
                                                rejectedAt: null,
                                              });
                                              setFieldTouched('approvedBy');
                                              setFieldTouched('approvedAt');
                                            }}
                                            onReject={() => {
                                              setFieldValues({
                                                approvedBy: null,
                                                approvedAt: null,
                                                rejectedBy: user,
                                                rejectedAt: formatToGraphql(new Date()),
                                              });
                                              setFieldTouched('rejectedBy');
                                              setFieldTouched('rejectedAt');
                                            }}
                                          />
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={evt => {
                                              if (editable.approved && editable.rejected) {
                                                evt.stopPropagation();
                                                toggleShowMenu(true);
                                              }
                                            }}
                                            className={UnapprovedButtonStyle(
                                              editable.approved && editable.rejected
                                            )}
                                          >
                                            <FormattedMessage
                                              id="modules.Tasks.unapproved"
                                              defaultMessage="UNAPPROVED"
                                            />
                                          </button>
                                        )
                                      }
                                    </BooleanValue>
                                  ) : (
                                    <TaskApprovalStatusInput
                                      showUser
                                      editable={editable.approved && editable.rejected}
                                      onClickUser={() => {
                                        setFieldValues({
                                          approvedBy: null,
                                          approvedAt: null,
                                          rejectedBy: null,
                                          rejectedAt: null,
                                        });
                                      }}
                                      approval={
                                        values.approvedBy && values.approvedBy.id
                                          ? {
                                              approvedAt: values.approvedAt,
                                              approvedBy: values.approvedBy,
                                            }
                                          : null
                                      }
                                      rejection={
                                        values.rejectedBy && values.rejectedBy.id
                                          ? {
                                              rejectedBy: values.rejectedBy,
                                              rejectedAt: values.rejectedAt,
                                            }
                                          : null
                                      }
                                    />
                                  )}
                                </>
                              )}
                            </GridColumn>
                          </div>

                          {values.approvedBy && values.approvedBy.id && (
                            <FormField
                              name="approvedAt"
                              initValue={values.approvedAt}
                              values={values}
                              validator={validator}
                              setFieldValue={setFieldValue}
                            >
                              {({ name, ...inputHandlers }) => (
                                <DateInputFactory
                                  name={name}
                                  required
                                  {...inputHandlers}
                                  originalValue={originalValues[name]}
                                  label={
                                    <FormattedMessage
                                      id="modules.Tasks.approvedDate"
                                      defaultMessage="APPROVED DATE"
                                    />
                                  }
                                  editable={editable.approved}
                                />
                              )}
                            </FormField>
                          )}
                          {values.rejectedBy && values.rejectedBy.id && (
                            <FormField
                              name="rejectedAt"
                              initValue={values.rejectedAt}
                              values={values}
                              validator={validator}
                              setFieldValue={setFieldValue}
                            >
                              {({ name, ...inputHandlers }) => (
                                <DateInputFactory
                                  name={name}
                                  required
                                  {...inputHandlers}
                                  originalValue={originalValues[name]}
                                  label={
                                    <FormattedMessage
                                      id="modules.Tasks.rejectedDate"
                                      defaultMessage="REJECTED DATE"
                                    />
                                  }
                                  editable={editable.rejected}
                                />
                              )}
                            </FormField>
                          )}
                        </>
                      )}
                    </UserConsumer>
                  )}
                </div>
              </div>
            );
          }}
        </Subscribe>
      </SectionWrapper>
    </div>
  );
};

export default injectIntl(TaskInfoSection);
