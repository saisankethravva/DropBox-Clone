import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPage from './components/UserPage';
import './index.css';
import App from './App';

import { Router as BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import {createBrowserHistory} from 'history';
import LogInPage from './components/LogInPage';

const hist =  createBrowserHistory();
const route = (
    <BrowserRouter history={hist}>
        <div>
            <Switch>
                <Route path="/" component={App}/>
                <Route path="/login" component={LogInPage}/>
                <Route path="/user" component={UserPage} />

            </Switch>
        </div>
    </BrowserRouter>
)

ReactDOM.render(route, document.getElementById('root'));
