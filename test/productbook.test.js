/* eslint-disable no-unused-expressions */

const sinon = require('sinon')
const request = require('supertest')
const expect = require('chai').expect
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const knex = require('../db/knex')

chai.use(chaiAsPromised) // using chai-as-promised like middleware
chai.should()

const app = require('../server.js')

const fixtures = require('./fixtures')

describe.only('CRUD products', function (done) {
  before((done) => {
    // run migrations
    knex.migrate.latest()
      .then(() => {
        // run seeds
        return knex.seed.run()
      }).then(() => done())
  })

  it('Lists all records', function (done) {
    request(app)
      .get('/products/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('array')
        expect(response.body).to.deep.equal(fixtures.products)
        done()
      })
  })

  it.skip('Lists all records using sinon', function (done) {
    const products = fixtures.products
    const stubGetAllProducts = sinon.stub('products').returns(products)

    request(app)
      .expect(200)
      .end(function (error, response) {
        expect(error).to.be.null
        expect(stubGetAllProducts).calledonce.should.be.true
        expect(response.text).to.equal(JSON.stringify(products))
        done()
      })
  })

  it('Lists a record by id', function (done) {
    request(app)
      .get('/products/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object')
        expect(response.body).to.deep.equal(fixtures.products[0])
        done()
      })
  })

  it('Lists a record by id', function (done) {
    this.timeout(10000)
    request(app)
      .get('/products/4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object')
        expect(response.body).to.deep.equal(fixtures.products[3])
        done()
      })
  })

  it('Creates a record', function (done) {
    request(app)
      .post('/products/')
      .send(fixtures.product)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object')
        console.log(response.body)
        fixtures.product.id = response.body.id // adds a new id property to the product object and populates it
        console.log(fixtures.product)
        expect(response.body).to.deep.equal(fixtures.product)
        done()
      })
  })

  it('Updates a record', function (done) {
    request(app)
      .put('/products/5')
      .send(fixtures.productUpdate)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        console.log(response.body)
        expect(response.body).to.be.a('object')
        expect(response.body).to.deep.equal(fixtures.productUpdated)
        done()
      })
  })

  it('Deletes a record', (done) => {
    request(app)
      .delete('/products/5')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object')
        expect(response.body).to.deep.equal({
          deleted: true
        })
        done()
      })
  })
})
