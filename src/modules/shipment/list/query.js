// @flow
import gql from 'graphql-tag';
import {
  shipmentCardFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
} from 'graphql';

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...shipmentCardFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
`;

export default shipmentListQuery;
