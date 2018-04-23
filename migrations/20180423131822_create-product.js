
exports.up = function(knex, Promise) {
  return knex.schema.createTable('knex_product', (table) => {
      table.increments('id'); //creates id column
      table.text('name');
      table.float('price');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('knex_product');
};
