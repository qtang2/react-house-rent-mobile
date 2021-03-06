import React from 'react'
import { Flex } from 'antd-mobile'
import PropTypes from 'prop-types'
import './index.scss'

import { withRouter } from 'react-router'

SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired,
  className: PropTypes.string,
}

function SearchHeader({ history, cityName, className }) {
  return (
    <Flex className={['search-box', className || ''].join(' ')}>
      {/* 左侧白色区域 */}
      <Flex className='search'>
        {/* 位置 */}
        <div className='location' onClick={() => history.push('/citylist')}>
          <span className='name'>{cityName}</span>
          <i className='iconfont icon-arrow' />
        </div>

        {/* 搜索表单 */}
        <div className='form' onClick={() => history.push('/search')}>
          <i className='iconfont icon-seach' />
          <span className='text'>Input city, suburbs</span>
        </div>
      </Flex>
      {/* 右侧地图图标 */}
      <i className='iconfont icon-map' onClick={() => history.push('/map')} />
    </Flex>
  )
}

export default withRouter(SearchHeader)
