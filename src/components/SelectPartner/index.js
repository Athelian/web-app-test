// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { partnersQuery } from 'graphql/partner/query';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import useFilterSort from 'hooks/useFilterSort';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  EntityIcon,
  Filter,
  PartnerFilterConfig,
  PartnerSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { PartnerCard } from 'components/Cards';
import PartnerGridView from 'modules/partner/list/PartnerGridView';

type Props = {|
  partnerTypes: Array<string>,
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
  confirmationDialogMessage?: ?string | React.Node,
  deselectDialogMessage?: ?string | React.Node,
  isRequired?: boolean,
|};

const partnerPath = 'viewer.user.organization.partners';

const SelectPartner = ({
  partnerTypes,
  selected,
  onCancel,
  onSelect,
  confirmationDialogMessage,
  deselectDialogMessage,
  isRequired,
}: Props) => {
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = React.useState(false);
  const [deselectDialogIsOpen, setDeselectDialogIsOpen] = React.useState(false);

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', types: partnerTypes },
    { updatedAt: 'DESCENDING' }
  );

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };

  return (
    <Query fetchPolicy="network-only" query={partnersQuery} variables={queryVariables}>
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const items = getByPathWithDefault([], `${partnerPath}.nodes`, data).map(item => ({
          ...item.organization,
          code: item.code,
        }));
        const nextPage = getByPathWithDefault(1, `${partnerPath}.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `${partnerPath}.totalPage`, data);
        const hasMore = nextPage <= totalPage;

        return (
          <ObjectValue defaultValue={selected}>
            {({ value, set }) => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="PARTNER" color="PARTNER" />

                  <Filter
                    config={PartnerFilterConfig}
                    filterBy={filterBy}
                    onChange={setFilterBy}
                    staticFilters={['types']}
                  />
                  <Search query={query} onChange={setQuery} />
                  <Sort config={PartnerSortConfig} sortBy={sortBy} onChange={setSortBy} />

                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    disabled={value?.id === selected?.id}
                    onClick={() => {
                      if (!value) {
                        if (!!deselectDialogMessage && value?.id !== selected?.id) {
                          setDeselectDialogIsOpen(true);
                        } else {
                          onSelect(value);
                        }
                      } else if (!!confirmationDialogMessage && value?.id !== selected?.id) {
                        setConfirmationDialogIsOpen(true);
                      } else {
                        onSelect(value);
                      }
                    }}
                  />

                  {!!confirmationDialogMessage && (
                    <ConfirmDialog
                      isOpen={confirmationDialogIsOpen}
                      onRequestClose={() => setConfirmationDialogIsOpen(false)}
                      onCancel={() => setConfirmationDialogIsOpen(false)}
                      onConfirm={() => {
                        onSelect(value);
                        setConfirmationDialogIsOpen(false);
                      }}
                      message={confirmationDialogMessage}
                    />
                  )}

                  {!!deselectDialogMessage && (
                    <ConfirmDialog
                      isOpen={deselectDialogIsOpen}
                      onRequestClose={() => setDeselectDialogIsOpen(false)}
                      onCancel={() => setDeselectDialogIsOpen(false)}
                      onConfirm={() => {
                        onSelect(value);
                        setDeselectDialogIsOpen(false);
                      }}
                      message={deselectDialogMessage}
                    />
                  )}
                </SlideViewNavBar>

                <Content>
                  <PartnerGridView
                    hasMore={hasMore}
                    isLoading={loading}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, partnerPath)}
                    items={items}
                    renderItem={item => (
                      <PartnerCard
                        partner={item}
                        onSelect={() => {
                          if (!isRequired && value && item.id === value.id) {
                            set(null);
                          } else {
                            set(cleanUpData(item));
                          }
                        }}
                        selectable
                        selected={value && item.id === value.id}
                        key={item.id}
                      />
                    )}
                  />
                </Content>
              </SlideViewLayout>
            )}
          </ObjectValue>
        );
      }}
    </Query>
  );
};

export default SelectPartner;
