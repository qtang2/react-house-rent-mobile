import React from 'react'
import ReactDOM from 'react-dom'

// index.css must behind third-party css
import 'antd-mobile/dist/antd-mobile.css'
import 'react-virtualized/styles.css'
import './assets/fonts/iconfont.css'
import './index.css'

// component import need to put after style
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
