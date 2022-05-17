import 'dotenv/config'
const config = {
  API: {
    PORT: process.env.API_PORT || 3001
  },
  MERCANTIL: {
    DEV: process.env.MERCANTIL_DEV === 'false' ? false : true,
    MERCHANT_ID: process.env.MERCANTIL_MERCHANT_ID,
    CLAVE_CIFRADO: process.env.MERCANTIL_CLAVE_CIFRADO,
    X_IBM_CLIENT_ID: process.env.MERCANTIL_X_IBM_CLIENT_ID,
  }
}

console.log({ config })
export default config 