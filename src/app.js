import React from 'react'
import { Route,Switch } from 'react-router-dom'

import 'antd/dist/antd.css'
import './assets/common.sass'
import routes from './routes';

export default () => (
    <Switch>
        {
            routes.map(({name, path, exact=true,component}) => (
               <Route path={path} exact={exact} component={component} key={name}/>
            ))
        }
    </Switch>
)