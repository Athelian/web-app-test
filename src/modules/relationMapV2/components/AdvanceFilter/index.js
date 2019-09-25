// @flow
import * as React from 'react';
import Filter from 'components/NavBar/components/Filter';
import { OrderConfigFilter } from 'components/NavBar/components/Filter/configs';
import { SearchInput } from 'components/NavBar';
import { SortAndFilter } from 'modules/relationMapV2/store';
import Icon from 'components/Icon';
import MatchesEntities from './components/MatchesEntities';
import { FilterWrapperStyle, BlueOutlineWrapperStyle, ClearTotalButtonStyle } from './style';

export default function AdvanceFilter() {
  const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
  const {
    filter: { query, ...filters },
  } = filterAndSort;
  const hasFilter = query !== '' || Object.keys(filterAndSort.filter).length > 1;

  return (
    <div className={FilterWrapperStyle(hasFilter)}>
      <div className={BlueOutlineWrapperStyle(hasFilter)}>
        <Filter
          config={OrderConfigFilter}
          filters={filters}
          onChange={filter =>
            onChangeFilter({
              ...filterAndSort,
              filter: {
                ...filter,
                query,
              },
            })
          }
        />
        <SearchInput
          value={query}
          name="search"
          onClear={() =>
            onChangeFilter({
              ...filterAndSort,
              filter: {
                ...filterAndSort.filter,
                query: '',
              },
            })
          }
          onChange={newQuery =>
            onChangeFilter({
              ...filterAndSort,
              filter: {
                ...filterAndSort.filter,
                query: newQuery,
              },
            })
          }
        />
      </div>

      {hasFilter && <MatchesEntities />}

      {hasFilter && (
        <button
          className={ClearTotalButtonStyle}
          onClick={() => {
            // TODO: Clear all filters
          }}
          type="button"
        >
          <Icon icon="CLEAR" />
        </button>
      )}
    </div>
  );
}
