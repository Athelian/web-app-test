// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import { FormField } from 'modules/form';
import { textInputFactory, numberInputFactory } from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import { DefaultWeightStyle, DefaultVolumeStyle, DefaultDimensionStyle } from 'components/Form';
import { getByPath } from 'utils/fp';
import { PackagingSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const PackagingSection = ({ isNew }: Props) => (
  <div className={PackagingSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue }) => {
        // $FlowFixMe
        const values = { ...originalValues, ...state };

        return (
          <GridColumn>
            <FormField
              name="packageName"
              initValue={values.packageName}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                textInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.batch.packageName"
                      defaultMessage="PACKAGE NAME"
                    />
                  ),
                })
              }
            </FormField>

            <FormField
              name="packageQuantity"
              initValue={values.packageQuantity}
              setFieldValue={setFieldValue}
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: originalValues[name],
                  label: (
                    <FormattedMessage
                      id="modules.batch.packageQuantity"
                      defaultMessage="PACKAGE QUANTITY"
                    />
                  ),
                  calculate: () => console.log('calculate packageQuantity '),
                })
              }
            </FormField>

            <FormField
              name="packageGrossWeight.value"
              initValue={getByPath('packageGrossWeight.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageGrossWeight', { value, metric: 'kg' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageGrossWeight.value', originalValues),
                  label: (
                    <FormattedMessage
                      id="modules.batch.pkgGrossWeight"
                      defaultMessage="PKG GROSS WEIGHT"
                    />
                  ),
                  WrapperComponent: DefaultWeightStyle,
                })
              }
            </FormField>

            <FormField
              name="packageVolume.value"
              initValue={getByPath('packageVolume.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageVolume', { value, metric: 'm³' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageVolume.value', originalValues),
                  label: (
                    <FormattedMessage id="modules.batch.pkgVolume" defaultMessage="PKG VOLUME" />
                  ),
                  WrapperComponent: DefaultVolumeStyle,
                  calculate: () => console.log('calculate package volume '),
                })
              }
            </FormField>

            <FormField
              name="packageSize.length.value"
              initValue={getByPath('packageSize.length.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageSize.length', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.length.value', originalValues),
                  label: (
                    <FormattedMessage id="modules.batch.pkgLength" defaultMessage="PKG LENGTH" />
                  ),
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="packageSize.width.value"
              initValue={getByPath('packageSize.width.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageSize.width', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.width.value', originalValues),
                  label: (
                    <FormattedMessage id="modules.batch.pkgWidth" defaultMessage="PKG WIDTH" />
                  ),
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>

            <FormField
              name="packageSize.height.value"
              initValue={getByPath('packageSize.height.value', values)}
              setFieldValue={(field, value) =>
                setFieldArrayValue('packageSize.height', { value, metric: 'cm' })
              }
            >
              {({ name, ...inputHandlers }) =>
                numberInputFactory({
                  name,
                  inputHandlers,
                  isNew,
                  originalValue: getByPath('packageSize.height.value', originalValues),
                  label: (
                    <FormattedMessage id="modules.batch.pkgHeight" defaultMessage="PKG HEIGHT" />
                  ),
                  WrapperComponent: DefaultDimensionStyle,
                })
              }
            </FormField>
          </GridColumn>
        );
      }}
    </Subscribe>
  </div>
);

export default PackagingSection;
