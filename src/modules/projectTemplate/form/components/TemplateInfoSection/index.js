// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import {
  SectionWrapper,
  SectionHeader,
  LastModified,
  TextInputFactory,
  TextAreaInputFactory,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import { validator } from 'modules/projectTemplate/form/validator';
import { FormField } from 'modules/form';

import usePermission from 'hooks/usePermission';
import {
  PROJECT_TEMPLATE_CREATE,
  PROJECT_TEMPLATE_UPDATE,
  PROJECT_TEMPLATE_SET_NAME,
  PROJECT_TEMPLATE_SET_DESCRIPTION,
} from 'modules/permission/constants/task';

import { TemplateInfoSectionWrapperStyle } from './style';

const TemplateInfoSection = () => {
  const { hasPermission } = usePermission();
  const canCreateOrUpdate = hasPermission([PROJECT_TEMPLATE_CREATE, PROJECT_TEMPLATE_UPDATE]);

  return (
    <Subscribe to={[ProjectTemplateContainer]}>
      {({ originalValues, state: values, setFieldValue }) => {
        return (
          <SectionWrapper id="template_info_section">
            <SectionHeader
              icon="TEMPLATE"
              title={
                <FormattedMessage id="modules.TaskTemplates.template" defaultMessage="TEMPLATE" />
              }
            >
              {originalValues.updatedAt && (
                <LastModified
                  updatedAt={originalValues.updatedAt}
                  updatedBy={originalValues.updatedBy}
                />
              )}
            </SectionHeader>

            <div className={TemplateInfoSectionWrapperStyle}>
              <GridColumn>
                <>
                  <FormField
                    name="name"
                    initValue={values.name}
                    validator={validator}
                    values={values}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        label={<FormattedMessage id="common.name" defaultMessage="NAME" />}
                        required
                        editable={canCreateOrUpdate || hasPermission(PROJECT_TEMPLATE_SET_NAME)}
                      />
                    )}
                  </FormField>

                  <FormField
                    validator={validator}
                    values={values}
                    name="description"
                    initValue={values.description}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextAreaInputFactory
                        name={name}
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage id="common.description" defaultMessage="DESCRIPTION" />
                        }
                        editable={
                          canCreateOrUpdate || hasPermission(PROJECT_TEMPLATE_SET_DESCRIPTION)
                        }
                        vertical={false}
                        inputWidth="200px"
                        inputHeight="100px"
                      />
                    )}
                  </FormField>
                </>
              </GridColumn>
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
};

export default TemplateInfoSection;
