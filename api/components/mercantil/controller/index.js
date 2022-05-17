import config from '#config'
import ctrl from './controller.js'

let store, cache

/* if (config.remoteDB === true) {
  store = import('#store/remote-mysql')
  cache = import('#store/remote-cache')
} else {
  store = import('#store/mssql')
  cache = import('#store/redis')
} */


export default ctrl(store, cache)