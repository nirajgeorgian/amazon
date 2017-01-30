var router = require('express').Router()
var Product = require('../models/product')

Product.createMapping(function(err, mapping) {
  if (err){
    console.log("error creating mapping")
    console.log(err)
  } else {
    console.log("Mapping successfully created")
    console.log(mapping)
  }
})

var stream = Product.synchronize()

router.get('/', (req, res) => {
  res.render('main/main', {
    user: req.user
  })
})

router.get('/products/:id', (req, res, next) => {
  Product
    .find({category: req.params.id})
    .populate('category','name')
    .exec(function(err, products) {
      if (err) return next(err)
      res.render('main/category', {
        products: products,
        user: req.user
      })
      // res.json(products)
    })
})

router.get('/product/:id', (req, res, next) => {
  Product.findById({_id: req.params.id}, (err, product) => {
    if (err) return next(err)
    res.render('main/product', {
      product: product,
      user: req.user
    })
  })
})

module.exports = router
