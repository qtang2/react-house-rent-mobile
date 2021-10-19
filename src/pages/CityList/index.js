import React from 'react'
import { Toast } from 'antd-mobile'
import './index.scss'
import { getCurrentCity } from '../../utils/index'
import { List, AutoSizer } from 'react-virtualized'

import NavHeader from '../../components/NavHeader'
import { API } from '../../utils/api'

const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

// format city list data
const formatCityData = (list) => {
  const cityList = {} // {'a': [...], 'b': []}

  list.forEach((item) => {
    const firstLetter = item.short.substr(0, 1)

    if (cityList[firstLetter]) {
      cityList[firstLetter].push(item)
    } else {
      cityList[firstLetter] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort() // ['a', 'b', 'c']

  return { cityList, cityIndex }
}

const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return 'Current location'
    case 'hot':
      return 'Hot city'
    default:
      return letter.toUpperCase()
  }
}

export default class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    }

    this.cityListCompnent = React.createRef()
  }

  async componentDidMount() {
    await this.getCityList()

    // in order to jump to exact letter city, use measureAllRows to calculate all rows height in advance
    // but it need to be done after we have citylist data
    this.cityListCompnent.current.measureAllRows()
  }

  async getCityList() {
    // get city list

    const res = await API.get('/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(res.data.body)

    // get hot city list
    const hotRes = await API.get('/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')

    // get current city
    const currCity = await getCurrentCity()
    cityList['#'] = [currCity]
    cityIndex.unshift('#')

    this.setState({
      cityList,
      cityIndex,
    })
  }

  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  changeCity({ label, value }) {
    // only 4 cities has house info
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('houserent_city', JSON.stringify({ label, value }))

      this.props.history.go(-1)
    } else {
      Toast.info('No house information currently ', 2, null, false)
    }
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Important!! Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    const cities = cityList[letter]
    return (
      <div key={key} style={style} className='city'>
        <div className='title'>{formatCityIndex(letter)}</div>
        {cities.map((item) => (
          <div
            className='name'
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li
        className='city-index-item'
        key={item}
        onClick={() => {
          this.cityListCompnent.current.scrollToRow(index)
        }}
      >
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      })
    }
  }

  render() {
    return (
      <div className='citylist'>
        {/* top nav */}
        <NavHeader>Choose City</NavHeader>

        {/* city list */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.cityListCompnent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              // not exact, because only when row height is known then can jump
              // so use measureAllRows to exact jump
              onRowsRendered={this.onRowsRendered}
              // make sure current letter list show at the top
              scrollToAlignment='start'
            />
          )}
        </AutoSizer>

        {/* right index list */}
        <ul className='city-index'>{this.renderCityIndex()}</ul>
      </div>
    )
  }
}
