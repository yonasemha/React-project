const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const mongoose = require("mongoose")
const logger = require('morgan');
const cors = require('cors');
const config = require('config');

const productRoute = require('./routes/api/product')
const userRoute = require('./routes/api/user')
const authRoute = require('./routes/api/auth')
const commentRoute = require('./routes/api/comments')



const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(productRoute)
app.use(userRoute)
app.use(authRoute)
app.use(commentRoute)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 5000);
  res.render('error');
});


// getting config key
 
 const DB = config.get('mongoURI');

// connecting to mongodb 
mongoose.connect(DB, { useNewUrlParser: true, useCreateIndex :true })
  .then(() => {
    console.log('connected to mongodb...!!!');
  })
  .catch((err) => {
    console.log('Error', err);
  })

// Use routes 

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
  })
}

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`listing on port ${port}`))


module.exports = app;
