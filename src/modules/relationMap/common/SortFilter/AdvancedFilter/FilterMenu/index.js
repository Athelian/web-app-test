// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import OrderFilterMenu from './OrderFilterMenu';
import ItemFilterMenu from './ItemFilterMenu';
import BatchFilterMenu from './BatchFilterMenu';
import ShipmentFilterMenu from './ShipmentFilterMenu';
import { FilterMenuWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  activeFilters: {
    order: Array<string>,
    item: Array<string>,
    batch: Array<string>,
    shipment: Array<string>,
  },
  toggleActiveFilter: (string, string) => void,
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
  selectedFilterItem,
  changeSelectedFilterItem,
}: Props) {
  const SelectedFilterMenu = getFilterMenu(selectedEntityType);

  return (
    <div className={FilterMenuWrapperStyle}>
      <SelectedFilterMenu
        activeFilters={activeFilters[selectedEntityType]}
        toggleActiveFilter={toggleActiveFilter}
        selectedFilterItem={selectedFilterItem}
        changeSelectedFilterItem={changeSelectedFilterItem}
      />
    </div>
  );
}
