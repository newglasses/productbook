const { Router } = require('express')
const queries = require('../db/queries')

module.exports = function (app) {
  const route = Router()

  app.use('/products', route)

  route.get('/', (req, res, next) => {
    const { name } = req.query
    queries.getProducts({ name }).then(products => {
      if (products) {
        res.json(products)
      } else {
        res.status(404)
        next()
      }
    })
      .catch(function (error) {
        next(error)
      })
  })
  route.get('/:id', isValidId, (req, res, next) => {
    queries.getProductById(req.params.id).then(product => {
      if (product) {
        res.json(product)
      } else {
        res.status(404)
        next()
      }
    })
  })
  route.post('/', (req, res, next) => {
    if (validProduct(req.body)) {
      queries.createProduct(req.body).then(products => {
        res.json(products[0])
      })
    } else {
      next(new Error('Invalid product'))
    }
  })
  route.put('/:id', isValidId, (req, res, next) => {
    if (validProduct(req.body)) {
      queries.updateProduct(req.params.id, req.body).then(products => {
        res.json(products[0])
      })
    } else {
      next(new Error('Invalid product'))
    }
  })
  route.delete('/:id', (req, res, next) => {
    queries.deleteProduct(req.params.id).then(() => {
      res.json({
        deleted: true
      })
    })
  })
}

function isValidId (req, res, next) {
  if (!isNaN(req.params.id)) return next()
  next(new Error('Invalid ID'))
}

function validProduct (product) {
  console.log('inside validProduct')
  console.log(product)
  const hasName = typeof product.name === 'string' && product.name.trim() !== ''
  const hasPrice = !isNaN(product.price)
  console.log('hasName: ' + hasName + '' + ' hasPrice' + hasPrice)
  return hasName && hasPrice
}
