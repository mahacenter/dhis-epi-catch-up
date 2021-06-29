import React from 'react'
import { CssReset } from '@dhis2/ui-core'
import { Provider } from '@dhis2/app-runtime'
import { HeaderBar } from '@dhis2/ui-widgets'
import { Main } from '../Main'
import 'typeface-roboto'
import './style.css'

const config = {
    baseUrl: process.env.REACT_APP_DHIS2_BASE_URL,
    apiVersion: process.env.REACT_APP_DHIS2_API_VERSION,
}

export const App = ({ appName, appProps }) => (
    <Provider config={config}>
            <CssReset />
            <HeaderBar appName={appName} appProps={appProps} />
            <Main />
    </Provider>
)
