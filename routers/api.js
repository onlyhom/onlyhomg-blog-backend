/**
 * Created by onlyhom on 2017/5/9.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/content');
var Category = require('../models/Category');//新增
var Blog = require('../models/Blog');//新增
var Work = require('../models/Work');//新增
var qr = require('qr-image');


//统一返回格式
var responseData;

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});


// ======== 前端展示 ==========

// 博客列表展示
router.get('/blog',function (req, res, next) {
    Blog.find().sort({_id:-1}).then(function (contents) {
        var tempData = [];
        for(var i = 0; i<contents.length; i++){
            tempData.push({
                id:contents[i].id,
                day:contents[i].addTime.getDate(),
                year:contents[i].addTime.getFullYear() +'-'+ (contents[i].addTime.getMonth()+1),
                title:contents[i].title,
                description:contents[i].description
            });
        }
        responseData.data = tempData;
        responseData.message = 'success';
        res.json(responseData);
    })
});

// 博客详情页展示
router.get('/blog_detail',function (req, res, next) {
    //内容的id
    var id = req.query.id || ''; //get-方式就用req.query post-就用req.body
    Blog.findOne({
        _id: id
    }).then(function (blog) {
        responseData.data = blog;
        responseData.message = 'success';
        res.json(responseData);
    })

});


// ======== 后台提交博文 =========

//博客添加-保存
router.post('/blog/add',function (req, res) {

    if( req.body.title == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '标题不能为空'
        });
        return;
    }

    if( req.body.description == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '简介不能为空'
        });
        return;
    }

    if( req.body.content == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容不能为空'
        });
        return;
    }


    //保存数据到数据库
    new Blog({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        delta: req.body.delta,
        addTime: new Date
    }).save().then(function (result) {
        console.log('添加博文成功');
        responseData.data = {};
        responseData.message = 'success';
        res.json(responseData);
    });
});

//博客修改-保存
router.post('/blog/edit',function (req, res) {

    if( req.body.title == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '标题不能为空'
        });
        return;
    }

    if( req.body.description == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '简介不能为空'
        });
        return;
    }

    if( req.body.content == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容不能为空'
        });
        return;
    }

    Blog.update({_id:req.body.id},{
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        delta: req.body.delta
    }).then(function () {
        console.log('作品修改成功');
        responseData.data = {};
        responseData.message = 'success';
        res.json(responseData);
    });


});

//获取博文样式
router.get('/blog/getDelta',function (req, res) {

    var id = req.query.id || '';

    Blog.findOne({
        _id: id
    }).then(function (blog) {

        if(!blog){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在'
            });
            return Promise.reject();
        }else{
            responseData.data = blog.delta;
            responseData.message = 'success';
            res.json(responseData);
        }
    });
});


// ======== 作品 =========
// 生成二维码
router.get('/create_qrcode', function (req, res, next) {
    try {
        var img = qr.image(req.query.link_url,{size :5});
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, {'Content-Type': 'text/html'});
        res.end('<h1>414 Request-URI Too Large</h1>');
    }
});

//作品添加-保存
router.post('/work/add',function (req, res) {

    if( req.body.name == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '作品名称不能为空'
        });
        console.log('作品名称不能为空');
        return;
    }

    if( req.body.imageUrl == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '作品封面不能为空'
        });
        console.log('作品封面不能为空');
        return;
    }

    if( req.body.description == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '简介不能为空'
        });
        return;
        console.log('简介不能为空');
    }

    if( req.body.demoUrl == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '演示地址不能为空'
        });
        console.log('演示地址不能为空');
        return;
    }

    //保存数据到数据库
    new Work({
        category: req.body.category,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        demoUrl: req.body.demoUrl,
        onlineUrl: req.body.onlineUrl || '',
        codeUrl: req.body.codeUrl || ''
    }).save().then(function (result) {
        console.log('作品添加成功');
        responseData.data = {};
        responseData.message = 'success';
        res.json(responseData);
    });
});

//作品修改
router.post('/work/edit',function (req, res) {

    if( req.body.name == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '作品名称不能为空'
        });
        console.log('作品名称不能为空');
        return;
    }

    if( req.body.imageUrl == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '作品封面不能为空'
        });
        console.log('作品封面不能为空');
        return;
    }

    if( req.body.description == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '简介不能为空'
        });
        return;
        console.log('简介不能为空');
    }

    if( req.body.demoUrl == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '演示地址不能为空'
        });
        console.log('演示地址不能为空');
        return;
    }

    //保存数据到数据库
    Work.update({_id:req.body.id}, {
        category: req.body.category,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        demoUrl: req.body.demoUrl,
        onlineUrl: req.body.onlineUrl || '',
        codeUrl: req.body.codeUrl || ''
    }).then(function (result) {
        console.log('作品修改成功');
        responseData.data = {};
        responseData.message = 'success';
        res.json(responseData);
    });
});

//作品首页
router.get('/work',function (req, res) {
    var tempArr = [];

    Category.find().then(function (categories) {

        Work.find().populate(['category']).sort({addTime: -1}).then(function (works) {

            //console.log(works);

            for(var i=0; i<categories.length; i++){

                var tempWorkArr = [];
                for(var j=0; j<works.length; j++){
                    works[j].category._id.toString() == categories[i]._id.toString() ? tempWorkArr.push(works[j]) : void 0;
                }
                tempArr.push({
                    name:categories[i].name,
                    data:tempWorkArr
                });
            }

            responseData.data = {works:tempArr};
            responseData.message = 'success';
            res.json(responseData);
        });
    });

});



//用户注册
router.post('/user/register',function (req, res, next) {
    console.log(req.body);
    //res.send('register');
    //res.send({ some: 'miaomiao' });

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }


    //数据库验证-用户名是否存在
    User.findOne({
        username: username
    }).then(function (userInfo) {
        console.log(userInfo);
        if(userInfo){ //如果存在
            responseData.code = 4;
            responseData.message = '该用户名已存在';
            res.json(responseData);
            return;
        }

        //保存用户注册的信息到数据库中
        var user = new User({  //通过操作对象来操作数据库
            username:username,
            password:password
        });
        return user.save();
    }).then(function (newUserInfo) {
        //console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    });



});

//用户登录
router.post('/user/login',function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }

    //查询数据库
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        //console.log(userInfo);
        if(userInfo){ //如果存在
            responseData.message = '登录成功';
            responseData.userInfo = {
                _id: userInfo._id,
                username: userInfo.username
            };
            req.cookies.set('userInfo',JSON.stringify({
                _id: userInfo._id,
                username: userInfo.username
            }));
            res.json(responseData);
            return;
        }else{
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }

    });
});

router.get('/user/logout',function (req, res, next) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
    //return;
});

//获取指定文章的所有评论
router.get('/comment',function (req, res, next) {
    //内容的id
    var contentId = req.query.contentid || ''; //get-方式就用req.query post-就用req.body

    //查询这篇文章的信息
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
    })
});

//评论提交
router.post('/comment/post',function (req, res, next) {
    //内容的id
    var contentId = req.body.contentid || '';
    var postData = {
        username : req.userInfo.username,
        postTime : new Date,
        content : req.body.content
    }
    //查询这篇文章的信息
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData);
    })
});






module.exports =  router;