// @flow
import React, { useRef, useReducer, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import {
  getByPath,
  getByPathWithDefault,
  omit,
  isEmpty,
  isNullOrUndefined,
  isEquals,
} from 'utils/fp';
import { formatEndDate, formatFromDate } from 'utils/date';
import { CancelButton, SaveButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { UIConsumer } from 'modules/ui';
import { isValidOfMetricRangeInput, isValidOfPortsInput, filterPorts } from './utils';
import EntityTypesMenu from './EntityTypesMenu';
import FilterMenu from './FilterMenu';
import FilterInputArea from './FilterInputArea';
import {
  AdvancedFilterWrapperStyle,
  FilterToggleButtonStyle,
  FilterToggleBadgeStyle,
  AdvancedFilterBodyWrapperStyle,
  AdvancedFilterNavbarStyle,
  AdvancedFilterNavbarButtonsWrapperStyle,
  AdvancedFilterBodyStyle,
} from './style';
import type { EntityTypes, ActiveFilters, FilterToggles } from './type';

type Props = {
  onApply: Function,
  initialFilter: Object,
};
type State = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
  activeFilters: ActiveFilters,
  filterToggles: FilterToggles,
  selectedItems: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
  radioFilters: {
    order: Object,
    shipment: Object,
  },
};

const initialState: State = {
  selectedEntityType: 'order',
  selectedFilterItem: 'ids',
  activeFilters: {
    order: [],
    item: [],
    batch: [],
    shipment: [],
  },
  selectedItems: {
    order: {},
    item: {},
    batch: {},
    shipment: {},
  },
  radioFilters: {
    order: {
      archived: false,
      completelyBatched: null,
      completelyShipped: null,
    },
    shipment: {
      archived: null,
    },
  },
  filterToggles: {
    order: {
      completelyBatched: false,
      completelyShipped: false,
    },
    item: {},
    batch: {},
    shipment: {},
  },
};

const defaultFilterMenuItemMap = {
  order: 'ids',
  item: 'price',
  batch: 'deliveredAt',
  shipment: 'forwarder',
};

const ADVANCE_FILTER_STORAGE = 'advanceFilterRelationMap';

const FILTER = {
  order: {
    completelyBatched: null,
    completelyShipped: null,
    showActive: null,
    showArchived: null,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ids: 'ids',
    inCharge: 'inChargeIds',
    exporter: 'exporterIds',
    tags: 'tagIds',
  },
  item: {
    price: 'orderItemPrice',
    createdAt: 'orderItemCreatedAt',
    updatedAt: 'orderItemUpdatedAt',
    exporter: 'productProviderExporterIds',
    supplier: 'productProviderSupplierIds',
    tags: 'productTagIds',
    origin: 'productProviderOrigins',
  },
  batch: {
    deliveredAt: 'batchDeliveredAt',
    tags: 'batchTagIds',
  },
  shipment: {
    cargoReady: 'shipmentCargoReady',
    loadPortDeparture: 'shipmentLoadPortDeparture',
    firstTransitPortArrival: 'shipmentFirstTransitPortArrival',
    firstTransitPortDeparture: 'shipmentFirstTransitPortDeparturel',
    secondTransitPortArrival: 'shipmentSecondTransitPortArrival',
    secondTransitPortDeparture: 'shipmentSecondTransitPortDeparture',
    dischargePortArrival: 'shipmentDischargePortArrival',
    customClearance: 'shipmentCustomClearance',
    warehouseArrival: 'shipmentWarehouseArrival',
    deliveryReady: 'shipmentDeliveryReady',
    forwarder: 'shipmentForwarderIds',
    warehouse: 'shipmentWarehouseIds',
    inCharge: 'shipmentInChargeIds',
    tags: 'shipmentTagIds',
    createdAt: 'shipmentCreatedAt',
    updatedAt: 'shipmentUpdatedAt',
  },
};

const getFilterValue = (name: string, data: any) => {
  switch (name) {
    case 'exporter':
    case 'forwarder':
      return data.map(d => d.group && d.group.id);
    case 'ids':
    case 'tags':
    case 'inCharge':
    case 'supplier':
    case 'warehouse':
      return data.map(d => d.id);
    case 'origin':
      return data.filter(d => !isNullOrUndefined(d)).map(d => d.name);
    case 'createdAt':
    case 'updatedAt':
    case 'deliveredAt':
    case 'expiredAt':
    case 'producedAt':
    case 'cargoReady':
    case 'loadPortDeparture':
    case 'firstTransitPortArrival':
    case 'firstTransitPortDeparture':
    case 'secondTransitPortArrival':
    case 'secondTransitPortDeparture':
    case 'dischargePortArrival':
    case 'customClearance':
    case 'warehouseArrival':
    case 'deliveryReady':
      return {
        ...(data.before && { before: formatEndDate(data.before) }),
        ...(data.after && { after: formatFromDate(data.after) }),
      };
    case 'price': {
      const currency = getByPath('currency.name', data);
      const min = getByPath('min', data);
      const max = getByPath('max', data);
      return {
        ...(isNullOrUndefined(currency) ? {} : { currency }),
        ...(isNullOrUndefined(min) ? {} : { min }),
        ...(isNullOrUndefined(max) ? {} : { max }),
      };
    }

    default:
      return data;
  }
};

const convertActiveFilter = (state: Object, type: string) => {
  const filters = getByPathWithDefault({}, `activeFilters.${type}`, state);
  const query = filters.reduce((currentQuery, filterName) => {
    if (FILTER[type] && FILTER[type][filterName]) {
      const rawValue = getByPathWithDefault({}, `selectedItems.${type}.${filterName}`, state);
      const filterValue = getFilterValue(filterName, rawValue);
      return Object.assign(currentQuery, {
        [FILTER[type][filterName]]: filterValue,
      });
    }
    return currentQuery;
  }, {});
  return query;
};

const convertMetricRangeQuery = ({
  min,
  max,
  metric,
}: {
  min: number,
  max: number,
  metric: string,
}) =>
  isNullOrUndefined(min) && isNullOrUndefined(max)
    ? {}
    : {
        ...(isNullOrUndefined(min) ? {} : { min }),
        ...(isNullOrUndefined(max) ? {} : { max }),
        metric,
      };

const convertTotalVolumeRangeQuery = (state: Object) => {
  const activeFilters = getByPathWithDefault({}, `activeFilters.batch`, state);
  if (!activeFilters.includes('totalVolume')) return {};
  const { min, max, metric } = getByPathWithDefault(
    {},
    `selectedItems.batch.totalVolume.value`,
    state
  );

  const query = convertMetricRangeQuery({ min, max, metric });
  return isEmpty(query) ? query : { batchTotalVolume: query };
};

const mergeAirportsAndSeaports = (airports: Array<Object>, seaports: Array<Object>) => [
  ...(isValidOfPortsInput(airports)
    ? filterPorts(airports).map(port => ({ airport: port.name }))
    : []),
  ...(isValidOfPortsInput(seaports)
    ? filterPorts(seaports).map(port => ({ seaport: port.name }))
    : []),
];

const convertPortsQuery = (state: Object) => {
  const activeFilters = getByPathWithDefault([], `activeFilters.shipment`, state);
  if (!activeFilters.includes('airports') && !activeFilters.includes('seaports')) return {};
  const airports = getByPathWithDefault({}, `selectedItems.shipment.airports`, state);
  const seaports = getByPathWithDefault({}, 'selectedItems.shipment.seaports', state);

  const result = {
    ...(isValidOfPortsInput(airports.loadPorts) || isValidOfPortsInput(seaports.loadPorts)
      ? {
          shipmentLoadPorts: mergeAirportsAndSeaports(airports.loadPorts, seaports.loadPorts),
        }
      : {}),
    ...(isValidOfPortsInput(airports.dischargePorts) || isValidOfPortsInput(seaports.dischargePorts)
      ? {
          shipmentDischargePorts: mergeAirportsAndSeaports(
            airports.dischargePorts,
            seaports.dischargePorts
          ),
        }
      : {}),
    ...(isValidOfPortsInput(airports.firstTransitPorts) ||
    isValidOfPortsInput(seaports.firstTransitPorts)
      ? {
          shipmentFirstTransitPorts: mergeAirportsAndSeaports(
            airports.firstTransitPorts,
            seaports.firstTransitPorts
          ),
        }
      : {}),
    ...(isValidOfPortsInput(airports.secondTransitPorts) ||
    isValidOfPortsInput(seaports.secondTransitPorts)
      ? {
          shipmentSecondTransitPorts: mergeAirportsAndSeaports(
            airports.secondTransitPorts,
            seaports.secondTransitPorts
          ),
        }
      : {}),
  };

  return result;
};

const convertPackagingQuery = (state: Object, type: string, prevKey: string) => {
  const activeFilters = getByPathWithDefault([], `activeFilters.${type}`, state);
  if (!activeFilters.includes('packaging')) return {};
  const {
    packageLength,
    packageWidth,
    packageHeight,
    packageVolume,
    packageWeight,
  } = getByPathWithDefault({}, `selectedItems.${type}.packaging`, state);

  const packageLengthQuery = isValidOfMetricRangeInput(packageLength)
    ? convertMetricRangeQuery({ ...packageLength })
    : {};
  const packageWidthQuery = isValidOfMetricRangeInput(packageWidth)
    ? convertMetricRangeQuery({ ...packageWidth })
    : {};
  const packageHeightQuery = isValidOfMetricRangeInput(packageHeight)
    ? convertMetricRangeQuery({ ...packageHeight })
    : {};
  const packageVolumeQuery = isValidOfMetricRangeInput(packageVolume)
    ? convertMetricRangeQuery({ ...packageVolume })
    : {};
  const packageWeightQuery = isValidOfMetricRangeInput(packageWeight)
    ? convertMetricRangeQuery({ ...packageWeight })
    : {};

  const packagingQuery = {};
  if (!isEmpty(packageLengthQuery) || !isEmpty(packageWidthQuery) || !isEmpty(packageHeightQuery)) {
    packagingQuery[`${prevKey}PackageSize`] = {
      ...(isEmpty(packageLengthQuery) ? {} : { length: { ...packageLengthQuery } }),
      ...(isEmpty(packageWidthQuery) ? {} : { width: { ...packageWidthQuery } }),
      ...(isEmpty(packageHeightQuery) ? {} : { height: { ...packageHeightQuery } }),
    };
  }
  if (!isEmpty(packageVolumeQuery)) {
    packagingQuery[`${prevKey}PackageVolume`] = packageVolumeQuery;
  }
  if (!isEmpty(packageWeightQuery)) {
    packagingQuery[`${prevKey}PackageWeight`] = packageWeightQuery;
  }
  return packagingQuery;
};

const convertArchivedFilter = (state: Object, entityType: string, key: string) => {
  const archived = getByPath(`radioFilters.${entityType}.archived`, state);
  const query = {};
  if (!isNullOrUndefined(archived)) {
    query[key] = archived;
  }
  return query;
};

const covertCompletelyFilter = (state: Object, entityType: string, key: string) => {
  const completed = getByPath(`radioFilters.${entityType}.${key}`, state);
  const query = {};
  if (!isNullOrUndefined(completed)) {
    query[key] = completed;
  }
  return query;
};

const convertToFilterQuery = (state: Object) => ({
  ...convertActiveFilter(state, 'order'),
  ...convertActiveFilter(state, 'item'),
  ...convertActiveFilter(state, 'batch'),
  ...convertActiveFilter(state, 'shipment'),

  ...convertArchivedFilter(state, 'order', 'archived'),
  ...convertArchivedFilter(state, 'shipment', 'shipmentArchived'),

  ...convertPackagingQuery(state, 'item', 'productProvider'),
  ...convertTotalVolumeRangeQuery(state),
  // ...convertPackagingQuery(state, 'batch', 'batch'),
  ...convertPortsQuery(state),

  ...covertCompletelyFilter(state, 'order', 'completelyBatched'),
  ...covertCompletelyFilter(state, 'order', 'completelyShipped'),
});

const removeActiveFilter = state => ({
  activeFilters: {
    ...state.activeFilters,
    [state.selectedEntityType]: state.activeFilters[state.selectedEntityType].filter(
      activeFilter => activeFilter !== state.selectedFilterItem
    ),
  },
});

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return initialState;

    case 'CHANGE_ENTITY': {
      const { entityType } = action;

      return {
        ...state,
        selectedEntityType: entityType,
        selectedFilterItem: defaultFilterMenuItemMap[entityType],
      };
    }

    case 'CHANGE_RADIO_FILTER': {
      const { entityType, filter, value } = action;
      const { radioFilters } = state;

      const newRadioFilters = { ...radioFilters };
      newRadioFilters[entityType][filter] = value;

      return {
        ...state,
        radioFilters: newRadioFilters,
      };
    }

    case 'OVERRIDE_FILTER': {
      const { advanceFilter } = action;
      return {
        ...state,
        ...advanceFilter,
      };
    }

    case 'TOGGLE_FILTER_TOGGLE': {
      const { entityType, toggle } = action;
      const { filterToggles } = state;

      const newFilterToggles = { ...filterToggles };
      newFilterToggles[entityType][toggle] = !newFilterToggles[entityType][toggle];

      return {
        ...state,
        filterToggles: newFilterToggles,
      };
    }

    case 'TOGGLE_ACTIVE_FILTER': {
      const { entityType, filter } = action;
      const { activeFilters } = state;
      const newActiveFilters = { ...activeFilters };

      if (!activeFilters[entityType].some(activeFilter => activeFilter === filter)) {
        newActiveFilters[entityType] = [...newActiveFilters[entityType], filter];
      } else {
        newActiveFilters[entityType] = newActiveFilters[entityType].filter(
          activeFilter => activeFilter !== filter
        );
      }

      return {
        ...state,
        activeFilters: newActiveFilters,
      };
    }

    case 'FILTER_ITEM': {
      const { selectedFilterItem } = action;

      return {
        ...state,
        selectedFilterItem,
      };
    }

    case 'SET_SELECT_ITEM': {
      const { selectItem, field } = action;

      const selected =
        state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || {};
      let newSelected = {};
      if (isNullOrUndefined(selectItem)) {
        newSelected = omit([field], selected);
      } else {
        newSelected = { ...selected, [field]: selectItem };
      }
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [state.selectedEntityType]: {
            ...state.selectedItems[state.selectedEntityType],
            [state.selectedFilterItem]: newSelected,
          },
        },
        ...(isEmpty(newSelected) ? removeActiveFilter(state) : {}),
      };
    }

    case 'TOGGLE_SELECT_ITEM': {
      const { selectItem } = action;

      let selected = state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || [];
      // FIXME: https://zenport.slack.com/archives/C2JTDSRJ6/p1544522179024700?thread_ts=1544517194.016100&cid=C2JTDSRJ6
      const selectItemIsArray = Array.isArray(selectItem);
      if (selectItemIsArray) {
        selected = [...selectItem];
      } else {
        const itemIsNotSelected =
          typeof selectItem === 'object' && !selectItemIsArray
            ? !selected.find(selectedData => selectedData.id === selectItem.id)
            : !selected.includes(selectItem);
        if (itemIsNotSelected) {
          selected.push(selectItem);
        } else {
          selected.splice(selected.indexOf(selectItem), 1);
        }
      }

      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [state.selectedEntityType]: {
            ...state.selectedItems[state.selectedEntityType],
            [state.selectedFilterItem]: selected,
          },
        },
        ...(isEmpty(selected) ? removeActiveFilter(state) : {}),
      };
    }

    default:
      return state;
  }
}

const isDefaultFilter = isEquals({
  archived: false,
});

function AdvanceFilter({ onApply, initialFilter }: Props) {
  let initialLocalAdvanceFilter;
  try {
    const localAdvanceFilter =
      window.localStorage && window.localStorage.getItem(ADVANCE_FILTER_STORAGE);
    initialLocalAdvanceFilter = JSON.parse(localAdvanceFilter);
  } catch (error) {
    initialLocalAdvanceFilter = null;
  }

  const filterButtonRef = useRef(null);
  const [filterIsApplied, setAppliedFilter] = useState(
    initialLocalAdvanceFilter
      ? !isDefaultFilter(convertToFilterQuery(initialLocalAdvanceFilter))
      : false
  );

  const [state, dispatch] = useReducer(reducer, initialLocalAdvanceFilter || initialState);
  const filterQuery = convertToFilterQuery(state);
  const defaultInitialFilter = isDefaultFilter(initialFilter);
  const defaultFilterQuery = isDefaultFilter(filterQuery);

  useEffect(() => {
    if (window.localStorage) {
      const advanceFilterQuery = convertToFilterQuery(state);
      const localFilter = JSON.parse(window.localStorage.getItem('filterRelationMap') || '{}');
      window.localStorage.setItem(ADVANCE_FILTER_STORAGE, JSON.stringify(state));
      window.localStorage.setItem(
        'filterRelationMap',
        JSON.stringify({
          ...localFilter,
          filter: advanceFilterQuery,
        })
      );
    }
  }, [state]);

  const sameFilter = isEquals(initialFilter, filterQuery);
  const showApplyButton = !defaultInitialFilter || !sameFilter;

  const appliedSomeFilter = sameFilter && !defaultInitialFilter;
  const changeSomeFilter = !sameFilter && !defaultFilterQuery;
  const showCancelButton = appliedSomeFilter || changeSomeFilter;

  return (
    <UIConsumer>
      {uiState => (
        <BooleanValue>
          {({ value: isOpen, set: toggleFilter }) => (
            <div className={AdvancedFilterWrapperStyle}>
              <button
                className={FilterToggleButtonStyle}
                onClick={() => toggleFilter(!isOpen)}
                type="button"
                ref={filterButtonRef}
              >
                {filterIsApplied && <div className={FilterToggleBadgeStyle} />}
                <Icon icon="FILTER" />
              </button>
              {isOpen && (
                <OutsideClickHandler
                  onOutsideClick={() => toggleFilter(false)}
                  ignoreClick={false}
                  ignoreElements={
                    filterButtonRef && filterButtonRef.current ? [filterButtonRef.current] : []
                  }
                >
                  <div
                    className={AdvancedFilterBodyWrapperStyle({
                      isOpen,
                      isSideBarExpanded: uiState.isSideBarExpanded,
                    })}
                  >
                    <div className={AdvancedFilterNavbarStyle}>
                      <Label>
                        <FormattedMessage
                          id="modules.RelationMaps.filter.filterBy"
                          defaultMessage="FILTER BY"
                        />
                      </Label>
                      <div className={AdvancedFilterNavbarButtonsWrapperStyle}>
                        {showCancelButton && (
                          <CancelButton
                            onClick={() => {
                              dispatch({ type: 'RESET' });
                              setAppliedFilter(false);
                            }}
                            label={
                              <FormattedMessage
                                id="modules.RelationMaps.filter.reset"
                                defaultMessage="RESET"
                              />
                            }
                          />
                        )}
                        {showApplyButton && (
                          <SaveButton
                            disabled={sameFilter}
                            onClick={() => {
                              onApply({ filter: filterQuery });
                              setAppliedFilter(!defaultFilterQuery);
                            }}
                            label={
                              <FormattedMessage
                                id="modules.RelationMaps.filter.apply"
                                defaultMessage="APPLY"
                              />
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className={AdvancedFilterBodyStyle}>
                      <EntityTypesMenu
                        selectedEntityType={state.selectedEntityType}
                        activeFilters={state.activeFilters}
                        changeSelectedEntityType={entityType =>
                          dispatch({ type: 'CHANGE_ENTITY', entityType })
                        }
                      />
                      <FilterMenu
                        selectedItems={state.selectedItems}
                        selectedEntityType={state.selectedEntityType}
                        activeFilters={state.activeFilters}
                        radioFilters={state.radioFilters}
                        filterToggles={state.filterToggles}
                        selectedFilterItem={state.selectedFilterItem}
                        onToggleSelect={(selectItem: any, field?: string) =>
                          dispatch({
                            type: field ? 'SET_SELECT_ITEM' : 'TOGGLE_SELECT_ITEM',
                            selectItem,
                            ...(field ? { field } : {}),
                          })
                        }
                        changeRadioFilter={(entityType, filter, value) =>
                          dispatch({
                            type: 'CHANGE_RADIO_FILTER',
                            entityType,
                            filter,
                            value,
                          })
                        }
                        toggleActiveFilter={(entityType, filter) =>
                          dispatch({
                            type: 'TOGGLE_ACTIVE_FILTER',
                            entityType,
                            filter,
                          })
                        }
                        toggleFilterToggle={(entityType, toggle) =>
                          dispatch({
                            type: 'TOGGLE_FILTER_TOGGLE',
                            entityType,
                            toggle,
                          })
                        }
                        changeSelectedFilterItem={selectedFilterItem =>
                          dispatch({
                            type: 'FILTER_ITEM',
                            selectedFilterItem,
                          })
                        }
                      />
                      <FilterInputArea
                        selectedEntityType={state.selectedEntityType}
                        selectedFilterItem={state.selectedFilterItem}
                        onToggleSelect={(selectItem: any, field?: string) => {
                          dispatch({
                            type: field ? 'SET_SELECT_ITEM' : 'TOGGLE_SELECT_ITEM',
                            selectItem,
                            ...(field ? { field } : {}),
                          });
                        }}
                        selectedItems={
                          state.selectedItems[state.selectedEntityType][state.selectedFilterItem] ||
                          []
                        }
                      />
                    </div>
                  </div>
                </OutsideClickHandler>
              )}
            </div>
          )}
        </BooleanValue>
      )}
    </UIConsumer>
  );
}

export default AdvanceFilter;
