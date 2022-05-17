# API Mercantil - Código Base

Es un API basada en componentes, que utilzando el AEScipher y bodies por default de cada request pone a disposición varios endpoints.   Le servirá para accelerar la integración de la API MErcantil como módulo de pagos en sus proyectos, evitando gran parte del tiempo que toma entender los detalles de la documentación y la comunicación con el equipo de atención al cliente. Es un código base al que luego se le deben agregar las funcionalidades del negocio.


## Credenciales

Debe agregar sus credenciales otorgadas por apisupport del Portal API Mercantil en el archivo .env tomando de ejemplo el .env.example

_MERCANTIL_DEV_ va depender de las credenciales que vaya a utilizar, es decir, el ambiente en que se encuentre:
  - true: si las credenciales ingresadas corresponden a Desarrollo
  - false: si las credenciales ingresadas corresponden a Produccion

**¡Que le sea de provecho!**
