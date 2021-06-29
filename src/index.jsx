import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { App } from './components/App'

/**
 * This is what is displayed in the header bar
 */
const appName = 'EPI catch-up app: Appraisal of needs for catch-up vaccination campaigns and follow-up';

const rootElement = document.getElementById('root')

ReactDOM.render(<App appName={appName} appProps={'ets'} />, rootElement)

serviceWorker.unregister()
