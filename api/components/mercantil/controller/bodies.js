import config from '#config'

const merchant_identify = {
  integratorId: 31,
  merchantId: config.MERCANTIL.MERCHANT_ID,
  terminalId: 'abcde'
}

const client_identify = {
  ipaddress: "10.0.0.1",
  browser_agent: "Chrome 18.1.3",
  mobile: {
    manufacturer: "Samsung",
    model: "S9",
    os_version: "Oreo 9.1",
    location: {
      lat: 37.4224764,
      lng: -122.0842499
    }
  }
}

// Bodies
const getAuth = {
  merchant_identify,
  client_identify,
  transaction_authInfo: {
    trx_type: 'solaut',
    payment_method: 'tdd',
    card_number: "", // número de tarjeta. Ej: 501878200066287386
    customer_id: "" // cédula. Ej: V18366876
  }
}

const payTDD = {
  merchant_identify,
  client_identify: {
    ipaddress: '10.0.0.1',
    browser_agent: 'Chrome 18.1.3',
    mobile: {
      manufacturer: 'Samsung'
    }
  },
  transaction: {
    trx_type: 'compra',
    payment_method: 'tdd',
    card_number: '501878200066287386',
    customer_id: 'V18366876',
    invoice_number: '', // número de factura
    account_type: 'CC',
    twofactor_auth: '', //[cifrado] clave enviada al movil de la persona 
    expiration_date: '2021/11',
    cvv: '', //cifrado  GYlTecZmlHYu7KFTeDaWCQ==
    currency: 'ves',
    amount: 0
  }
}

const payTDC = {
  merchant_identify,
  client_identify,
  transaction: {
    trx_type: 'compra',
    payment_method: 'tdc',
    card_number: '501878200066287386',
    customer_id: 'V18366876',
    invoice_number: '', // número de factura
    //twofactor_auth: '', //[cifrado] clave enviada al movil de la persona 
    expiration_date: '2021/11',
    cvv: '', //cifrado  GYlTecZmlHYu7KFTeDaWCQ==
    currency: 'ves',
    amount: 0
  }
}

const payC2P = {
  merchant_identify,
  client_identify,
  transaction_c2p: {
    amount: 0,
    currency: 'ves',
    destination_bank_id: 105,
    destination_id: '', //Cifrado cedula persona pagadora
    destination_mobile_number: '', //Cifrado telefono persona pagadora
    payment_reference: '',
    origin_mobile_number: '', //Cifrado empresa/comercio que realizará el cobro
    trx_type: 'compra',
    payment_method: 'c2p',
    invoice_number: '', // número de factura
    twofactor_auth: '', //[cifrado] clave enviada al movil de la persona (Clave de compra)
  }
}

const payC2PVuelto = {
  merchant_identify,
  client_identify,
  transaction_c2p: {
    amount: 0,
    currency: 'ves',
    destination_bank_id: 105, //Es el código del  banco donde se encuentra afiliado el número del móvil de la persona pagadora. 
    destination_id: '', //Cifrado
    destination_mobile_number: '', //Cifrado
    payment_reference: '', // Número de referencia de la transacción. Requerido cuando el tipo de transacción trx_type=“anulacion” 
    origin_mobile_number: '', //Cifrado
    trx_type: 'vuelto',
    payment_method: 'p2p',
    invoice_number: '', // número de factura
    twofactor_auth: '', //[cifrado] clave enviada al movil de la persona 
  }
}

const search = {
  merchant_identify,
  client_identify,
  search_by: {
    search_criteria: "all",
    procesing_date: "2022/03/25"
  }

}

const keyRequest = {
  merchant_identify,
  client_identify,
  transaction_scpInfo: {
    destination_id: "", //cedula cifrada
    destination_mobile_number: "" //número de teléfono cifrado
  }
}

export default {
  getAuth,
  payTDD,
  payTDC,
  payC2P,
  payC2PVuelto,
  search,
  keyRequest
}