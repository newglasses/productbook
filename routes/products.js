const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/', (req, res, next) => {
    db.getProducts((err, products) => {
        if (err) {
            return next(err);
        }
        res.send(products);
    });
});

router.get('/:id', (req, res, next)=> {
    db.getProduct(req.params.id*1, (err, product)=> {
        if(err){
            return next(err);
        }
        res.send(product);
    })
});

module.exports = router;