// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { contains } from 'utils/fp';
import { BooleanValue } from 'react-values';
import { TemplateCard, GrayCard } from 'components/Cards';
import Divider from 'components/Divider';
import FormattedNumber from 'components/FormattedNumber';
import Layout from 'components/Layout';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import JumpToSection from 'components/JumpToSection';
import SlideView from 'components/SlideView';
import GridColumn from 'components/GridColumn';
import { DefaultCustomFieldStyle } from 'components/Form/Inputs/Styles';
import { SectionHeader, SectionWrapper, Label, DashedPlusButton, FieldItem } from 'components/Form';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import CustomFieldsContainer from 'components/Form/Factories/CustomFieldsFactory/container';
import CustomFieldsTemplateSelector from 'components/Form/Factories/CustomFieldsFactory/CustomFieldsTemplateSelector';
import { CustomFieldsFormWrapperStyle, CustomFieldsSectionWrapperStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
  onCancel: Function,
  onSave: Function,
  editable: {
    values: boolean,
    mask: boolean,
  },
};

type Props = OptionalProps & {
  entityType: string,
};

const defaultProps = {
  onFormReady: () => {},
  onCancel: () => {},
  onSave: () => {},
  editable: {
    values: false,
    mask: false,
  },
};

class CustomFieldsForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { entityType, onCancel, onSave, editable } = this.props;

    return (
      <Subscribe to={[CustomFieldsContainer]}>
        {({ originalValues, state, setFieldValue, isDirty }) => {
          const values = { ...originalValues, ...state };
          const { mask, fieldValues } = values;
          return (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="METADATA" color="METADATA" />
                  <JumpToSection>
                    <SectionTabs
                      link="metadataSection"
                      label={
                        <FormattedMessage
                          id="modules.metadata.sectionHeader"
                          defaultMessage="CUSTOM FIELDS"
                        />
                      }
                      icon="METADATA"
                    />
                  </JumpToSection>
                  {isDirty() && (
                    <>
                      <CancelButton onClick={onCancel} />
                      <SaveButton onClick={() => onSave(values)} />
                    </>
                  )}
                </SlideViewNavBar>
              }
            >
              <div className={CustomFieldsFormWrapperStyle}>
                <SectionWrapper id="metadataSection">
                  <SectionHeader
                    icon="METADATA"
                    title={
                      <>
                        <FormattedMessage
                          id="module.metadata.sectionHeader"
                          defaultMessage="CUSTOM FIELDS"
                        />
                        {' ('}
                        <FormattedNumber value={fieldValues.length} />
                        {')'}
                      </>
                    }
                  />
                  <div className={CustomFieldsSectionWrapperStyle}>
                    <FieldItem
                      vertical
                      label={
                        <Label>
                          <FormattedMessage id="modules.form.template" defaultMessage="TEMPLATE" />
                        </Label>
                      }
                      input={
                        editable.mask ? (
                          <BooleanValue>
                            {({ value: opened, set: slideToggle }) => (
                              <>
                                {mask ? (
                                  <TemplateCard
                                    template={{
                                      id: mask.id,
                                      title: mask.name,
                                      description: mask.memo,
                                      count: (mask.fieldDefinitions || []).length,
                                    }}
                                    type="METADATA"
                                    onClick={editable ? () => slideToggle(true) : () => {}}
                                  />
                                ) : (
                                  <DashedPlusButton
                                    width="195px"
                                    height="140px"
                                    onClick={() => slideToggle(true)}
                                  />
                                )}
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => slideToggle(false)}
                                  options={{ width: '980px' }}
                                >
                                  {opened && (
                                    <CustomFieldsTemplateSelector
                                      entityType={entityType}
                                      selected={mask}
                                      onCancel={() => slideToggle(false)}
                                      onSave={item => {
                                        setFieldValue('mask', item);
                                        slideToggle(false);
                                      }}
                                    />
                                  )}
                                </SlideView>
                              </>
                            )}
                          </BooleanValue>
                        ) : (
                          <>
                            {mask ? (
                              <TemplateCard
                                template={{
                                  id: mask.id,
                                  title: mask.name,
                                  description: mask.memo,
                                  count: (mask.fieldDefinitions || []).length,
                                }}
                                type="METADATA"
                                readOnly
                              />
                            ) : (
                              <GrayCard width="195px" height="140px" />
                            )}
                          </>
                        )
                      }
                    />

                    <Divider />
                    <GridColumn gap="10px">
                      {fieldValues &&
                        fieldValues.map(({ value, fieldDefinition }, index) =>
                          mask == null || contains(fieldDefinition, mask.fieldDefinitions) ? (
                            <DefaultCustomFieldStyle
                              key={fieldDefinition.id}
                              targetName={`fieldValues.${index}`}
                              fieldName={fieldDefinition.name}
                              value={value}
                              setFieldValue={setFieldValue}
                              editable={editable.values}
                            />
                          ) : null
                        )}
                    </GridColumn>
                  </div>
                </SectionWrapper>
              </div>
            </Layout>
          );
        }}
      </Subscribe>
    );
  }
}

export default CustomFieldsForm;
