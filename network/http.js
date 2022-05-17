import axios from 'axios'
import HttpException from '#utils/HttpException.js'
// const host = config.host
const host = ''

const setUrl = (url = '', query = {}) => {
  url = url.startsWith('http://') || url.startsWith('https://') ? url : `${host}/${url}`

  const queryParams = Object.entries(query).reduce((acc, [key, value]) => {
    const separator = acc ? '&' : '?'
    return acc.concat(`${separator}${key}=${value}`)
  }, '')
  // console.log({ url, queryParams, urlFinal: url + queryParams })
  return url + queryParams
}

const handleError = (msgHead, err) => {
  // console.log(`handleError`, { err })
  console.log(`handleError response`, err.response.data )
  const { message, statusCode } = err
  console.log({ message, statusCode })
  return HttpException(`${msgHead} ${message}`, statusCode)
}

/* const getToken = () => {
    const tokenStorage = window.localStorage.getItem('token')
    const accessToken = tokenStorage ? `Bearer ${tokenStorage}` : ''
    return accessToken
} */
const getToken = () => ({})


// INTERCEPTORS
axios.interceptors.request.use(config => {
  // console.log('[axios] interceptors - request', { config })
  console.log(`[${config.method}] ${config.url}`)
  return config
}, err => ({ error: handleError('[request]', err) }))

axios.interceptors.response.use(res => {
  console.log('[axios] interceptors - response', { res })
  if (!res) return HttpException('No se obtuvo respuesta, por favor verifique su conexión a internet.')
  return res
}, err => ({ error: handleError('[axios] interceptors - response', err) }))


// Class for http requests
class Http {
  static instance = null

  static get getInstance() {
    if (Http.instance === null) Http.instance = new Http()
    return Http.instance
  }

  get = ({ url, query, headers = {} }) =>
    axios.get(setUrl(url, query), {
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(`[GET] ${url}:`, err) })

  post = ({ url, query, body = {}, headers = {} }) =>
    axios.post(setUrl(url, query), body, {
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(`[POST] ${url}:`, err) })

  put = ({ url, query, body = {}, headers = {} }) =>
    axios.put(setUrl(url, query), body, {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(`[PUT] ${url}:`, err) })

  patch = ({ url, query, body = {}, headers = {} }) =>
    axios.patch(setUrl(url, query), body, {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(`[PATCH] ${url}:`, err) })

  delete = (url, query, headers = {}) =>
    axios.delete(setUrl(url, query), {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(`[DELETE] ${url}:`, err) })

}

export default Http.getInstance