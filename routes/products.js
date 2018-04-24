const { Router } = require('express');
const db = require('../db');
const queries = require('../db/queries');

const router = Router();

function isValidId(req, res, next) {
    if(!isNaN(req.params.id)) return next();
    next(new Error('Invalid ID'));
}

function validProduct(product) {
    console.log("inside validProduct");
    console.log(product);
    const hasName = typeof product.name == 'string' && product.name.trim() != '';
    const hasPrice = !isNaN(product.price);
    console.log("hasName: " + hasName + "" + " hasPrice" + hasPrice);
    return hasName && hasPrice;
}

router.get('/', (req, res, next) => {
    const { name } = req.query;
    queries.getProducts( { name }).then(products => {
        if (products) {
            res.json(products);
        } else {
            res.status(404);
            next();
        }
    });
});

router.get('/:id', isValidId, (req, res, next)=> {

    queries.getProductById(req.params.id).then(product => {
        if(product) {
            res.json(product);
        } else {
            res.status(404);
            next();
        }
    });
});

router.post('/', (req, res, next) => {
    if(validProduct(req.body)) {
        queries.createProduct(req.body).then(products => {
            res.json(products[0]);
        });

    } else {
        next(new Error('Invalid product'));
    }
});

router.put('/:id', isValidId, (req, res, next) => {

    if(validProduct(req.body)) {
        queries.updateProduct(req.params.id, req.body).then(products => {
            res.json(products[0]);
        });

    } else {
        next(new Error('Invalid product'));
    }

    /*
    const { id } = req.params;
    const keys = ['name', 'price'];
    const fields = [];
    const values = [];
  
    keys.forEach(key => {
      if (req.body[key]){
        fields.push(key);
        values.push(req.body[key]);
      } 
    });

    db.editProduct(id, fields, values, (err, result) => {
        if (err){
            return next (err);
        }
        res.redirect(303, '/products');
    })
    */
});

router.delete('/:id', (req, res, next) => {
    queries.deleteProduct(req.params.id).then(() => {
        res.json({
            deleted: true
        });
    });
});
  
module.exports = router;