const products =  require('../initial_products');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('knex_product').del()
    .then(function () {
      // Inserts seed entries
      return knex('knex_product').insert(products);
    });
};
