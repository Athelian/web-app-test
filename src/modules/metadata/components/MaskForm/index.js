// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ContentWrapper from 'components/ContentWrapper';
import { SectionHeader, SectionWrapper } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import { textInputFactory, textAreaFactory } from 'modules/form/helpers';
import validator from 'modules/metadata/components/MaskFormWrapper/validator';
import FieldDefinitionContainer from 'modules/metadata/container';
import MaskContainer from 'modules/metadata/components/MaskForm/container';
import FieldItem from './components/FieldItem';
import { TemplateFormWrapperStyle, FormFieldsStyle, DescriptionLabelWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  onFormReady: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  onFormReady: () => {},
};

class MaskForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  render() {
    const { isNew } = this.props;

    return (
      <Subscribe to={[MaskContainer, FieldDefinitionContainer]}>
        {({ originalValues, state, setFieldValue }, { originalValues: { fieldDefinitions } }) => {
          const values = { ...originalValues, ...state };
          return (
            <div className={TemplateFormWrapperStyle}>
              <SectionWrapper id="templateSection">
                <SectionHeader
                  icon="TEMPLATE"
                  title={
                    <FormattedMessage id="modules.metadata.template" defaultMessage="TEMPLATE" />
                  }
                />
                <ContentWrapper width="880px" className={FormFieldsStyle}>
                  <GridColumn>
                    <FormField
                      name="name"
                      initValue={values.name}
                      validator={validator}
                      values={values}
                      setFieldValue={setFieldValue}
                    >
                      {({ name: fieldName, ...inputHandlers }) =>
                        textInputFactory({
                          label: (
                            <FormattedMessage
                              id="modules.metadata.templateName"
                              defaultMessage="TEMPLATE NAME"
                            />
                          ),
                          required: true,
                          isNew,
                          name: fieldName,
                          inputHandlers,
                          originalValue: originalValues.name,
                        })
                      }
                    </FormField>

                    <FormField
                      name="memo"
                      initValue={values.memo}
                      validator={validator}
                      values={values}
                      setFieldValue={setFieldValue}
                    >
                      {({ name: fieldName, ...inputHandlers }) =>
                        textAreaFactory({
                          label: (
                            <div className={DescriptionLabelWrapperStyle}>
                              <FormattedMessage
                                id="modules.metadata.description"
                                defaultMessage="DESCRIPTION"
                              />
                            </div>
                          ),
                          isNew,
                          height: '100px',
                          align: 'right',
                          name: fieldName,
                          inputHandlers,
                          originalValue: originalValues.memo,
                        })
                      }
                    </FormField>
                  </GridColumn>
                </ContentWrapper>
              </SectionWrapper>
              <SectionWrapper id="customFieldsSection">
                <SectionHeader
                  icon="METADATA"
                  title={
                    <FormattedMessage
                      id="modules.metadata.customFieldsSection"
                      defaultMessage="CUSTOM FIELDS"
                    />
                  }
                />
                <ContentWrapper width="880px" className={FormFieldsStyle}>
                  <div>
                    {fieldDefinitions.map(fieldDefinition => (
                      <FieldItem
                        key={fieldDefinition.id}
                        checked={values.fieldDefinitionIDs.includes(fieldDefinition.id)}
                        item={fieldDefinition}
                        onClick={() => {
                          if (values.fieldDefinitionIDs.includes(fieldDefinition.id)) {
                            setFieldValue(
                              'fieldDefinitionIDs',
                              values.fieldDefinitionIDs.filter(item => item !== fieldDefinition.id)
                            );
                          } else {
                            setFieldValue('fieldDefinitionIDs', [
                              ...values.fieldDefinitionIDs,
                              fieldDefinition.id,
                            ]);
                          }
                        }}
                      />
                    ))}
                  </div>
                </ContentWrapper>
              </SectionWrapper>
            </div>
          );
        }}
      </Subscribe>
    );
  }
}

export default MaskForm;
