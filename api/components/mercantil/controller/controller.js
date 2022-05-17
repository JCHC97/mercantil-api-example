import fs from 'fs'
import path from 'path'
import http from '#network/http.js'
import config from '#config'
import bodies from './bodies.js'
import AesCipher from '../AesCipher.js'
import HttpException from '#utils/HttpException.js'

// cifrar un texto con la calve de Mercantil
const cipher = text => {
  let keyhash = AesCipher.createKeyhash(config.MERCANTIL.CLAVE_CIFRADO)
  return AesCipher.encrypt(keyhash, text)
}

// decifrar un texto con la calve de Mercantil
const decipher = text => {
  let keyhash = AesCipher.createKeyhash(config.MERCANTIL.CLAVE_CIFRADO)
  return AesCipher.decrypt(keyhash, text)
}

// @return agreaga al objeto los campos decifrados
const addFieldsDecipher = (obj, fields) => {
  fields.forEach(e => {
    const eDecipher = decipher(obj[e])
    obj[`${e}_decipher`] = eDecipher
  })
  return obj
}

const controller = function (injectedStore, injectedCache) {
  let store = injectedStore
  let cache = injectedCache
  if (!store) store = import('#store/dummy.js')
  if (!cache) cache = import('#store/dummy.js')

  const url = {
    dev: 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1',
    production: 'https://apimbu.mercantilbanco.com/mercantil-banco/prod/v1'
  }
  const BASE_URL = config.MERCANTIL.DEV ? url.dev : url.production
  const headers = { 'X-IBM-Client-Id': config.MERCANTIL.X_IBM_CLIENT_ID }
  const SESSION_FILE_PATH = path.join('api', 'components', 'mercantil', 'controller', 'authentication.json')
  // Leer datos de autenticación
  // let authentication = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf8'))

  function test() {
    return http.get({ url: 'https://rickandmortyapi.com/api/character/3' })
      .then(({ data, status }) => {
        console.log({ data, status })
        return { ...data, info: 'Testing the endpoint Mercantil! is fine!' }
      })
      .catch(err => console.error({ err }))
  }

  async function getAuth(dataAuth) {
    if (!dataAuth) throw HttpException('[getAuth] La función debe recibir un objeto dataAuth.')
    if (!dataAuth.card_number || !dataAuth.customer_id)
      throw HttpException('[getAuth] La tarjeta (card_number) y la cédula (customer_id) son campos requeridos.')

    const url = `${BASE_URL}/payment/getauth`
    const body = bodies.getAuth
    body.transaction_authInfo.card_number = dataAuth.card_number
    body.transaction_authInfo.customer_id = dataAuth.customer_id

    return http.post({ url, headers, body })
      .then(({ data, error }) => {
        if (error) throw error
        const fieldsCipher = ['twofactor_field_type', 'twofactor_lenght', 'twofactor_type', 'twofactor_label']
        data['authentication_info'] = addFieldsDecipher(data['authentication_info'], fieldsCipher)

        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(data['authentication_info']), { flag: 'w+' },
          (err) => { if (err) { throw err } }
        )

        return data
      })
      .catch(err => { throw err })
  }

  async function payTDD(dataPay) {
    const url = `${BASE_URL}/payment/pay`
    let body = bodies.payTDD

    // valores de la transaccion
    body.transaction.twofactor_auth = cipher(dataPay.otp)
    body.transaction.cvv = cipher(dataPay.cvv)

    body.transaction.amount = dataPay.amount
    body.transaction.card_number = dataPay.card_number
    body.transaction.customer_id = dataPay.customer_id
    body.transaction.expiration_date = dataPay.expiration_date
    body.transaction.invoice_number = dataPay.invoice_number

    /* Verify encryption 
      body.transaction.cvvPlain = dataPay.cvv
      body.transaction.cvvDecrypted = decipher(body.transaction.cvv)
      body.transaction.otpPlain = dataPay.otp
      body.transaction.otpDecrypted = decipher(body.transaction.twofactor_auth) */
    //agregar OTP - 

    console.log({ body })
    return http.post({ url, headers, body })
      .then(({ data, error }) => {
        console.log({ data, error })
        if (error) throw error
        return data
      })
      .catch(err => { throw err })
  }

  async function payTDC(dataPay) {
    const url = `${BASE_URL}/payment/pay`
    let body = bodies.payTDC

    // valores de la transaccion
    // body.transaction.twofactor_auth = cipher(dataPay.otp)
    body.transaction.cvv = cipher(dataPay.cvv)

    body.transaction.amount = dataPay.amount
    body.transaction.card_number = dataPay.card_number
    body.transaction.customer_id = dataPay.customer_id
    body.transaction.expiration_date = dataPay.expiration_date
    body.transaction.invoice_number = dataPay.invoice_number

    /* Verify encryption 
      body.transaction.cvvPlain = dataPay.cvv
      body.transaction.cvvDecrypted = decipher(body.transaction.cvv)
      body.transaction.otpPlain = dataPay.otp
      body.transaction.otpDecrypted = decipher(body.transaction.twofactor_auth) */
    //agregar OTP - 

    console.log({ body })
    return http.post({ url, headers, body })
      .then(({ data, error }) => {
        console.log({ data, error })
        if (error) throw error
        return data
      })
      .catch(err => { throw err })
  }

  async function payC2P(dataPay) {
    if (!dataPay) throw HttpException('[payC2P] La función debe recibir un objeto dataPay.')
    if (!dataPay.destination_id || !dataPay.destination_mobile_number || !dataPay.origin_mobile_number)
      throw HttpException('[payC2P] La tarjeta (card_number) y la cédula (customer_id) son campos requeridos.')

    const url = `${BASE_URL}/payment/c2p`
    let body = bodies.payC2P

    // valores de la transaccion
    body.transaction_c2p.twofactor_auth = cipher(dataPay.otp)
    body.transaction_c2p.destination_id = cipher(dataPay.destination_id)
    body.transaction_c2p.destination_mobile_number = cipher(dataPay.destination_mobile_number)
    body.transaction_c2p.origin_mobile_number = cipher(dataPay.origin_mobile_number)

    body.transaction_c2p.amount = dataPay.amount
    // body.transaction_c2p.payment_reference = dataPay.payment_reference
    body.transaction_c2p.invoice_number = dataPay.invoice_number

    console.log({ body })
    return http.post({ url, headers, body })
      .then(({ data, error }) => {
        console.log({ data, error })
        if (error) throw error
        return data
      })
      .catch(err => { throw err })
  }

  async function search(dataSearch) {
    const url = `${BASE_URL}/payment/search`
    let body = bodies.search

    // valores de búsqueda
    body.search_by.search_criteria = "all"
    body.search_by.procesing_date = dataSearch.fecha

    console.log({ body })
    return http.post({ url, headers, body })
      .then(({ data, error }) => {
        if (error) throw error
        return data
      })
      .catch(err => { throw err })
  }

  async function keyRequest(dataDest) {
    const url = `${BASE_URL}/mobile-payment/scp`
    let body = bodies.keyRequest

    // valores de búsqueda
    body.transaction_scpInfo.destination_id = cipher(dataDest.destination_id)
    body.transaction_scpInfo.destination_mobile_number = cipher(dataDest.destination_mobile_number)

    console.log({ body })
    return http.post({ url, headers, body })
      .then(({ data, error }) => {
        if (error) throw error
        return data
      })
      .catch(err => { throw err })
  }

  return {
    test,
    getAuth,
    payTDD,
    payTDC,
    payC2P,
    search,
    keyRequest
  }
}

export default controller
