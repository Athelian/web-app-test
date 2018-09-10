// @flow
import gql from 'graphql-tag';

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    batches(page: $page, perPage: $perPage) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;

export default batchListQuery;
