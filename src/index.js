import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes'
import { Router, browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//import reducers from './redux/reducers';
import { Provider } from 'react-redux';

const store = createStore(
    //reducers,
    applyMiddleware(thunk)
)

ReactDOM.render(
    <Provider store={store}>
    <Router
        history={browserHistory}
        routes={routes}
    />
    </Provider>
, document.getElementById('root')
);
registerServiceWorker();
