const { Router } = require('express');
const db = require('../db');
const queries = require('../db/queries');

const router = Router();

function isValidId(req, res, next) {
    if(!isNaN(req.params.id)) return next();
    next(new Error('Invalid ID'));
}

function validProduct(product) {
    const hasName = typeof product.name == 'string' && product.name.trim() != '';
    // console.log("hasName: " + hasName);
    return hasName;
}

router.get('/', (req, res, next) => {

    queries.getProducts().then(products => {
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

    /*
    const { name, price } = req.body;

    db.addProduct(name, price, (err, result)=> {
      if (err){
        return next (err);
      } 

      res.redirect('/products');
    })
    */
});

router.put('/:id', isValidId, (req, res, next) => {
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
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
  
    db.deleteProduct(id, (err, result) => {
        if (err){
            return next (err);
        }
        res.redirect(303, '/products');
    })
  });
  
module.exports = router;