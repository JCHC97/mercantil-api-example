import crypto from 'crypto'
import config from '#config'
// import { Buffer } from 'buffer'

class AesCipher {
  static OPENSSL_CIPHER_NAME = 'aes-128-ecb'
  static CIPHER_KEY_LEN = 16 //128 bits

  /* Encripta datos en AES ECB de 128 bit key
      @param keybank - Clave enviada 
      @return keybankhash Hash en sha256 de 16bytes de la clave enviada por el banco (tipo Buffer)
    */
  static createKeyhash(keybank) {
    keybank.toString('utf8')
    let keybankhash = crypto.createHash('sha256').update(keybank).digest()
    keybankhash = keybankhash.slice(0, AesCipher.CIPHER_KEY_LEN)
    return keybankhash
  }

  /*Selecciona los primeros 16 byte del hash de la clave
    @param key - Hash en sha 256 de la clave enviada por el banco
    @return key 16 bytes de del hash de la clave enviada por el Banco
  */
  static fixKey(key) {
    if (key.length < AesCipher.CIPHER_KEY_LEN) {
      //'0' pad to len 16
      return key.padEnd(AesCipher.CIPHER_KEY_LEN, "0")
    }

    if (key.length > AesCipher.CIPHER_KEY_LEN) {
      //truncate to CIPHER_KEY_LEN bytes
      return key.slice(0, AesCipher.CIPHER_KEY_LEN)
    }

    return key
  }

  /* Encripta datos en AES ECB de 128 bit key
  @param key - Clave enviada por el banco debe ser de 16 bytes en sha-256
  @param data - Datos a ser cifrados
  @return encrypted Datos cifrados
  */
  static encrypt(key, data, inputEncoding = 'utf8', outputEncoding = 'base64') {
    // const iv = crypto.randomBytes(16)
    data = data.toString()
    key = AesCipher.fixKey(key)
    const cipher = crypto.createCipheriv(AesCipher.OPENSSL_CIPHER_NAME, key, null)
    let encrypted = cipher.update(data, inputEncoding, outputEncoding)
    encrypted += cipher.final(outputEncoding)
    return encrypted
  }


  /* Desencripta datos en AES ECB de 128 bit key
      @param type $key - Clave enviada por el banco debe ser de 16 bytes en sha-256 (tipo Buffer)
      @param type $cipherData - Datos a ser descifrados
      @return decrypted Datos Desencriptados
    */
  static decrypt(key, dataEncrypted, inputEncoding = 'base64', outputEncoding = 'utf8') {
    // const iv = new Uint8Array(16)
    key = AesCipher.fixKey(key)
    const decipher = crypto.createDecipheriv(AesCipher.OPENSSL_CIPHER_NAME, key, null)
    let decrypted = decipher.update(dataEncrypted, inputEncoding, outputEncoding)
    decrypted += decipher.final(outputEncoding)
    return decrypted
  }
}

// Ejemplo para cifrar y descifrar datos intercambios pos los API de Mercantil Banco 
const showExample = show => {
  if (!show) return

  let cvv = '752' // CVV a Encripta
  let keybank = config.MERCANTIL.CLAVE_CIFRADO // Clave secreta enviada por el Banco

  // Generacion del hash a partir de la clave secreta del banco
  let keyhash = AesCipher.createKeyhash(keybank)
  // Encripta el CVV
  let cvvEncrypt = AesCipher.encrypt(keyhash, cvv)
  // Des-Encripta
  let cvvDecrypted = AesCipher.decrypt(keyhash, cvvEncrypt)

  console.group('AesCipher')
  console.log(`Genera del CVV y la clave telefonica cifrada\n`)
  console.log(`CVV utilizado     : ${cvv}`)
  console.log(`CVV Encriptado    : ${cvvEncrypt}`)
  console.log(`CVV Des-Encriptado: ${cvvDecrypted} \n`)
  console.groupEnd('AesCipher')
}

showExample(false)

export default AesCipher