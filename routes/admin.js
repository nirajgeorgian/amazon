var router = require('express').Router()
var Category = require('../models/category')

router.route('/add-category')
    .get((req, res, next) => {
      res.render('admin/add-category', {
        message: req.flash('success'),
        failure: req.flash('failure')
      })
    })
    .post((req, res, next) => {
      var category = new Category()
      category.name = req.body.category
      Category.findOne({name: req.body.category},(err, categoryList) => {
        if (categoryList) {
          req.flash("failure", "category already exists")
          return res.redirect('/add-category')
        } else {
          category.save((err) => {
            if (err) return next(err)
            console.log(req.body.category)
            req.flash("success", "Successfully added a category")
            return res.redirect('/add-category')
          })
        }
      })
    })

module.exports = router
