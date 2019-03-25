// @flow
import * as React from 'react';
import { hydrate, render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import UNSTATED from 'unstated-debug';
import FullStory from 'react-fullstory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationProvider from './modules/authentication';
import LanguageProvider from './modules/language';
import UIProvider from './modules/ui';
import apolloClient from './apollo';
import Routes from './routes';
import loadFonts from './fonts';
import { isEnableStrictMode, isAppInProduction } from './utils/env';
import logger from './utils/logger';
import errorReport from './errorReport';
import './styles/reset.css';
import * as serviceWorker from './serviceWorker';
import DeployNotifier from './components/DeployNotifier';

loadFonts();
errorReport();

UNSTATED.isEnabled = !isAppInProduction;

const container = document.querySelector('#root');

if (!container) {
  throw new Error(`couldn't find element with id root`);
}

const renderApp = (Component, renderFn) => {
  renderFn(
    <div>
      {isAppInProduction && <FullStory org={process.env.ZENPORT_FULLSTORY_ID} />}
      {isAppInProduction && (
        <DeployNotifier
          revision={process.env.ZENPORT_FIREBASE_DEPLOY_REVISION || ''}
          revisionKey={process.env.ZENPORT_FIREBASE_REVISION_KEY || ''}
        />
      )}
      <ApolloProvider client={apolloClient}>
        <AuthenticationProvider>
          <LanguageProvider>
            <UIProvider>
              {isEnableStrictMode ? (
                <React.StrictMode>
                  <Component />
                </React.StrictMode>
              ) : (
                <Component />
              )}
            </UIProvider>
          </LanguageProvider>
        </AuthenticationProvider>
      </ApolloProvider>

      <ToastContainer />
    </div>,
    container
  );
};

if (container.hasChildNodes()) {
  renderApp(Routes, hydrate);
} else {
  renderApp(Routes, render);
}

serviceWorker.register({
  onUpdate: registration => {
    // TODO: notify our client with toastr
    logger.warn(
      'New content is available and will be used when all tabs for this page are closed',
      registration
    );
    // manual update, refer https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#manual_updates
    registration.update();
  },
  onSuccess: registration => {
    logger.warn('Content is cached for offline use.', registration);
  },
});
