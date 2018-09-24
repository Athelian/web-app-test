// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import query from './query.graphql';

type OptionalProps = {
  filterBy: {
    query?: string,
  },
  sortBy: {
    createdAt?: string,
    updatedAt?: string,
  },
  perPage: number,
  page: number,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  filterBy: {},
  sortBy: {},
  page: 1,
  perPage: 100,
};

const OrderItemsList = ({ filterBy, sortBy, page, perPage, children }: Props) => (
  <Query query={query} variables={{ page, perPage, filterBy, sortBy }}>
    {children}
  </Query>
);

OrderItemsList.defaultProps = defaultProps;

export default OrderItemsList;
