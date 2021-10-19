import { Flex, Toast } from 'antd-mobile'
import React from 'react'
import {
  AutoSizer,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized'

import SearchHeader from '../../components/SearchHeader'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import { getCurrentCity } from '../../utils'
import Filter from './components/Filter'

import styles from './index.module.css'

export default class HouseList extends React.Component {
  state = {
    list: [],
    count: 0,
    isLoading: false,
  }

  filters = {}
  label = ''
  value = ''

  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value
    this.searchHouseList()
  }

  async searchHouseList() {
    Toast.loading('Loading', 0, null, false)
    this.setState({
      isLoading: true,
    })
    const res = await API.get('/houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    })

    Toast.hide()

    const { list, count } = res.data.body
    if (count !== 0) {
      Toast.info(`Total ${count} houses`, 2, null, false)
    }

    this.setState({
      list,
      count,
      // loading data finish
      isLoading: false,
    })
  }

  onFilter = (filters) => {
    // back to top
    window.scrollTo(0, 0)

    this.filters = filters

    this.searchHouseList()
  }

  renderHouseListRow = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Important!! Style object to be applied to row (to position it)
  }) => {
    const { list } = this.state
    const house = list[index]

    // check if house exist
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    const { houseImg, title, desc, tags, price } = house
    const src = BASE_URL + houseImg
    return (
      <HouseItem
        key={key}
        style={style}
        src={src}
        title={title}
        desc={desc}
        tags={tags}
        price={price}
      />
    )
  }

  // 判断每一行数据是否加载完毕
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 用来获取更多房屋列表数据
  // 注意，该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve让 Promise对象的状态变为已完成
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise((resolve) => {
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex,
        },
      }).then((res) => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list],
        })
        resolve()
      })
    })
  }

  renderHouseList = () => {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>No house found, please change filter options</NoHouse>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // this is list height
                    width={width} // viewport width
                    height={height} // viewport height
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.renderHouseListRow}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* search header */}
        <Flex className={styles.header}>
          <i
            className='iconfont icon-back'
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={this.label} className={styles.searchHeader} />
        </Flex>

        {/* filter */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* house list */}
        <div className={styles.houseItems}>{this.renderHouseList()}</div>
      </div>
    )
  }
}
