
var port = normalizePort(process.env.PORT || '3000');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/comments',require('./routes/comments'))
//app.use('/products',require('./routes/products'))



mongoose.connect('mongodb://localhost:27017/NNPTUD-S5').catch(
  function(err){
    console.log(err);
  }
)
mongoose.connection.on('connected',function(){
  console.log('connected');
})

app.use(function(req, res, next) {
  next(createError(404));
});
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Chào mừng đến với API quản lý Người dùng và Vai trò.",
        status: "Running"
    });
});



const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(` Server đang chạy tại http://localhost:${PORT}`);
});


server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Cổng ${PORT} đã được sử dụng. Vui lòng chọn cổng khác.`);
    } else {
        console.error('Lỗi Server:', error);
    }
});
