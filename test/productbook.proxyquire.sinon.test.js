/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */

var proxyquire = require('proxyquire')
var sinon = require('sinon')
var supertest = require('supertest')
var expect = require('chai').expect
var express = require('express')
var bodyParser = require('body-parser')
var queries = require('../db/queries')

describe('Testing the Products route', function () {
  var request

  beforeEach(function () {
    // Setting up the app this way means all dependencies from app.js are explicitly defined per route file
    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))

    var productsRoute = proxyquire('../routes/products', { '../db/queries': queries })

    // connect(route)
    productsRoute(app)

    app.use(function (req, res, next) {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
    })

    app.use((err, req, res, next) => {
      res.status(err.status || 500)
      res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
      })
    })

    request = supertest(app)
  })
  afterEach(function () {
    queries.getProducts.restore()
  })

  describe('GET /products', function () {
    it('should respond with a 500 client error', () => {
      sinon.stub(queries, 'getProducts').rejects('Error!')

      return request
        .get('/products')
        .expect(500)
    })

    it('should respond with a 404 client error', () => {
      var getStub = sinon.stub(queries, 'getProducts').resolves(null)

      request
        .get('/products')
        .expect(404, function (error, response) {
          expect(getStub.calledOnce).to.be.true
        })
    })

    it('should respond with a 200 and return products', () => {
      var getStub = sinon.stub(queries, 'getProducts').resolves([{id: 1, name: 'secondproduct', price: 200}])

      request
        .get('/products')
        .expect(200, function (error, response) {
          expect(getStub.calledOnce).to.be.true
          expect(error).to.be.null
          expect(response.text).to.contain('second')
        })
    })

    it('should respond with a 200 and return products', () => {
      var getStub = sinon.stub(queries, 'getProducts').resolves([{id: 1, name: 'secondproduct', price: 200}])

      request
        .get('/products')
        .expect(200, function (error, response) {
          expect(getStub.calledOnce).to.be.true
          expect(error).to.be.null
          expect(response.text).to.contain('second')
        })
    })
  })
})
