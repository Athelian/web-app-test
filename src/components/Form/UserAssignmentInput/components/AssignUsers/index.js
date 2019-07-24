// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { usersQuery } from 'graphql/staff/query';
import { Content, SlideViewLayout } from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import StaffGridView from 'modules/staff/list/StaffGridView';
import { StaffCard } from 'components/Cards';
import { type UserAvatarType } from 'types';
import messages from './messages';

type OptionalProps = {
  cacheKey: string,
  selected: Array<UserAvatarType>,
  filterBy: Object,
};

type Props = OptionalProps & {
  intl: IntlShape,
  onSelect: (values: Array<UserAvatarType>) => void,
  onCancel: () => void,
};

const defaultProps = {
  selected: [],
  filterBy: {},
  cacheKey: 'AssignUsers',
};

const MAX_SELECTIONS = 5;

const AssignUsers = ({ intl, cacheKey, selected, onCancel, onSelect, filterBy }: Props) => {
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.firstName), value: 'firstName' },
    { title: intl.formatMessage(messages.lastName), value: 'lastName' },
    { title: intl.formatMessage(messages.fullName), value: 'fullName' },
  ];

  const initialFilter = {
    filter: filterBy,
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    page: 1,
    perPage: 10,
  };

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(initialFilter, cacheKey);

  return (
    <Query fetchPolicy="network-only" query={usersQuery} variables={queryVariables}>
      {({ loading, error, fetchMore, data }) => {
        if (error) {
          return error.message;
        }

        const items = getByPathWithDefault([], 'users.nodes', data);
        const nextPage = getByPathWithDefault(1, 'users.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'users.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ArrayValue defaultValue={selected}>
            {({ value: values, push, filter }) => {
              return (
                <SlideViewLayout>
                  <SlideViewNavBar>
                    <FilterToolBar
                      icon="STAFF"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                      canSearch
                    />
                    <h3>
                      {values.length}/{MAX_SELECTIONS}
                    </h3>
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      data-testid="saveButtonOnAssignUsers"
                      disabled={isEquals(values, selected)}
                      onClick={() => onSelect(values)}
                    />
                  </SlideViewNavBar>

                  <Content>
                    <StaffGridView
                      hasMore={hasMore}
                      isLoading={loading}
                      onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'users')}
                      items={items}
                      renderItem={item => {
                        const isSelected = values.some(({ id }) => id === item.id);
                        return (
                          <StaffCard
                            key={item.id}
                            staff={item}
                            onSelect={() => {
                              if (isSelected) {
                                filter(({ id }) => id !== item.id);
                              } else if (values.length < MAX_SELECTIONS) {
                                push(item);
                              }
                            }}
                            selectable
                            selected={isSelected}
                          />
                        );
                      }}
                    />
                  </Content>
                </SlideViewLayout>
              );
            }}
          </ArrayValue>
        );
      }}
    </Query>
  );
};

AssignUsers.defaultProps = defaultProps;

export default injectIntl(AssignUsers);
