// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import UserAvatar from 'components/UserAvatar';
import { Display } from 'components/Form';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { orderListQuery } from 'modules/order/list/query';
import { partnerListQuery } from 'providers/PartnerList/query';
import { userListQuery } from 'providers/UserList/query';
import {
  DateRange,
  DayRange,
  MiniSelector,
  MiniSelectorItem,
  Origin,
  Packaging,
  Ports,
  PriceRange,
  Specifications,
  Tags,
} from './components';
import { FilterInputAreaWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
};

const getFilterInputArea = (selectedEntityType: EntityTypes, selectedFilterItem: string) => {
  switch (selectedEntityType) {
    case 'order': {
      switch (selectedFilterItem) {
        case 'poNo':
          return () =>
            MiniSelector({
              entityType: 'orders',
              query: orderListQuery,
              filterBy: {
                query: '',
                archived: null,
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id} isArchived={item.archived}>
                  <Display align="left">{item.poNo}</Display>
                </MiniSelectorItem>
              ),
            });
        case 'exporter':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Exporter'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id}>
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'inCharge':
          return () =>
            MiniSelector({
              entityType: 'users',
              query: userListQuery,
              filterBy: {
                query: '',
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id}>
                  <UserAvatar
                    firstName={item.firstName}
                    lastName={item.lastName}
                    height="20px"
                    width="20px"
                  />
                  <Display align="left">
                    <FormattedName firstName={item.firstName} lastName={item.lastName} />
                  </Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'tags':
          return Tags;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return null;
      }
    }
    case 'item':
      switch (selectedFilterItem) {
        case 'price':
          return PriceRange;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        case 'tags':
          return Tags;
        case 'exporter':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Exporter'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id}>
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'supplier':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Supplier'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id}>
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'origin':
          return Origin;
        case 'specifications':
          return Specifications;
        case 'productionLeadTime':
          return DayRange;
        case 'packaging':
          return Packaging;
        default:
          return null;
      }
    case 'batch':
      switch (selectedFilterItem) {
        case 'deliveredAt':
          return DateRange;
        case 'expiredAt':
          return DateRange;
        case 'producedAt':
          return DateRange;
        case 'packaging':
          return Packaging;
        case 'tags':
          return Tags;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return null;
      }
    case 'shipment':
      switch (selectedFilterItem) {
        case 'forwarder':
          return () =>
            MiniSelector({
              entityType: 'viewer.user.group.partners',
              query: partnerListQuery,
              filterBy: {
                query: '',
                types: ['Forwarder'],
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id}>
                  <Display align="left">{item.group.name}</Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'inCharge':
          return () =>
            MiniSelector({
              entityType: 'users',
              query: userListQuery,
              filterBy: {
                query: '',
              },
              renderItem: (item: Object) => (
                <MiniSelectorItem key={item.id}>
                  <UserAvatar
                    firstName={item.firstName}
                    lastName={item.lastName}
                    height="20px"
                    width="20px"
                  />
                  <Display align="left">
                    <FormattedName firstName={item.firstName} lastName={item.lastName} />
                  </Display>
                </MiniSelectorItem>
              ),
              hideToggles: true,
            });
        case 'seaports':
          return () => Ports({ portType: 'Seaport' });
        case 'airports':
          return () => Ports({ portType: 'Airport' });
        case 'cargoReady':
          return DateRange;
        case 'loadPortDeparture':
          return DateRange;
        case 'firstTransitPortArrival':
          return DateRange;
        case 'firstTransitPortDeparture':
          return DateRange;
        case 'secondTransitPortArrival':
          return DateRange;
        case 'secondTransitPortDeparture':
          return DateRange;
        case 'dischargePortArrival':
          return DateRange;
        case 'customClearance':
          return DateRange;
        case 'warehouseArrival':
          return DateRange;
        case 'deliveryReady':
          return DateRange;
        case 'tags':
          return Tags;
        case 'createdAt':
          return DateRange;
        case 'updatedAt':
          return DateRange;
        default:
          return null;
      }
    default:
      return null;
  }
};

export default function FilterInputArea({ selectedEntityType, selectedFilterItem }: Props) {
  const SelectedFilterInputArea = getFilterInputArea(selectedEntityType, selectedFilterItem);

  return (
    <div className={FilterInputAreaWrapperStyle}>
      <SelectedFilterInputArea />
    </div>
  );
}
