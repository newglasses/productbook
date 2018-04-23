const request = require('supertest');
const expect = require('chai').expect;
const knex = require('../db/knex');

const app = require('../server.js');

const fixtures = require('./fixtures');

describe('CRUD products', function(done) {

    before((done) => {
        // run migrations
        knex.migrate.latest()
        .then (() => {
            // run seeds
            return knex.seed.run();
        }).then(() => done());
    });

    it('Lists all records', function(done) {
        request(app)
        .get('/products/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).to.be.a('array');
            expect(response.body).to.deep.equal(fixtures.products);
            done();
        });
    });

    it('Lists a record by id', function(done) {
        request(app)
        .get('/products/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).to.be.a('object');
            expect(response.body).to.deep.equal(fixtures.products[0]);
            done();
        });
    });

    it.skip('Lists a record by id', function(done) {
        this.timeout(10000)
        request(app)
        .get('/products/4')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).to.be.a('object');
            expect(response.body).to.deep.equal(fixtures.products[3]); 
            done();
        });
    });

    it('Creates a record', function(done) {
        request(app)
        .post('/products/')
        .send(fixtures.product)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).to.be.a('object');
            console.log(response.body);
            fixtures.product.id = response.body.id; // adds a new id property to the product object and populates it
            console.log(fixtures.product);
            expect(response.body).to.deep.equal(fixtures.product);
            done();
        })
    })
});