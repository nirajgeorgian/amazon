var express = require('express')
var morgan = require('morgan')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
mongoose.Promise = require('bluebird')
var path = require('path')
var ejs = require('ejs')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('express-flash')
var ejsMate = require('ejs-mate')
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport')
var secret = require('./config/secret')
var User = require('./models/user')
var Category = require('./models/category')
var app = express()

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({url:secret.database , autoReconnect: true})
}))
app.use(function(req, res, next) {
  res.locals.user = req.user
  next()
})
app.use(function(req, res, next) {
  Category.find({}, function(err, categories) {
    if (err) return next(err)
    res.locals.categories = categories
    next()
  })
})
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
// Routes
var mainRoutes = require('./routes/main')
var userRoutes = require('./routes/user')
var adminRoute = require('./routes/admin')
var apiRoutes = require('./api/api')
app.use(mainRoutes)
app.use(userRoutes)
app.use(adminRoute)
app.use('/api',apiRoutes)

// Connect to database
mongoose.connect(secret.database, (err) => {
  if (err) return err;
  console.log("Successfully connected to database")
})

app.listen(secret.port, (err) => {
  if (err) throw err;
  console.log("Running on 127.0.0.1:3030")
})
