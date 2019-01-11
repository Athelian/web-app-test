import gql from 'graphql-tag';
import {
  orderCardFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  userAvatarFragment,
} from 'graphql';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderCardFragment
      }
      page
      totalPage
    }
  }

  ${orderCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${userAvatarFragment}
`;

export default orderListQuery;
