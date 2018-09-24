// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { FormField } from 'modules/form';
import { textInputFactory, dateInputFactory, selectEnumInputFactory } from 'modules/form/helpers';
import {
  ShipmentInfoContainer,
  ShipmentTransportTypeContainer,
  ShipmentBatchesContainer,
  ShipmentTagsContainer,
} from 'modules/shipment/form/containers';
import validator from 'modules/shipment/form/validator';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, Tooltip, TagsInput } from 'components/Form';
import messages from 'modules/shipment/messages';
import SelectForwarders from '../SelectForwarders';
import { getUniqueExporters, renderExporters, renderForwarders } from './helpers';
import {
  ShipmentSectionWrapperStyle,
  MainFieldsWrapperStyle,
  TagsInputStyle,
  ExporterLabelStyle,
  ExporterSeeMoreButtonStyle,
  DividerStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const ShipmentSection = ({ isNew }: Props) => (
  <Subscribe to={[ShipmentInfoContainer]}>
    {({ originalValues: initialValues, state, setFieldValue }) => {
      const values: Object = { ...initialValues, ...state };
      const { forwarders = [] } = values;

      return (
        <div className={ShipmentSectionWrapperStyle}>
          <div className={MainFieldsWrapperStyle}>
            <GridColumn>
              <FormField
                name="no"
                initValue={values.no}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    required: true,
                    initValue: initialValues[name],
                    label: <FormattedMessage {...messages.shipmentId} />,
                  })
                }
              </FormField>
              <FormField
                name="blNo"
                initValue={values.blNo}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    initValue: initialValues[name],
                    label: <FormattedMessage {...messages.blNo} />,
                  })
                }
              </FormField>
              <FormField
                name="blDate"
                initValue={values.blDate}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  dateInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    initValue: initialValues[name],
                    label: <FormattedMessage {...messages.blDate} />,
                  })
                }
              </FormField>
              <FormField
                name="bookingNo"
                initValue={values.bookingNo}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    initValue: initialValues[name],
                    label: <FormattedMessage {...messages.bookingNo} />,
                  })
                }
              </FormField>
              <FormField
                name="bookingDate"
                initValue={values.bookingDate}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  dateInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    initValue: initialValues[name],
                    label: <FormattedMessage {...messages.bookingDate} />,
                  })
                }
              </FormField>
              <FormField
                name="invoiceNo"
                initValue={values.invoiceNo}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    initValue: initialValues[name],
                    label: <FormattedMessage {...messages.invoiceNo} />,
                  })
                }
              </FormField>

              <Subscribe to={[ShipmentTransportTypeContainer]}>
                {({
                  originalValues: initialTransportTypeValues,
                  state: transportTypeState,
                  setFieldValue: transportTypeSetFieldValue,
                }) => {
                  const transportTypeValues = {
                    ...initialTransportTypeValues,
                    ...transportTypeState,
                  };
                  return (
                    <FormField
                      name="transportType"
                      initValue={values.transportType}
                      setFieldValue={transportTypeSetFieldValue}
                      values={values}
                      validator={validator}
                      saveOnChange
                    >
                      {({ name, ...inputHandlers }) =>
                        selectEnumInputFactory({
                          enumType: 'TransportType',
                          align: 'right',
                          label: 'TRANSPORTATION',
                          initValue: transportTypeValues[name],
                          inputHandlers,
                          name,
                          isNew,
                        })
                      }
                    </FormField>
                  );
                }}
              </Subscribe>

              <FormField
                name="loadType"
                initValue={values.loadType}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
                saveOnChange
              >
                {({ name, ...inputHandlers }) =>
                  selectEnumInputFactory({
                    enumType: 'LoadType',
                    align: 'right',
                    label: 'LOAD TYPE',
                    initValue: initialValues[name],
                    inputHandlers,
                    name,
                    isNew,
                  })
                }
              </FormField>
              <FormField
                name="carrier"
                initValue={values.carrier}
                setFieldValue={setFieldValue}
                values={values}
                validator={validator}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    initValue: initialValues[name],
                    label: <FormattedMessage {...messages.carrier} />,
                  })
                }
              </FormField>
            </GridColumn>

            <GridColumn>
              <BooleanValue>
                {({ value: opened, toggle }) => (
                  <>
                    <div onClick={toggle} role="presentation">
                      <FieldItem
                        vertical
                        label={<Label>FORWARDER ({forwarders.length})</Label>}
                        tooltip={<Tooltip infoMessage="You can choose up to 4 Forwarders." />}
                        input={renderForwarders(forwarders)}
                      />
                    </div>
                    <SlideView
                      isOpen={opened}
                      onRequestClose={toggle}
                      options={{ width: '1030px' }}
                    >
                      {opened && (
                        <SelectForwarders
                          selected={values.forwarders}
                          onCancel={toggle}
                          onSelect={newValue => {
                            const selectedForwarders = newValue.map(item => ({
                              id: item.group.id,
                              name: item.name || item.group.name,
                            }));
                            toggle();
                            setFieldValue('forwarders', selectedForwarders);
                          }}
                        />
                      )}
                    </SlideView>
                  </>
                )}
              </BooleanValue>
              <Subscribe to={[ShipmentBatchesContainer]}>
                {({ state: { batches } }) => {
                  const uniqueExporters = getUniqueExporters(batches);
                  return (
                    <FieldItem
                      vertical
                      label={
                        <div className={ExporterLabelStyle}>
                          <Label>EXPORTER ({uniqueExporters.length})</Label>
                          {uniqueExporters.length > 4 && (
                            <button className={ExporterSeeMoreButtonStyle} type="button">
                              <Icon icon="HORIZONTAL_ELLIPSIS" />
                            </button>
                          )}
                        </div>
                      }
                      tooltip={
                        <Tooltip infoMessage="Exporters are automatically shown based off of the Batches chosen for the Cargo of this Shipment." />
                      }
                      input={renderExporters(uniqueExporters)}
                    />
                  );
                }}
              </Subscribe>
            </GridColumn>
          </div>
          <div className={TagsInputStyle}>
            <Subscribe to={[ShipmentTagsContainer]}>
              {({ state: { tags }, setFieldValue: changeTags }) => (
                <FieldItem
                  vertical
                  label={
                    <Label>
                      <FormattedMessage {...messages.tags} />
                    </Label>
                  }
                  input={
                    <TagsInput
                      editable={isNew}
                      id="tags"
                      name="tags"
                      tagType="Shipment"
                      values={tags}
                      onChange={(field, value) => {
                        changeTags(field, value);
                      }}
                    />
                  }
                />
              )}
            </Subscribe>

            <div className={DividerStyle} />
          </div>
        </div>
      );
    }}
  </Subscribe>
);

export default ShipmentSection;
