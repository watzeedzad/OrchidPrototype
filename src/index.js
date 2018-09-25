import { createStore, applyMiddleware, compose  } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';

import reducers from './redux/reducers';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes'
import jwtDecode from 'jwt-decode'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunk)
))

ReactDOM.render(
    <Provider store={store}>
    <Router
        history={browserHistory}
        routes={routes}
    />
    </Provider>
    ,document.getElementById('root')
);

registerServiceWorker();
