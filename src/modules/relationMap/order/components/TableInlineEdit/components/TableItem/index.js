// @flow
import * as React from 'react';
import { FormField } from 'modules/form';
import { getByPath } from 'utils/fp';
import TableDisableCell from '../TableDisableCell';
import { WrapperStyle, ItemStyle } from './style';
import {
  InlineTextInput,
  InlineNumberInput,
  InlineNumberAdjustmentInput,
  InlineDateInput,
  InlineSearchEnumInput,
  InlineInChargeInput,
  InlineTagInput,
  InlineProductProvider,
  InlineMetricInput,
  InlineForwarderInput,
  InlineTimeLineInput,
  InlineDateTimeApprovalInput,
  InlineWarehouse,
  AutoCalculate,
} from './components';

type OptionalProps = {
  columnNo: number,
};
type Props = OptionalProps & {
  cell: string,
  rowNo: number,
  fields: Array<{
    name: string,
    type: string,
    meta?: Object,
    getFieldValue?: Function,
    getFieldName?: Function,
  }>,
  values: ?Object,
  validator: Object,
  editData: Object,
};

const defaultProps = {
  columnNo: 0,
};

function renderItem({
  id,
  type,
  value,
  name,
  meta,
  values,
  editData,
}: {
  id: string,
  value: any,
  type: string,
  name: string,
  values: Object,
  editData: Object,
  meta?: Object,
}) {
  switch (type) {
    case 'number':
      return <InlineNumberInput name={name} value={value} {...meta} id={id} />;

    case 'calculate':
      return <AutoCalculate values={values} editData={editData} {...meta} id={id} />;

    case 'numberAdjustment': {
      const totalAdjustment = getByPath('totalAdjusted', values) || 0;

      return (
        <InlineNumberAdjustmentInput
          name={name}
          value={value}
          {...meta}
          adjustment={totalAdjustment}
          id={id}
        />
      );
    }

    case 'date':
      return <InlineDateInput name={name} value={value} {...meta} id={id} />;

    case 'timeline': {
      if (!value) return <TableDisableCell />;
      return <InlineTimeLineInput name={name} value={value} {...meta} id={id} />;
    }

    case 'datetimeWithApproval': {
      return <InlineDateTimeApprovalInput name={name} value={value} {...meta} id={id} />;
    }

    case 'metric':
      return <InlineMetricInput name={name} value={value} values={values} {...meta} id={id} />;

    case 'enum':
      return <InlineSearchEnumInput name={name} value={value} {...meta} id={id} />;

    case 'inCharges':
      return <InlineInChargeInput name={name} values={value} {...meta} id={id} />;

    case 'forwarders':
      return <InlineForwarderInput name={name} values={value} {...meta} id={id} />;

    case 'tags':
      return <InlineTagInput name={name} values={value} {...meta} id={id} />;

    case 'productProvider':
      return (
        <InlineProductProvider
          name={name}
          value={value}
          exporter={value.exporter.id}
          {...meta}
          id={id}
        />
      );

    case 'warehouse':
      return <InlineWarehouse name={name} value={value} {...meta} id={id} />;

    default:
      return <InlineTextInput id={id} name={name} value={value} {...meta} />;
  }
}

function TableItem({ cell, fields, values, editData, validator, rowNo, columnNo }: Props) {
  if (!values) return null;

  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type, meta, getFieldValue, getFieldName }, fieldCounter) => {
        const value = getFieldValue ? getFieldValue(values, editData) : getByPath(name, values);
        const fieldName = getFieldName ? getFieldName(values) : name;
        const cellName = `${cell}.${fieldName}`;
        const id = `${rowNo}-${fieldCounter + columnNo + 1}`;
        return (
          <div className={ItemStyle} key={name}>
            <FormField name={cellName} initValue={value} validator={validator} values={values}>
              {() =>
                renderItem({
                  id,
                  name: cellName,
                  type,
                  meta,
                  value,
                  values,
                  editData,
                })
              }
            </FormField>
          </div>
        );
      })}
    </div>
  );
}

TableItem.defaultProps = defaultProps;

export default TableItem;
