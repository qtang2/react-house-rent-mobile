import React from 'react'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'

const BMapGL = window.BMapGL
export default class Map extends React.Component {
  componentDidMount() {
    this.initMap()
  }

  initMap() {
    // get current city
    const { label } = JSON.parse(localStorage.getItem('houserent_city'))

    // create map instance
    // in react cli, global object need to use window to access
    var map = new BMapGL.Map('container')

    const myGeo = new BMapGL.Geocoder()

    myGeo.getPoint(
      label,
      (point) => {
        if (point) {
          map.centerAndZoom(point, 11)
          map.addControl(new BMapGL.ZoomControl())
          map.addControl(new BMapGL.ScaleControl())
        }
      },
      label
    )
  }
  render() {
    return (
      <div className={styles.map}>
        {/* navheader cannot get route information since it is not direct route component */}
        <NavHeader>Find House</NavHeader>
        <div id='container' className={styles.container}></div>
      </div>
    )
  }
}
