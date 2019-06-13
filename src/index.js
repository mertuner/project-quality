import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import postReducer from './store/reducers/post';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';

//Install ReduxDevTool -- Chrome Extension available

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;





// Later change it with combineStores
const rootReducer = combineReducers({
    post: postReducer,
    auth: authReducer,
    user: userReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));



ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
