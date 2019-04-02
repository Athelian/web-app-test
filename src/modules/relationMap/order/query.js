import gql from 'graphql-tag';
import {
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  priceFragment,
} from 'graphql';

export const batchCardRMFragment = gql`
  fragment batchCardRMFragment on Batch {
    id
    no
    quantity
    batchAdjustments {
      ... on BatchAdjustment {
        id
        quantity
      }
    }
    totalAdjusted
    tags {
      ...tagFragment
    }
    totalVolume {
      ...metricFragment
    }
    deliveredAt
    shipment {
      ... on Shipment {
        id
      }
    }
    container {
      ... on Container {
        id
      }
    }
  }
`;

export const orderCardRMFragment = gql`
  fragment orderCardRMFragment on Order {
    id
    poNo
    currency
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    shipmentCount
    exporter {
      ... on Group {
        id
        name
      }
    }
    tags {
      ...tagFragment
    }
    orderItems {
      ... on OrderItem {
        id
        quantity
        price {
          ...priceFragment
        }
        productProvider {
          ... on ProductProvider {
            id
            product {
              ... on Product {
                id
                name
                serial
                files {
                  ... on File {
                    id
                    pathSmall: path(preset: Small)
                  }
                }
              }
            }
            exporter {
              ... on Group {
                id
                name
              }
            }
          }
        }
        batches {
          ...batchCardRMFragment
          ... on Batch {
            shipment {
              ... on Shipment {
                id
              }
            }
          }
        }
      }
    }
    shipments {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
            orderItem {
              ... on OrderItem {
                id
                order {
                  ... on Order {
                    id
                  }
                }
              }
            }
          }
        }
      }
      ...shipmentCardRMFragment
    }
  }
`;

export const shipmentCardRMFragment = gql`
  fragment shipmentCardRMFragment on Shipment {
    id
    no
    blNo
    transportType
    batchCount
    orderItemCount
    importer {
      ... on Group {
        id
        name
      }
    }
    totalVolume {
      ...metricFragment
    }
    cargoReady {
      ...timelineDateMinimalFragment
    }
    tags {
      ...tagFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    voyages {
      ... on Voyage {
        id
        departurePort {
          ...portFragment
        }
        arrivalPort {
          ...portFragment
        }
        departure {
          ...timelineDateMinimalFragment
        }
        arrival {
          ...timelineDateMinimalFragment
        }
      }
    }
    containerGroups {
      ... on ContainerGroup {
        id
        customClearance {
          ...timelineDateMinimalFragment
        }
        warehouseArrival {
          ...timelineDateMinimalFragment
        }
        deliveryReady {
          ...timelineDateMinimalFragment
        }
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
    containers {
      ... on Container {
        id
        warehouseArrivalAgreedDate
        warehouseArrivalAgreedDateApprovedAt
        warehouseArrivalActualDate
        warehouseArrivalActualDateApprovedAt
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
    batches {
      ... on Batch {
        id
      }
    }
  }
`;

export const orderDetailQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ...orderCardRMFragment
    }
  }

  ${shipmentCardRMFragment}
  ${batchCardRMFragment}
  ${orderCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
`;

export const shipmentDetailQuery = gql`
  query($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
            orderItem {
              ... on OrderItem {
                id
                order {
                  ... on Order {
                    id
                  }
                }
              }
            }
          }
        }
      }
      ...shipmentCardRMFragment
    }
  }

  ${shipmentCardRMFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${tagFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
`;

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderCardRMFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardRMFragment}
  ${batchCardRMFragment}
  ${orderCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
`;

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ... on Shipment {
          id
          batches {
            ... on Batch {
              id
              orderItem {
                ... on OrderItem {
                  id
                  order {
                    ... on Order {
                      id
                    }
                  }
                }
              }
            }
          }
        }
        ...shipmentCardRMFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
`;
