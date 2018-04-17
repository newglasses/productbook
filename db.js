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
    });
}

const getProducts = (cb)=> {
    client.query('select * from products', (err, result) => {
        if (err) {
            return cb(err);
        }
        cb(null, result.rows);
    });
};

module.exports = {
    connect,
    getProducts
};