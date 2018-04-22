import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';

import reducers from './redux/reducers';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes'

const store = createStore(
    reducers,
    applyMiddleware(thunk)
)

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
