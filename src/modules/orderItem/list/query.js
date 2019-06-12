import gql from 'graphql-tag';
import {
  tagFragment,
  priceFragment,
  imageFragment,
  todoFragment,
  itemCardFragment,
  itemCardWithOwnedFragment,
  partnerNameFragment,
  ownedByFragment,
  forbiddenFragment,
} from 'graphql';

export const orderItemListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...itemCardWithOwnedFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${itemCardWithOwnedFragment}
  ${itemCardFragment}
  ${ownedByFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${todoFragment}
  ${forbiddenFragment}
`;

export default orderItemListQuery;
