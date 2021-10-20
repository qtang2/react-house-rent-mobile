import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <div className='App'>
        {/* router link nav */}
        {/* route rule */}
        <Route exact path='/' render={() => <Redirect to='/home' />} />
        <Route path='/home' component={Home}></Route>
        <Route path='/citylist' component={CityList}></Route>
        <Route path='/map' component={Map}></Route>
        <Route path='/detail/:id' component={HouseDetail}></Route>
        <Route path='/login' component={Login}></Route>
      </div>
    </Router>
  )
}

export default App
