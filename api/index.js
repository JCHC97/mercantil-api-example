import express from 'express'
import cors from 'cors'

import errors from '#network/errors.js'
import config from '#config'

import testMercantil from './components/mercantil/routes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Router
app.use('/api/mercantil', testMercantil)

// Error Handlers
app.use(errors)

app.listen(config.API.PORT, () => {
  console.log('API listen on port ', config.API.PORT)
})
