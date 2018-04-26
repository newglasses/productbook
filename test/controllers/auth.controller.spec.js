/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

var assert = require('assert')
var authController = require('../../controllers/auth.controller')
var expect = require('chai').expect
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var sinon = require('sinon')

chai.use(chaiAsPromised) // using chai-as-promised like middleware
chai.should()

describe('AuthController', function () {
  /*
    beforeEach('setting up roles', function setUpRoles() {
        authController.setRoles(['user', 'admin']);
    });
    */

  /*
    beforeEach('throw error intentionally', function throwError() {
        throw ({ error: 'error' })
    });
    */

  describe('isAuthorized', function () {
    var user = {}
    beforeEach(function () {
      user = {
        roles: ['admin'],
        isAuthorized: function (neededRole) {
          return this.roles.indexOf(neededRole) >= 0
        }
      }
      sinon.spy(user, 'isAuthorized')
      authController.setUser(user)
    })

    it('should return false if not authorized', function () {
      var isAuth = authController.isAuthorized('local')
      expect(isAuth).to.be.false
    })

    it('should return true if authorized', function () {
      var isAuth = authController.isAuthorized('admin')
      console.log(user.isAuthorized)
      user.isAuthorized.calledOnce.should.be.true // using sinon.spy(user, 'isAuthorized'); in the before each to be able to check this
      isAuth.should.be.true
    })
    it('should not allow a get if not authorized') // pending test

    it('should allow a get if authorized') // pending test
  })

  describe('isAuthorizedAsync', function () {
    beforeEach('setting up roles', function setUpRoles () {
      authController.setRoles(['user', 'admin'])
    })

    it('should return false if not authorized', function (done) {
      authController.isAuthorizedAsync('local',
        function (isAuth) {
          assert.equal(false, isAuth)
          done()
        })
    })

    it('should return true if not authorized', function (done) {
      authController.isAuthorizedAsync('admin',
        function (isAuth) {
          assert.equal(true, isAuth)
          done()
        })
    })
  })

  describe('isAuthorizedPromise', function () {
    beforeEach('setting up roles', function setUpRoles () {
      authController.setRoles(['user', 'admin'])
    })

    it('should return false if not authorized', function () {
      return authController.isAuthorizedPromise('local').should.eventually.be.false
    })

    it('should return true if not authorized', function () {
      return authController.isAuthorizedPromise('admin').should.eventually.be.true
    })
  })
})

describe('getIndex', function () {
  beforeEach(function () {
    user = {
      roles: ['admin'],
      isAuthorized: function (neededRole) {
        return this.roles.indexOf(neededRole) >= 0
      }
    }
  })

  it('should render index if authorized', function () {
    // need to mock and pass in req and res to call .getIndex();
    var isAuth = sinon.stub(user, 'isAuthorized').returns(true) // stubbing out isAuthorized function: always making it return true
    var req = {user: user}
    var res = {
      render: sinon.spy()
    }
    // sinon.spy gives us a fake function to see if it is called
    authController.getIndex(req, res)
    isAuth.calledOnce.should.be.true
    res.render.calledOnce.should.be.true
    res.render.firstCall.args[0].should.equal('index')
  })

  // same method as above with mocking implemented (a bit cleaner - notice last two asserts above are in one line below)
  // mocking the whole res object
  it.only('should render index if authorized', function () {
    // need to mock and pass in req and res to call .getIndex();
    var isAuth = sinon.stub(user, 'isAuthorized').returns(true) // stubbing out isAuthorized function: always making it return true
    var req = {user: user}
    var res = {
      render: function () {}
    }
    var mock = sinon.mock(res)
    mock.expects('render').once().withExactArgs('index')

    // sinon.spy gives us a fake function to see if it is called
    authController.getIndex(req, res)

    isAuth.calledOnce.should.be.true
    mock.verify()
  })
})

describe('Maths', function () {
  it('should test that 3*3 = 9', function () {
    assert.equal(9, 3 * 3)
  })
  it('should test that (3-4)*8 = -8)', function () {
    assert.equal(-8, (3 - 4) * 8)
  })
})
