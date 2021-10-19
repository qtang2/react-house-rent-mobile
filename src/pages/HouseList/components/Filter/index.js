import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { API } from '../../../../utils/api'

import styles from './index.module.css'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}

const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: [],
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // control filter picker and filter more hide/show
    openType: '',
    // all conditions of filter
    filtersData: {},
    // record all selected values
    selectedValues,
  }

  componentDidMount() {
    this.htmlBody = document.body
    this.getFiltersData()
  }

  // get filter data
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('houserent_city'))
    const res = await API.get(
      `http://localhost:8080/houses/condition?id=${value}`
    )

    this.setState({
      filtersData: res.data.body,
    })
  }

  // sub component call this method
  // so need to change this point
  onTitleClick = (type) => {
    this.htmlBody.className = 'body-fixed'

    const { titleSelectedStatus, selectedValues } = this.state

    const newSelectedStatus = { ...titleSelectedStatus }

    Object.keys(titleSelectedStatus).forEach((key) => {
      // highlight current tag and return current forEach round
      if (key === type) {
        newSelectedStatus[type] = true
        // return current function, but for each still running
        return
      }

      // loop all tag to check if they have value,  if no value , no highlight
      const selectedVal = selectedValues[key]
      if (
        key === 'area' &&
        (selectedVal.length !== 2 || selectedVal[0] !== 'area')
      ) {
        newSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        newSelectedStatus[key] = true
      } else {
        newSelectedStatus[key] = false
      }
    })

    this.setState({
      titleSelectedStatus: newSelectedStatus,
      openType: type,
    })
  }

  // when close also need to handle hightlight
  onCancel = (type) => {
    this.htmlBody.className = ''

    const { titleSelectedStatus, selectedValues } = this.state
    const newSelectedStatus = { ...titleSelectedStatus }

    const selectedVal = selectedValues[type]
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      newSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newSelectedStatus[type] = true
    } else {
      newSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newSelectedStatus,
    })
  }

  // save button clicked
  onSave = (type, value) => {
    this.htmlBody.className = ''

    // tag highlight handling
    const { titleSelectedStatus } = this.state
    const newSelectedStatus = { ...titleSelectedStatus }

    const selectedVal = value
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      newSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newSelectedStatus[type] = true
    } else {
      newSelectedStatus[type] = false
    }

    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value,
    }

    const { area, price, mode, more } = newSelectedValues

    const filters = {}

    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }

    filters[areaKey] = areaValue
    filters.price = price[0]
    filters.mode = mode[0]
    filters.more = more.join(',')

    // call father HouseList onFilter method
    this.props.onFilter(filters)

    this.setState({
      openType: '',
      titleSelectedStatus: newSelectedStatus,
      selectedValues: newSelectedValues,
    })
  }

  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues,
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price')
      return null

    // get data for picker view
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break

      default:
        break
    }

    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }

  renderFilterMore = () => {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic },
    } = this.state

    if (openType !== 'more') {
      return null
    }

    const data = { roomType, oriented, floor, characteristic }

    const defaultValue = selectedValues.more

    return (
      <FilterMore
        data={data}
        onSave={this.onSave}
        onCancel={this.onCancel}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }

  renderMask() {
    const { openType } = this.state
    const isHide = !['area', 'price', 'mode'].includes(openType)
    // Need to make sure always render Spring to show animation
    return (
      <Spring to={{ opacity: isHide ? 0 : 1 }}>
        {(props) => {
          // means finish animation
          if (props.opacity === 0) {
            return null
          }
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => this.onCancel(openType)}
            />
          )
        }}
      </Spring>
    )
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}
        {/* {['area', 'price', 'mode'].includes(openType) ? (
          <div
            className={styles.mask}
            onClick={() => this.onCancel(openType)}
          />
        ) : null} */}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
