import React from 'react'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import './index.css'

import News from '../News'
import Index from '../Index'
import Profile from '../Profile'
import HouseList from '../HouseList'

const tabItems = [
  {
    title: 'Home',
    icon: 'icon-ind',
    path: '/home',
  },
  {
    title: 'Find',
    icon: 'icon-findHouse',
    path: '/home/list',
  },
  {
    title: 'News',
    icon: 'icon-infom',
    path: '/home/news',
  },
  {
    title: 'My',
    icon: 'icon-my',
    path: '/home/profile',
  },
]

export default class Home extends React.Component {
  state = {
    // default selected tab
    selectedTab: this.props.location.pathname,
  }

  // listen to url change to highlight tabbar item
  // this is for when click other things then jump to tabbar route
  // 1. when url change, componentDidUpdate will be called
  // 2. in componentDidUpdate, set the hightlight logic again
  // 3. how to listen:Compare prevProps and current props to check location info is changed or not
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      // url changed
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }

  renderItems = () => {
    return tabItems.map((item) => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.title}
          icon={<i className={`iconfont ${item.icon}`}></i>}
          selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.setState({
              selectedTab: item.path,
            })
            this.props.history.push(item.path)
          }}
          data-seed='logId'
        />
      )
    })
  }

  render() {
    return (
      <div className='home'>
        {/* 2.3 sub route */}
        <Route exact path='/home' component={Index} />
        <Route path='/home/news' component={News} />
        <Route path='/home/list' component={HouseList} />
        <Route path='/home/profile' component={Profile} />

        {/* TabBar */}
        <TabBar
          unselectedTintColor='#949494'
          tintColor='#21b97a'
          noRenderContent={true}
        >
          {this.renderItems()}
        </TabBar>
      </div>
    )
  }
}
