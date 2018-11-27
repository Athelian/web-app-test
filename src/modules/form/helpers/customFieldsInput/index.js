// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import FormattedNumber from 'components/FormattedNumber';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { FieldItem, Label } from 'components/Form';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { fieldDefinitionsQuery } from 'modules/metadata/query';
import MetadataEditForm from './components/MetadataEditForm';
import CustomFieldsContainer from './container';
import { ShowAllButtonStyle, MetadataIconStyle } from './style';

type Props = {
  entityType: string,
  isNew: boolean,
  customFields: ?{
    mask: Object,
    fieldValues: Array<Object>,
    fieldDefinitions: Array<Object>,
  },
  setFieldValue: Function,
};

const customFieldsInputFactory = ({ entityType, isNew, customFields, setFieldValue }: Props) => (
  <FieldItem
    label={
      <Label>
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />
        {' ('}
        <FormattedNumber
          value={(customFields && customFields.fieldValues && customFields.fieldValues.length) || 0}
        />
        {')'}
      </Label>
    }
    tooltip={
      <div className={MetadataIconStyle}>
        <Icon icon="METADATA" />
      </div>
    }
    input={
      <BooleanValue>
        {({ value: isOpen, set: slideToggle }) => (
          <>
            <button onClick={() => slideToggle(true)} className={ShowAllButtonStyle} type="button">
              <FormattedMessage id="modules.form.showAll" defaultMessage="Show All" />
            </button>
            <SlideView
              isOpen={isOpen}
              onRequestClose={() => slideToggle(false)}
              options={{ width: '1030px' }}
            >
              {isOpen && (
                <>
                  {isNew ? (
                    <Query
                      query={fieldDefinitionsQuery}
                      variables={{ entityType }}
                      fetchPolicy="network-only"
                    >
                      {({ loading, data, error }) => {
                        if (error) {
                          if (error.message && error.message.includes('403')) {
                            navigate('/403');
                          }
                          return error.message;
                        }

                        if (loading) return <LoadingIcon />;
                        const fieldDefinitions = getByPathWithDefault([], 'fieldDefinitions', data);
                        return (
                          <Subscribe to={[CustomFieldsContainer]}>
                            {({ initDetailValues, originalValues, state }) => {
                              const values = { ...originalValues, ...state };

                              return (
                                <MetadataEditForm
                                  entityType={entityType}
                                  fieldDefinitions={fieldDefinitions}
                                  onCancel={() => slideToggle(false)}
                                  onSave={() => {
                                    slideToggle(false);
                                    setFieldValue('customFields', values);
                                  }}
                                  onFormReady={() => {
                                    initDetailValues({
                                      mask: null,
                                      fieldDefinitions,
                                      // FIXME: has issue when new entity
                                      fieldValues: fieldDefinitions.map(fieldDefinition => ({
                                        value: {},
                                        fieldDefinition,
                                        entityType,
                                      })),
                                    });
                                  }}
                                />
                              );
                            }}
                          </Subscribe>
                        );
                      }}
                    </Query>
                  ) : (
                    <Subscribe to={[CustomFieldsContainer]}>
                      {({ initDetailValues, originalValues, state }) => {
                        const values = { ...originalValues, ...state };

                        return (
                          <MetadataEditForm
                            entityType={entityType}
                            fieldDefinitions={(customFields && customFields.fieldDefinitions) || []}
                            onCancel={() => slideToggle(false)}
                            onSave={() => {
                              slideToggle(false);
                              setFieldValue('customFields', values);
                            }}
                            onFormReady={() => {
                              initDetailValues(customFields);
                            }}
                          />
                        );
                      }}
                    </Subscribe>
                  )}
                </>
              )}
            </SlideView>
          </>
        )}
      </BooleanValue>
    }
  />
);

export default customFieldsInputFactory;
