import express from 'express'

import response from '#network/response.js'
import Controller from './controller/index.js'

const router = express.Router()

// Routes
router.get('/test', test)
router.get('/getAuth', getAuth)
router.post('/payTDD', payTDD)
router.post('/payTDC', payTDC)
router.post('/payC2P', payC2P)
router.get('/search', search)
router.get('/keyRequest', keyRequest)

//Functions Callbacks
async function test(req, res, next) {
  Controller.test()
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

function getAuth(req, res, next) {
  Controller.getAuth(req.body)
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

function payTDD(req, res, next) {
  Controller.payTDD(req.body)
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

function payTDC(req, res, next) {
  Controller.payTDC(req.body)
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

function payC2P(req, res, next) {
  Controller.payC2P(req.body)
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

function search(req, res, next) {
  Controller.search(req.body)
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

function keyRequest(req, res, next) {
  Controller.keyRequest(req.body)
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

export default router
