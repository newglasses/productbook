const knex = require('./knex') // want the connection, not the knex library!

const getProducts = (query) => {
  const knexQuery = knex('knex_product')

  if (query.name) {
    knexQuery.where('name', 'like', `%${query.name}%`) // this is currently case sensitive
  }

  return knexQuery
}

const getProductById = (id) => {
  return knex('knex_product').where('id', id).first()
}

const createProduct = (product) => {
  return knex('knex_product').insert(product, '*')
}

const updateProduct = (id, product) => {
  return knex('knex_product').where('id', id).update(product, '*')
}

const deleteProduct = (id) => {
  return knex('knex_product').where('id', id).del()
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
