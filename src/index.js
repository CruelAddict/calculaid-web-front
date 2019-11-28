import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import App from './App';
import store from './modules/store'
import Provider from "react-redux/es/components/Provider";

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
