/* eslint-disable standard/no-callback-literal */

function AuthController () {
  var roles
  var user

  function setRoles (role) {
    roles = role
    user.roles = role
  }

  function setUser (inUser) {
    user = inUser
  }

  function isAuthorized (neededRole) {
    if (user) {
      return user.isAuthorized(neededRole)
    }
  }

  function isAuthorizedAsync (neededRole, cb) {
    setTimeout(function () { cb(roles.indexOf(neededRole) >= 0) }, 0) // setTimeout: call the callback when everything else is done
  }

  function isAuthorizedPromise (neededRole, cb) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(roles.indexOf(neededRole) >= 0) }, 0)
    })
  }

  function getIndex (req, res) {
    if (req.user.isAuthorized('admin')) {
      return res.render('index')
    }
    return res.render('error')
  }

  return {isAuthorized, isAuthorizedAsync, setRoles, isAuthorizedPromise, getIndex, setUser}
}

module.exports = AuthController()
