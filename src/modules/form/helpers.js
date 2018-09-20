// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import FormattedDate from 'components/FormattedDate';
import {
  FieldItem,
  Label,
  Tooltip,
  DefaultStyle,
  TextInput,
  DateInput,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
} from 'components/Form';
import logger from 'utils/logger';

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

export function textInputFactory({
  required = false,
  width = '200px',
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  required?: boolean,
  width?: string,
  isNew: boolean,
  label: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={<Label required={required}>{label}</Label>}
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <DefaultStyle
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
        >
          <TextInput name={name} {...inputHandlers} />
        </DefaultStyle>
      }
    />
  );
}

export function dateInputFactory({
  required = false,
  width = '200px',
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  required?: boolean,
  width?: string,
  isNew: boolean,
  label: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={<Label required={required}>{label}</Label>}
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue ? <FormattedDate value={initValue} /> : initValue,
            newValue: inputHandlers.value ? (
              <FormattedDate value={inputHandlers.value} />
            ) : (
              inputHandlers.value
            ),
          }}
        />
      }
      input={
        <DefaultStyle
          type="date"
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
        >
          <DateInput name={name} {...inputHandlers} />
        </DefaultStyle>
      }
    />
  );
}

export function numberInputFactory() {}

export function selectSearchEnumInputFactory({
  required = false,
  width = '200px',
  enumType,
  inputHandlers,
  name,
  isNew,
  label,
  initValue,
}: {
  enumType: string,
  required?: boolean,
  width?: string,
  isNew: boolean,
  label: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={<Label required={required}>{label}</Label>}
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <DefaultStyle
          type="date"
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
        >
          <EnumProvider enumType={enumType}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error!: ${error}`;
              return (
                <StringValue
                  defaultValue={inputHandlers.value}
                  onChange={newValue =>
                    inputHandlers.onChange({
                      target: {
                        value: newValue || '',
                      },
                    })
                  }
                >
                  {({ value: query, set, clear }) => (
                    <SearchSelectInput
                      name={name}
                      {...inputHandlers}
                      items={filterItems(query, data)}
                      itemToString={item => (item ? item.name : '')}
                      itemToValue={item => (item ? item.name : '')}
                      renderSelect={({ ...rest }) => (
                        <DefaultSearchSelect
                          {...rest}
                          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
                          forceHoverStyle={isNew}
                          width="200px"
                          isOpen={inputHandlers.isFocused}
                        />
                      )}
                      renderOptions={({ ...rest }) => (
                        <DefaultOptions
                          {...rest}
                          items={filterItems(query, data)}
                          itemToString={item => (item ? item.name : '')}
                          itemToValue={item => (item ? item.name : '')}
                        />
                      )}
                      onChange={item => {
                        logger.warn('SearchSelectInput onChange', item);
                        if (!item) clear();
                        set(item && item.name);
                      }}
                      onSearch={set}
                    />
                  )}
                </StringValue>
              );
            }}
          </EnumProvider>
        </DefaultStyle>
      }
    />
  );
}
