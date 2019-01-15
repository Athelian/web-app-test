import gql from 'graphql-tag';
import { timelineDateMinimalFragment } from 'graphql';

export const productListQuery = gql`
  query(
    $page: Int!
    $perPage: Int!
    $filterBy: ProductFilterInput
    $sortBy: ProductSortInput
    $batchPage: Int!
    $batchPerPage: Int!
    $batchSort: BatchSortInput
  ) {
    products(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        name
        serial
        archived
        productProviders {
          id
          exporter {
            id
            name
          }
          supplier {
            id
            name
          }
        }
        batches(page: $batchPage, perPage: $batchPerPage, sortBy: $batchSort) {
          nodes {
            id
            no
            quantity
            deliveredAt
            shipment {
              id
              no
              containerGroups {
                id
                warehouseArrival {
                  ...timelineDateMinimalFragment
                }
              }
            }
            batchAdjustments {
              id
              quantity
            }
            orderItem {
              id
              quantity
              order {
                id
                poNo
              }
            }
            tags {
              id
              name
              color
            }
          }
          totalCount
        }
        tags {
          id
          name
          color
        }
        files {
          id
          path
        }
      }
      page
      perPage
      totalPage
    }
  }

  ${timelineDateMinimalFragment}
`;

export default productListQuery;
