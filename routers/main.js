/**
 * Created by onlyhom on 2017/5/9.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

var data = {};

//公共数据
router.use(function (req, res, next) {

    //console.log(req.userInfo);

    data.userInfo = req.userInfo;
    data.categories = [];

    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
});




//首页
router.get('/',function (req, res, next) {
    // res.send('<h1>hello world!!</h1>');

    data.category = req.query.category || '';
    data.contents = [];
    data.pages = 0; //当前页
    data.page = Number(req.query.page || 1); //当前页
    data.limit = 2; //每页显示的条数
    data.count = 0;

    var where = {};
    if(data.category){ //只有传递过来category 才赋值跳转链接
        where.category = data.category
    }



    //读取所有的分类信息
    Category.where(where).count().then(function (count) {

        data.count = count;

        //计算总页数
        data.pages = Math.ceil(data.count/data.limit);
        //页数不能超过总页数
        data.page = Math.min(data.page, data.pages); //取这两个数当中 较小的一个值
        //页数不能小于1
        data.page = Math.max(data.page, 1); //取这俩个数当中 较大的一个值

        var skip = (data.page - 1) * data.limit; //忽略的条数

        //1升序 -1降序  _id带有时间戳
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime: -1
        });


    }).then(function (contents) {
        data.contents = contents;
        console.log('发送数据:');
        console.log(data);
        res.render('main/index',data);
    });


});

router.get('/view',function (req,res) {
    var contentID = req.query.contentid || '';
    Content.findOne({
        _id: contentID
    }).then(function (content) {
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view', data);
    });
});


module.exports = router;