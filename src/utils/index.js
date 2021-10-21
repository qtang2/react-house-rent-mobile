import axios from 'axios'

export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem('houserent_city'))
  // no current city
  if (!localCity) {
    return new Promise((resolve, reject) => {
      var curCity = new window.BMapGL.LocalCity()
      curCity.get(async (res) => {
        try {
          // In this project, if location is not '北京 上海 广州 深圳', then by default it will get '上海' house info
          const result = await axios.get(
            `http://localhost:8080/area/info?name=${res.name}`
          )

          // save to local storage
          localStorage.setItem(
            'houserent_city',
            JSON.stringify(result.data.body)
          )

          // return current city info
          resolve(result.data.body)
        } catch (e) {
          reject(e)
        }
      })
    })
    // get city location
  }

  // has current city, return a successful promise
  return Promise.resolve(localCity)
}

export { API } from './api'
export { BASE_URL } from './url'

export * from './auth'

export * from './city'
