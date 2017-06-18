/**
 * Created by onlyhom on 2017/5/7.
 */


var express = require('express');//加载express模块
var swig = require('swig'); //加载模板处理模块
var mongoose = require('mongoose'); //加载数据库模块
var bodyParser = require('body-parser'); //中间件 用户来处理post提交过来的数据
var Cookies = require('cookies'); //加载cookies模块
var app = express(); //创建app应用 => NodeJS Http.createServer();
var User = require('./models/User');


//设置静态文件托管
//当用户访问的url以/public开始 那么直接返回对应__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'));

// app.use(bodyParser.json({limit : "2048kb"}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

//配置应用模板
//参数1 模板引擎名称&模板文件后缀名
//参数2 用于解析模板内容的方法
app.engine('html', swig.renderFile); // 定义当前应用所使用的模板引擎
app.set('views','./views');//设置存放目录
app.set('view engine','html'); //设置需要使用的模板引擎

//为了开发方便 暂时取消模板缓存
swig.setDefaults({cache:false});

//body-parser设置 使用了这个模块 router的回调函数里的res会多一个属性
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies模块 中间件
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    //console.log(req.cookies.get('userInfo'));

    //解析用户登录的cookie信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //isAdmin 尽量不要存储在cookies中
            //获取idAdmin类型
            User.findById(req.userInfo._id).then(function (userInfo) {
               req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
               next();
            });

        }catch(e){
            next();
            console.log('获取cookies失败');
        }
    }else{
        next();
    }

});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

//根据不同的功能划分模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 首页
app.get('/',function (req, res, next) { //request response next:函数
    //res.send('<h1>hello my blog<h1/>');
    res.render('main/index'); //参数1 模板文件名 相对于views的目录  参数2：传递给模板使用的数据

});

mongoose.connect('mongodb://localhost:27018/blog',function (error) {
    if(error){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        //监听http请求
        app.listen(8082);
    }
});

