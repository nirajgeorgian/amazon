var router = require('express').Router()
var passport = require('passport')
var async = require('async')
var Cart = require('../models/cart')
var passportConfig = require('../config/passport')
var User = require('../models/user')

router.route('/signup')
 .post((req, res, next) => {
   async.waterfall([
     function(callback) {
       var user = new User()
       user.profile.name = req.body.name
       user.email = req.body.email
       user.password = req.body.password
       user.profile.picture = user.gravatar() // coming from custom method of mongoose

       User.findOne({email: req.body.email}, (err, userExist) => {
         if (userExist) {
           req.flash("errors", "User already exists with " + user.email)
           return res.redirect('/signup')
         } else {
           user.save((err, user) => {
             if (err) return next(err)
               req.flash("success", "Successfully created account.")
               callback(null, user)
             })
           }
         })
     },
     function(user) {
       var cart = new Cart()
       cart.owner = user._id,
       cart.save(function(err) {
         if (err) return next(err)
         req.logIn(user, (err) => {  // Adding session and cookie to our usr who successfully sign up
           if (err) return next(err)
           res.redirect('/profile')
         })
       })
     }
   ])
 })
  .get((req, res) => {
    res.render('account/signup', {
      errors: req.flash("errors")
    })
  })

router.route('/login')
    .get((req, res, next) => {
      if (req.user) return res.redirect('/')
      res.render('account/login', {
        message: req.flash('loginMessage')
      })
    })
    .post(passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }))

router.get('/profile', passportConfig.isAuthenticated, (req, res, next) => {
      User
        .findOne({_id: req.user._id})
        .populate('history.item')
        .exec(function(err, foundUser) {
          if (err) return next(err)
          res.render('account/profile', {
            user: foundUser
          })
          // res.json(foundUser.history[0].item)
        })
    })
    .post((req, res) => {

    })

router.get('/logout', (req, res,next) => {
  req.logout()
  res.redirect('/')
})

router.route('/edit-profile')
.get((req, res) => {
  res.render('account/edit-profile.ejs', {
    message: req.flash('success'),
    user: req.user
  })
})
.post((req, res, next) => {
  User.findOne({_id: req.user._id}, (err, user) => {
    if (err) return next(err)

    if (req.body.name) user.profile.name = req.body.name
    if (req.body.address) user.address = req.body.address

    user.save((err) => {
      if (err) return next(err)
      req.flash('success', "Successfully updated your profile information")
      return res.redirect('/edit-profile')
    })
  })
})
module.exports = router
