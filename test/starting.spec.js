var assert = require('assert')
var should = require('chai').should()

// bdd style

describe('basic mocha test', function () {
  it('should throw a failure', function () {
    assert.equal(3, 3)
  })

  it('should deal with objects', function () {
    var obj = {name: 'Jon', gender: 'male'}

    obj.should.have.property('name').equal('Jon')
  })

  it.skip('should deal with objects', function () {
    var obj = {name: 'Jon', gender: 'male'}
    var objB = {name: 'Jon', gender: 'male'}

    obj.should.equal(objB) // will not pass because it is looking for them to be the same object
  })

  it('should deal with objects', function () {
    var obj = {name: 'Jon', gender: 'male'}
    var objB = {name: 'Jon', gender: 'male'}

    obj.should.deep.equal(objB)
  })

  it('should deal with objects', function () {
    var obj = {name: 'Jon', gender: 'male'}
    var objB = obj

    obj.should.equal(objB)
  })

  // can't call should on obj.prototype when the obj is null and does therefore not exist
  // to get around this add var should = require('chai').should() and then access the should variable as per below:
  it('should allow testing nulls', function () {
    var iAmNull = null
    should.not.exist(iAmNull)
  })
})
