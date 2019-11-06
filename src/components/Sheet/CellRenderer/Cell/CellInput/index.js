// @flow
import * as React from 'react';
import { equals } from 'ramda';
import TextInput from './Inputs/TextInput';
import TextAreaInput from './Inputs/TextAreaInput';
import ApprovalInput from './Inputs/ApprovalInput';
import NumberInput from './Inputs/NumberInput';
import NumberToggleInput from './Inputs/NumberToggleInput';
import DateInput from './Inputs/DateInput';
import DateToggleInput from './Inputs/DateToggleInput';
import DatetimeInput from './Inputs/DatetimeInput';
import DayInput from './Inputs/DayInput';
import SelectCustomInput from './Inputs/SelectCustomInput';
import SelectEnumInput from './Inputs/SelectEnumInput';
import SearchSelectEnumInput from './Inputs/SearchSelectEnumInput';
import MetricValueInput from './Inputs/MetricValueInput';
import MetricValueToggleInput from './Inputs/MetricValueToggleInput';
import StaticMetricValueInput from './Inputs/StaticMetricValueInput';
import SizeInput from './Inputs/SizeInput';
import DocumentsInput from './Inputs/DocumentsInput';
import QuantityRevisionsInput from './Inputs/QuantityRevisionsInput';
import DateRevisionsInput from './Inputs/DateRevisionsInput';
import StatusInput from './Inputs/StatusInput';
import TagsInput from './Inputs/TagsInput';
import UserAssignmentInput from './Inputs/UserAssignmentInput';
import PortInput from './Inputs/PortInput';
import PartnerSelectorInput from './Inputs/PartnerSelectorInput';
import PartnersSelectorInput from './Inputs/PartnersSelectorInput';
import WarehouseSelectorInput from './Inputs/WarehouseSelectorInput';
import ToggleInput from './Inputs/ToggleInput';
import LogsInput from './Inputs/LogsInput';
import TasksInput from './Inputs/TasksInput';

type Props = {
  value: any,
  context: any,
  extra: any,
  type: string,
  inputFocus: boolean,
  disabled: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onUp: () => void,
  onDown: () => void,
  onUpdate: any => void,
};

const inputs = {
  approval: ApprovalInput,
  text: TextInput,
  textarea: TextAreaInput,
  number: NumberInput,
  number_toggle: NumberToggleInput,
  volume: MetricValueInput.Volume,
  area: MetricValueInput.Area,
  length: MetricValueInput.Length,
  mass: MetricValueInput.Mass,
  size: SizeInput,
  volume_toggle: MetricValueToggleInput.Volume,
  area_toggle: MetricValueToggleInput.Area,
  length_toggle: MetricValueToggleInput.Length,
  mass_toggle: MetricValueToggleInput.Mass,
  static_metric_value: StaticMetricValueInput,
  date: DateInput,
  date_toggle: DateToggleInput,
  datetime: DatetimeInput,
  day: DayInput,
  load_type: SelectEnumInput.LoadType,
  transport_type: SelectEnumInput.TransportType,
  incoterm: SearchSelectEnumInput.Incoterm,
  currency: SearchSelectEnumInput.Currency,
  container_type: SelectCustomInput.ContainerType,
  container_option: SelectEnumInput.ContainerOption,
  order_documents: DocumentsInput.Order,
  order_item_documents: DocumentsInput.OrderItem,
  shipment_documents: DocumentsInput.Shipment,
  quantity_revisions: QuantityRevisionsInput,
  date_revisions: DateRevisionsInput,
  status: StatusInput,
  product_tags: TagsInput.Product,
  order_tags: TagsInput.Order,
  order_item_tags: TagsInput.OrderItem,
  batch_tags: TagsInput.Batch,
  shipment_tags: TagsInput.Shipment,
  container_tags: TagsInput.Container,
  user_tags: TagsInput.User,
  task_tags: TagsInput.Task,
  project_tags: TagsInput.Project,
  user_assignment: UserAssignmentInput,
  port: PortInput,
  exporter: PartnerSelectorInput.Exporter,
  forwarders: PartnersSelectorInput.Forwarders,
  warehouse: WarehouseSelectorInput,
  booked: ToggleInput.Booked,
  order_logs: LogsInput.Order,
  order_item_logs: LogsInput.OrderItem,
  batch_logs: LogsInput.Batch,
  shipment_logs: LogsInput.Shipment,
  container_logs: LogsInput.Container,
  order_tasks: TasksInput.Order,
  order_item_tasks: TasksInput.OrderItem,
  batch_tasks: TasksInput.Batch,
  shipment_tasks: TasksInput.Shipment,
};

const CellInput = ({
  value,
  context,
  extra,
  type,
  inputFocus,
  disabled,
  onFocus,
  onBlur,
  onUp,
  onDown,
  onUpdate,
}: Props) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [dirtyValue, setDirtyValue] = React.useState<any>(value);
  const valueRef = React.useRef<any>(value);

  if (valueRef.current !== value) {
    valueRef.current = value;
    setDirtyValue(value);
  }

  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (inputFocus) {
      const focusableElement = containerRef.current.querySelector(
        [
          'input:not([disabled]):not([tabindex="-1"])',
          'button:not([disabled]):not([tabindex="-1"])',
          '[tabindex]:not([disabled]):not([tabindex="-1"])',
        ].join(',')
      );
      if (focusableElement) {
        focusableElement.focus({
          preventScroll: true,
        });

        if (
          focusableElement instanceof HTMLInputElement &&
          (focusableElement.type === 'text' || focusableElement.type === 'number')
        ) {
          focusableElement.select();
        }
      }
    } else {
      containerRef.current.focus({
        preventScroll: true,
      });
    }
  }, [inputFocus]);

  const handleChange = (newValue, force = false) => {
    if (force || !equals(newValue, dirtyValue)) {
      setDirtyValue(newValue);

      if (force || !inputFocus) {
        onUpdate(newValue);
      }
    }
  };

  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (
      !containerRef.current ||
      (e.relatedTarget instanceof Node && containerRef.current.contains(e.relatedTarget))
    ) {
      return;
    }

    onBlur();

    if (equals(dirtyValue, value)) {
      return;
    }

    onUpdate(dirtyValue);
  };

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowRight':
      case 'ArrowLeft':
        e.stopPropagation();
        break;
      case 'Tab': {
        if (containerRef.current) {
          const focusableElements = Array.from(
            containerRef.current.querySelectorAll(
              [
                'input:not([disabled]):not([tabindex="-1"])',
                'button:not([disabled]):not([tabindex="-1"])',
                '[tabindex]:not([disabled]):not([tabindex="-1"])',
              ].join(',')
            )
          );
          const index = focusableElements.indexOf(document.activeElement);
          /**
           * If on tab event and the current focused element is the last one in the cell,
           * or on shift+tab event and the current focused element is the first one in the cell,
           * we prevent to focus some other element outside of the cell.
           * So we let the sheet navigation control to focus the next cell instead.
           */
          if (
            (e.shiftKey && index === 0) ||
            (!e.shiftKey && focusableElements.length - 1 === index)
          ) {
            e.preventDefault();
          } else {
            e.stopPropagation();
          }
        }
        break;
      }
      case 'Enter':
        e.stopPropagation();
        onBlur();

        if (e.shiftKey) {
          onUp();
        } else {
          onDown();
        }
        break;
      default:
        break;
    }
  };

  if (!inputs[type]) {
    throw new Error(`Cell input type of '${type}' doesn't not exist`);
  }

  return (
    <div
      ref={containerRef}
      role="presentation"
      onFocus={onFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {React.createElement(inputs[type], {
        value: dirtyValue,
        context,
        extra,
        readonly: disabled,
        focus: inputFocus,
        forceFocus: onFocus,
        forceBlur: onBlur,
        onChange: handleChange,
      })}
    </div>
  );
};

export default CellInput;
