var router = require('express').Router()
var Product = require('../models/product')
var Cart = require('../models/cart')

function paginate(req, res, next) {
  var perPage = 9;
  var page = req.params.page
  Product
    .find()
    .skip(perPage * page) //ex:- go to page 3 so skip 9 * 3 = 27 documents then display the data
    .limit(perPage)
    .populate('category')
    .exec(function(err, products) {
      Product.count().exec(function(err, count) {
        if (err) return next(err)
        res.render('main/product-main', {
          products: products,
          pages: count/perPage,
          user: req.user
        })
      })
    })
}


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
var count = 0;
stream.on('data', function(err, doc) {
  count++
})
stream.on('close', function() {
  console.log('indexed '+ count + ' documents!')
})
stream.on('error', function(err) {
  console.log(err)
})

router.get('/', (req, res, next) => {
  if (req.user) {
    paginate(req, res , next)
  } else {
    res.render('main/main', {
      user: req.user
    })
  }
})

router.get('/page/:page', function(req, res, next) {
  paginate(req, res, next)
})

router.route('/search')
    .post((req, res, next) => {
      res.redirect('/search?q='+ req.body.q)
    })
    .get((req, res, next) => {
      if (req.query.q){
        Product.search({
          query_string: {query: req.query.q}
        }, function(err, results) {
          if (err) return next(err)
          console.log(results);
          var data = results.hits.hits.map(function(hit) {
            return hit
          })
          res.render('main/search-result', {
            query: req.query.q,
            data:data,
            user: req.user
          })
          // res.json(data)
        })
      }
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

router.post('/product/:product_id', (req, res, next) => {
  Cart.findOne({owner: req.user._id}, function(err, cart) {
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    })
    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2)
    cart.save((err) => {
      if (err) return next(err)
      return res.redirect('/cart')
    })
  })
})

router.get('/cart', (req, res, next) => {
  Cart
    .findOne({owner: req.user._id})
    .populate('items.item')
    .exec((err, foundCart) => {
      if (err) return next(err)
      return res.render('main/cart', {
        cart: foundCart
      })
    })
})

module.exports = router
