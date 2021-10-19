import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue,
  }

  onTagClick(value) {
    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]

    const index = selectedValues.indexOf(value)

    if (index <= -1) {
      // not select the value
      newSelectedValues.push(value)
    } else {
      // already selected, cancel select
      newSelectedValues.splice(index, 1)
    }

    this.setState({
      selectedValues: newSelectedValues,
    })
  }
  // render filters
  renderFilters(data) {
    const { selectedValues } = this.state

    // 高亮类名： styles.tagActive
    return data.map((item) => {
      const isSelected = selectedValues.includes(item.value)
      return (
        <span
          onClick={() => this.onTagClick(item.value)}
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
        >
          {item.label}
        </span>
      )
    })
  }

  onCancel = () => {
    this.setState({
      selectedValues: [],
    })
  }

  onOk = () => {
    const { onSave, type } = this.props
    const { selectedValues } = this.state

    onSave(type, selectedValues)
  }

  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      onCancel,
      type,
    } = this.props

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText='清除'
          onCancel={this.onCancel}
          onOk={this.onOk}
        />
      </div>
    )
  }
}
