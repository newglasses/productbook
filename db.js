const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

const seed = ()=> {
    var qry = `
	DROP TABLE IF EXISTS products;
	CREATE TABLE products (
	    id SERIAL primary key,
	    name text
    );
    INSERT INTO products(name) VALUES ('foo');
    INSERT INTO products(name) VALUES ('bar');
    INSERT INTO products(name) VALUES ('baz');
    `;
    client.query(qry, (err, result) => {
        if(err){
            console.log(err);
        }
    });
}

const connect = ()=> {
    client.connect((err) => {
        if (!err) {
            if(process.env.SEED){
                seed();
            }
        }
        console.log(err);
    });
}

const getProduct = (id, cb) => {
    client.query('SELECT * FROM products WHERE id = $1', [ id ], (err, result)=> {
        if(err){
            return cb(err);
        }
        if (result.rows.length === 0) {
            return cb(new Error('no record for that id'));
        }
        cb(null, result.rows[0]);
    });
};

const getProducts = (cb)=> {
    client.query('select * from products', (err, result) => {
        if (err) {
            return cb(err);
        }
        cb(null, result.rows);
    });
};

const addProduct = (name, cb) => {
    client.query('INSERT INTO products(name) VALUES($1)', [ name ], (err, result) => {
        if(err){
            return cb(err);
        }
        cb(null, result.rows[0]);
    });
};

module.exports = {
    connect,
    getProducts,
    getProduct,
    addProduct
};