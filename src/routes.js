// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import React, { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import LoadingIcon from './components/LoadingIcon';
import PageNotFound from './components/PageNotFound';
import NoPermission from './components/NoPermission';
import DashBoard from './modules/dashboard';
import Order from './modules/order';
import Login from './modules/login';
import SideBar from './modules/sidebar';
import Authorized from './components/Authorized';

const AsyncTags = lazy(() => import('./modules/tags'));
const AsyncStaff = lazy(() => import('./modules/staff'));
const AsyncPartner = lazy(() => import('./modules/partner'));
const AsyncWarehouse = lazy(() => import('./modules/warehouse'));
const AsyncShipment = lazy(() => import('./modules/shipment'));
const AsyncProduct = lazy(() => import('./modules/product'));
const AsyncBatch = lazy(() => import('./modules/batch'));
const AsyncRelationMap = lazy(() => import('./modules/relationMap'));
const AsyncNotifications = lazy(() => import('./modules/notifications'));

const Routes = () => (
  <>
    <SideBar />
    <Suspense fallback={<LoadingIcon />}>
      <Router>
        <Authorized path="/">
          <DashBoard path="/" />
          <Order path="order/*" />
          <AsyncBatch path="batch/*" />
          <AsyncShipment path="shipment/*" />
          <AsyncProduct path="product/*" />
          <AsyncWarehouse path="warehouse/*" />
          <AsyncPartner path="partner/*" />
          <AsyncStaff path="staff/*" />
          <AsyncTags path="tags/*" />
          <AsyncRelationMap path="relation-map/*" />
          <AsyncNotifications path="notifications/*" />
          <PageNotFound default />
        </Authorized>
        <Login path="/login" redirectUrl="/order" />
        <NoPermission path="/403" />
        <PageNotFound default />
      </Router>
    </Suspense>
  </>
);

export default hot(module)(Routes);
