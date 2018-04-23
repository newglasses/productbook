const knex = require('./knex'); // want the connection, not the knex library!

const getProducts = (cb)=> {
    return knex('knex_product');
};

const getProductById = (id) => {
    return knex('knex_product').where('id', id).first();
}

const createProduct = (product) => {
    return knex('knex_product').insert(product, '*');
}

const editProduct = (id, fields, values, cb) => {
    client.query('SELECT * FROM knex_product WHERE id=($1)', [id], (err, res) => {
        if(err){
            return cb(err);
        }
        if (res.rows.length === 0) {
            return cb(new Error('no record for that id'));
        }
        fields.forEach((field, index) => {
            client.query(
                `UPDATE products SET ${field}=($1) WHERE id=($2)`, [values[index], id], (err, result) => {
                  if (err){
                      return cb(err);
                  }
                  if (index === fields.length - 1)
                  {
                      cb(null);
                  }
            });
        });
    });
};

const deleteProduct = (id, cb) => {
    client.query('SELECT * FROM knex_product WHERE id=($1)', [id], (err, res) => {
        if(err){
            return cb(err);
        }
        if (res.rows.length === 0) {
            return cb(new Error('no record for that id'));
        }
        client.query('DELETE FROM products WHERE id=($1)', [id], (err, res) => {
            if(err){
                return cb(err);
            }
            cb(null);
        });
    });
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct
};