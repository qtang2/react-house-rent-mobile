import React from 'react'
import axios from 'axios'
import './index.scss'
import { getCurrentCity } from '../../utils/index'

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

// navigator.geolocation.getCurrentPosition can only get latitude and longitude and some basic information
// but we need city name information
// navigator.geolocation.getCurrentPosition((position) => {
//   console.log('current pos ', position)
// })

const navs = [
  {
    id: 0,
    img: nav1,
    title: '整租',
    path: '/home/list',
  },
  {
    id: 1,
    img: nav2,
    title: '合租',
    path: '/home/list',
  },
  {
    id: 2,
    img: nav3,
    title: '地图找房',
    path: '/home/map',
  },
  {
    id: 3,
    img: nav4,
    title: '去出租',
    path: '/home/list',
  },
]

export default class Index extends React.Component {
  state = {
    // pictures
    swipers: [],
    groups: [],
    news: [],
    currentCityName: '',
    // indicate picture loading state to fix carousel display problem
    isSwiperLoaded: false,
  }
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // get city location
    const currCity = await getCurrentCity()
    this.setState({
      currentCityName: currCity.label,
    })
  }

  // get carousel pictures
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')

    this.setState({
      swipers: res.data.body,
      isSwiperLoaded: true,
    })
  }

  // get groups info
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0',
      },
    })

    this.setState({
      groups: res.data.body,
    })
  }

  // get news info
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0',
      },
    })

    this.setState({
      news: res.data.body,
    })
  }

  // all renders

  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href='https://qiantangportfolio.herokuapp.com/'
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212,
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt={item.alt}
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  renderNavs() {
    return navs.map((item) => (
      <Flex.Item
        onClick={() => this.props.history.push(item.path)}
        key={item.id}
      >
        <img src={item.img} alt='' />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }

  renderGroupItem(item) {
    return (
      <Flex className='group-item' justify='around' key={item.id}>
        <div className='desc'>
          <p className='title'>{item.title}</p>
          <span className='info'>{item.desc}</span>
        </div>
        <img src={`http://localhost:8080${item.imgSrc}`} alt='' />
      </Flex>
    )
  }

  renderNews() {
    return this.state.news.map((item) => (
      <div className='news-item' key={item.id}>
        <div className='imgwrap'>
          <img
            className='img'
            src={`http://localhost:8080${item.imgSrc}`}
            alt=''
          />
        </div>
        <Flex className='content' direction='column' justify='between'>
          <h3 className='title'>{item.title}</h3>
          <Flex className='info' justify='between'>
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className='index'>
        {/* banner */}
        <div className='swipers'>
          {/* banner */}
          {this.state.isSwiperLoaded ? (
            <Carousel autoplay infinite autoplayInterval='2000'>
              {/* render swipers */}
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}

          {/* Search box */}
          <Flex className='search-box'>
            {/* 左侧白色区域 */}
            <Flex className='search'>
              {/* 位置 */}
              <div
                className='location'
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className='name'>{this.state.currentCityName}</span>
                <i className='iconfont icon-arrow' />
              </div>

              {/* 搜索表单 */}
              <div
                className='form'
                onClick={() => this.props.history.push('/search')}
              >
                <i className='iconfont icon-seach' />
                <span className='text'>Input city, suburbs</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className='iconfont icon-map'
              onClick={() => this.props.history.push('/map')}
            />
          </Flex>
        </div>

        {/* Flex nav menu*/}
        <Flex className='nav'>{this.renderNavs()}</Flex>

        {/* rent groups */}
        <div className='group'>
          <h3 className='group-title'>
            Rent Groups <span className='more'>More</span>
          </h3>

          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => this.renderGroupItem(item)}
          ></Grid>
        </div>

        {/* news */}
        <div className='news'>
          <h3 className='group-title'>News</h3>
          <WingBlank size='md'>{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
