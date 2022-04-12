import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

import store from 'redux/store/index';
import { App } from "containers/index";

// Pendo Library
import './utils/pendo'

import "./assets/sass/_imports.scss";

ReactDOM.render(
    
    <Provider store={store}>
        
        <React.StrictMode>

                <BrowserRouter> 

                    <App />

                </BrowserRouter>

        </React.StrictMode>
    
    </Provider>,
    
    document.getElementById("root")
);
