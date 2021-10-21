import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import React, { lazy, Suspense } from 'react'

import AuthRoute from './components/AuthRoute'

import Home from './pages/Home'
// import CityList from './pages/CityList'
// import Map from './pages/Map'
// import HouseDetail from './pages/HouseDetail'
// import Login from './pages/Login'
// import Registe from './pages/Registe'
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'

// improve performance by use React.lazy and Suspense
const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const Registe = lazy(() => import('./pages/Registe'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div className='router-loading'>Loading...</div>}>
        <div className='App'>
          {/* router link nav */}
          {/* route rule */}
          <Route exact path='/' render={() => <Redirect to='/home' />} />
          <Route path='/home' component={Home}></Route>
          <Route path='/citylist' component={CityList}></Route>
          <Route path='/map' component={Map}></Route>
          <Route path='/detail/:id' component={HouseDetail}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/registe' component={Registe}></Route>
          <AuthRoute exact path='/rent' component={Rent}></AuthRoute>
          <AuthRoute path='/rent/add' component={RentAdd}></AuthRoute>
          <AuthRoute path='/rent/search' component={RentSearch}></AuthRoute>
        </div>
      </Suspense>
    </Router>
  )
}

export default App
