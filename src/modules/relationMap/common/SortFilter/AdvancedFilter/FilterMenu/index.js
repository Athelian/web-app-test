// @flow
import * as React from 'react';
import type {
  EntityTypes,
  ActiveFilters,
  FilterToggles,
} from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import OrderFilterMenu from './OrderFilterMenu';
import ItemFilterMenu from './ItemFilterMenu';
import BatchFilterMenu from './BatchFilterMenu';
import ShipmentFilterMenu from './ShipmentFilterMenu';
import { FilterMenuWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  activeFilters: ActiveFilters,
  toggleActiveFilter: (string, string) => void,
  filterToggles: FilterToggles,
  toggleFilterToggle: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
};

const getFilterMenu = (selectedEntityType: EntityTypes) => {
  switch (selectedEntityType) {
    case 'order':
      return OrderFilterMenu;
    case 'item':
      return ItemFilterMenu;
    case 'batch':
      return BatchFilterMenu;
    case 'shipment':
      return ShipmentFilterMenu;
    default:
      return OrderFilterMenu;
  }
};

export default function FilterMenu({
  selectedEntityType,
  activeFilters,
  toggleActiveFilter,
  filterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const SelectedFilterMenu = getFilterMenu(selectedEntityType);
  const parsedActiveFilters = activeFilters[selectedEntityType];
  const parsedFilterToggles = filterToggles[selectedEntityType];

  return (
    <div className={FilterMenuWrapperStyle}>
      <SelectedFilterMenu
        parsedActiveFilters={parsedActiveFilters}
        toggleActiveFilter={toggleActiveFilter}
        parsedFilterToggles={parsedFilterToggles}
        toggleFilterToggle={toggleFilterToggle}
        selectedFilterItem={selectedFilterItem}
        changeSelectedFilterItem={changeSelectedFilterItem}
      />
    </div>
  );
}
