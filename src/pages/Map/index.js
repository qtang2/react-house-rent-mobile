import React from 'react'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'
import HouseItem from '../../components/HouseItem'

const BMapGL = window.BMapGL
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255,0,0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rbg(255,255,255)',
  textAlign: 'center',
}
export default class Map extends React.Component {
  state = {
    houseList: [],
    isShowList: false,
  }
  componentDidMount() {
    this.initMap()
  }

  initMap() {
    // get current city
    const { label, value } = JSON.parse(localStorage.getItem('houserent_city'))

    // create map instance
    // in react cli, global object need to use window to access
    var map = new BMapGL.Map('container')

    // give this map attri
    this.map = map

    const myGeo = new BMapGL.Geocoder()

    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          map.centerAndZoom(point, 11)

          // map controls
          map.addControl(new BMapGL.ZoomControl())
          map.addControl(new BMapGL.ScaleControl())

          this.renderOverLays(value)
        }
      },
      label
    )

    map.addEventListener('movestart', () => {
      if (this.state.isShowList) {
        this.setState({ isShowList: false })
      }
    })
  }

  async renderOverLays(id) {
    try {
      Toast.loading('loading...', 0, null, false)

      const res = await API.get(`/area/map?id=${id}`)

      Toast.hide()

      const { nextZoom, type } = this.getTypeAndZoom()

      res.data.body.forEach((item) => {
        this.createOverlays(item, nextZoom, type)
      })
    } catch (e) {
      Toast.hide()
      console.log('renderOverLays error ', e)
    }
  }

  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value,
    } = data

    const areaPoint = new BMapGL.Point(longitude, latitude)

    if (type === 'circle') {
      // suburb
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      // community
      this.createRect(areaPoint, areaName, count, value)
    }
  }

  createCircle(point, name, count, id, zoom) {
    const label = new BMapGL.Label('', {
      position: point,
      offset: new BMapGL.Size(-35, -35),
    })

    // set content
    label.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${name}</p>
      <p>${count}套</p>
    </div>
    `)

    // set label style
    label.setStyle(labelStyle)

    // add click event to label
    label.addEventListener('click', () => {
      // get next level overlays
      this.renderOverLays(id)

      // zoom map and put point in the middle
      this.map.centerAndZoom(point, zoom)

      // baidu api error fix
      setTimeout(() => {
        // clear other overlays
        this.map.clearOverlays()
      }, 0)
    })

    // add label to map
    this.map.addOverlay(label)
  }

  createRect(point, name, count, id) {
    const label = new BMapGL.Label('', {
      position: point,
      offset: new BMapGL.Size(-50, -28),
    })

    // set content
    label.setContent(`
    <div class="${styles.rect}">
      <p class="${styles.housename}">${name}</p>
      <p  class="${styles.housenum}">${count}套</p>
      <i  class="${styles.arrow}"></i>
    </div>
    `)

    // set label style
    label.setStyle(labelStyle)

    // add click event to label
    label.addEventListener('click', ({ type, target }) => {
      this.getHousesList(id)

      this.map.panBy(
        window.innerWidth / 2 - target.domElement.offsetLeft,
        (window.innerHeight - 330) / 2 - target.domElement.offsetTop
      )
    })

    // add label to map
    this.map.addOverlay(label)
  }

  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let nextZoom, type

    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      type = 'rect'
    }

    return { nextZoom, type }
  }

  async getHousesList(id) {
    try {
      Toast.loading('loading...', 0, null, false)

      const res = await API.get(`/houses?cityId=${id}`)

      Toast.hide()

      this.setState({
        houseList: res.data.body.list,
        isShowList: true,
      })
    } catch (e) {
      Toast.hide()
      console.log('getHousesList error ', e)
    }
  }

  renderHousesList() {
    return this.state.houseList.map((item) => {
      const { houseCode, houseImg, title, desc, tags, price } = item
      const src = BASE_URL + houseImg
      return (
        <HouseItem
          key={houseCode}
          src={src}
          title={title}
          desc={desc}
          tags={tags}
          price={price}
        />
      )
    })
  }

  render() {
    return (
      <div className={styles.map}>
        {/* navheader cannot get route information since it is not direct route component */}
        <NavHeader>Find House</NavHeader>

        {/* map */}
        <div id='container' className={styles.container}></div>

        {/* house list */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : '',
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>House List</h1>
            <Link className={styles.titleMore} to='/home/list'>
              More
            </Link>
          </div>
          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    )
  }
}
