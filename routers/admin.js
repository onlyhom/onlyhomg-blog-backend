/**
 * Created by onlyhom on 2017/5/9.
 */

var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var Blog = require('../models/Blog');
var Work = require('../models/Work');//新增

router.use(function (req, res, next) {
    if(!req.userInfo.isAdmin){ //非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});


//首页
router.get('/',function (req, res, next) {
    res.render('admin/index',{
        userInfo: req.userInfo
    });
});


//用户管理
router.get('/user',function (req, res, next) {

    //从数据库中读取所有用户数据

    //limit(Number): 限制获取的数据条数 取多少条
    //skip(Number): 忽略数据的条数
    //
    //每页显示2条
    //1: 1-2 skip(0) -> (当前页-1)*limit
    //2: 3-4 skip(2)

    var pages = 0;  //总页数
    var page = Number(req.query.page || 1); //当前页
    var limit = 2; //每页显示的条数

    User.count().then(function (count) { //查询总条数 异步的
        //计算总页数
        pages = Math.ceil(count/limit);
        //页数不能超过总页数
        page = Math.min(page, pages); //取这两个数当中 较小的一个值
        //页数不能小于1
        page = Math.max(page, 1); //取这俩个数当中 较大的一个值

        var skip = (page - 1) * limit; //忽略的条数

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users : users,
                count : count,
                pages : pages,
                limit : limit,
                page: page
            });
        });
        
    });
});

// ========== 分类 ===========

//分类首页
router.get('/category',function (req, res, next) {

    //从数据库中读取所有用户数据

    //limit(Number): 限制获取的数据条数 取多少条
    //skip(Number): 忽略数据的条数
    //
    //每页显示2条
    //1: 1-2 skip(0) -> (当前页-1)*limit
    //2: 3-4 skip(2)

    var pages = 0;  //总页数
    var page = Number(req.query.page || 1); //当前页
    var limit = 10; //每页显示的条数

    Category.count().then(function (count) { //查询总条数 异步的
        //计算总页数
        pages = Math.ceil(count/limit);
        //页数不能超过总页数
        page = Math.min(page, pages); //取这两个数当中 较小的一个值
        //页数不能小于1
        page = Math.max(page, 1); //取这俩个数当中 较大的一个值

        var skip = (page - 1) * limit; //忽略的条数


        //1升序 -1降序  _id带有时间戳
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categories : categories,
                count : count,
                pages : pages,
                limit : limit,
                page: page
            });
        });
    });

});

//分类的添加
router.get('/category/add',function (req, res) {
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
});

//分类的保存
router.post('/category/add',function (req, res) {
    var name = req.body.name || '';
    if(name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        });
        return;
    }

    //数据库中是否已存在同名分类名称
    Category.findOne({
        name:name
    }).then(function (result) {
        if(result){//数据库已存在该分类
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在了'
            });
            return promise.reject();
        }else {
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        });
    });

});

//分类修改
router.get('/category/edit',function (req, res) {
    //获取要修改的分类信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    });
});

//分类修改-保存
router.post('/category/edit',function (req, res) {
    var id = req.query.id || '';
    var name = req.body.name || '';
    if(name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        });
        return;
    }

    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{

            //用户没有做任何修改
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                //要修改的分类在数据库中是否存在
                console.log('name:'+name);
                Category.findOne({
                    name:name
                }).then(function (same) {
                    if(same){
                        res.render('admin/error',{
                            userInfo:req.userInfo,
                            message:'数据库中已经存在同名分类'
                        });
                        return Promise.reject();
                    }else{
                        return Category.update({_id:id},{name:name}); //参数1：条件 参数2：修改的值
                    }
                }).then(function () {
                    res.render('admin/success',{
                        userInfo:req.userInfo,
                        message:'修改成功',
                        url:'/admin/category'
                    });
                });
            }
        }
    });

});

//分类删除
router.get('/category/delete',function (req, res) {
    var id = req.query.id || '';
    Category.remove({
        _id:id
    }).then(function () { //有必要的话 还要验证是否存在
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        });
    })
});

// ========== 内容 ===========

//内容首页
router.get('/content',function (req, res) {

    var pages = 0;  //总页数
    var page = Number(req.query.page || 1); //当前页
    var limit = 10; //每页显示的条数

    Content.count().then(function (count) { //查询总条数 异步的
        //计算总页数
        pages = Math.ceil(count/limit);
        //页数不能超过总页数
        page = Math.min(page, pages); //取这两个数当中 较小的一个值
        //页数不能小于1
        page = Math.max(page, 1); //取这俩个数当中 较大的一个值

        var skip = (page - 1) * limit; //忽略的条数


        //1升序 -1降序  _id带有时间戳
        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({
            addTime: -1
        }).then(function (contents) {
            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents : contents,
                count : count,
                pages : pages,
                limit : limit,
                page: page
            });
        });
    });



});

//内容添加
router.get('/content/add',function (req, res) {

    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories:categories
        }); //第二个参数 是分配给这个模板对象的数据
    });

});

//内容保存
router.post('/content/add',function (req, res) {
    if( req.body.category == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }

    if( req.body.title == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }

    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function (result) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message: '保存成功',
            url:'/admin/content'
        });
    });
});

//内容修改
router.get('/content/edit',function (req, res) {

    var id = req.query.id || '';

    var categories = [];

    Category.find().sort({_id:-1}).then(function (rs) {

        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function (content) {

        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            });
        }

    });

});

//内容修改-保存
router.post('/content/edit',function (req, res) {
    var id = req.query.id || '';
    if( req.body.category == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }

    if( req.body.title == '' ){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }

    Content.update({_id:id},{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message: '修改成功',
            url:'/admin/content/edit?id='+ id
        });
    });



    // Content.findOne({
    //     _id:id
    // }).then(function (content) {
    //     if(!content){
    //         res.render('admin/error',{
    //             userInfo:req.userInfo,
    //             message:'指定内容不存在'
    //         });
    //         return Promise.reject();
    //     }else{
    //
    //         //用户没有做任何修改
    //
    //         //要修改的标题在数据库中是否存在
    //         Category.findOne({
    //             title:title
    //         }).then(function (same) {
    //             if(same){
    //                 res.render('admin/error',{
    //                     userInfo:req.userInfo,
    //                     message:'数据库中已经存在同名标题'
    //                 });
    //                 return Promise.reject();
    //             }else{
    //                 return Content.update({_id:id}, {
    //                     category: req.body.category,
    //                     title: req.body.title,
    //                     description: req.body.description,
    //                     content: req.body.content
    //                 })
    //             }
    //         }).then(function () {
    //             res.render('admin/success',{
    //                 userInfo:req.userInfo,
    //                 message:'修改成功',
    //                 url:'/admin/category'
    //             });
    //         });
    //
    //     }
    // });


});

//内容删除
router.get('/content/delete',function (req, res) {
    var id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function () { //有必要的话 还要验证是否存在
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        });
    })
});

// ========== 博文 ===========


//博文首页
router.get('/blog',function (req, res) {

    var pages = 0;  //总页数
    var page = Number(req.query.page || 1); //当前页
    var limit = 10; //每页显示的条数

    Blog.count().then(function (count) {
        //查询总条数 异步的
        //计算总页数
        pages = Math.ceil(count/limit);
        //页数不能超过总页数
        page = Math.min(page, pages); //取这两个数当中 较小的一个值
        //页数不能小于1
        page = Math.max(page, 1); //取这俩个数当中 较大的一个值
        var skip = (page - 1) * limit; //忽略的条数

        //1升序 -1降序  _id带有时间戳
        Blog.find().limit(limit).skip(skip).sort({
            addTime: -1
        }).then(function (blogs) {
            res.render('admin/blog_index',{
                blogs : blogs,
                count : count,
                pages : pages,
                limit : limit,
                page: page
            });
        });
    });

});

//博文添加
router.get('/blog/add',function (req, res) {
    res.render('admin/blog_add',{
        userInfo: req.userInfo,
    });
});

//博文保存(在/api中实现)

//博文修改
router.get('/blog/edit',function (req, res) {

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
            res.render('admin/blog_edit',{
                userInfo:req.userInfo,
                blog:blog
            });
        }
    });
});

//博文删除
router.get('/blog/delete',function (req, res) {
    var id = req.query.id || '';
    Blog.remove({
        _id:id
    }).then(function () { //有必要的话 还要验证是否存在
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/blog'
        });
    })
});

// ========== 作品 ===========

//作品首页
router.get('/work',function (req, res) {

    var pages = 0;  //总页数
    var page = Number(req.query.page || 1); //当前页
    var limit = 5; //每页显示的条数
    var count = 0;

    var categories = [];

    Category.find().then(function (result) {
        categories = result;
        next();
    });


    var where = {};//查询条件
    if(req.query.category){ //只有传递过来category 才赋值跳转链接
        where.category = req.query.category;
    }

    Work.where(where).count().then(function (result_count) {

        count = result_count;

        //计算总页数
        pages = Math.ceil(count / limit);
        //页数不能超过总页数
        page = Math.min(page, pages); //取这两个数当中 较小的一个值
        //页数不能小于1
        page = Math.max(page, 1); //取这俩个数当中 较大的一个值

        var skip = (page - 1) * limit; //忽略的条数

        //1升序 -1降序  _id带有时间戳
        return Work.where(where).find().sort({_id: -1}).limit(limit).skip(skip).populate(['category']);

    }).then(function (works) {

        res.render('admin/work_index',{
            userInfo: req.userInfo,
            categories: categories,
            category: req.query.category,
            works : works,
            count : count,
            pages : pages,
            limit : limit,
            page: page
        });
    });

});

//作品添加-get
router.get('/work/add',function (req, res) {
    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/work_add',{
            userInfo: req.userInfo,
            categories:categories
        });
    });
});

//作品修改
router.get('/work/edit',function (req, res) {

    var id = req.query.id || '';

    var categories = [];

    Category.find().sort({_id:-1}).then(function (rs) {
        categories = rs;
        return Work.findOne({
            _id: id
        }).populate('category');
    }).then(function (work) {
        if(!work){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/work_edit',{
                userInfo:req.userInfo,
                categories:categories,
                work:work
            });
        }
    });


});

//作品删除
router.get('/work/delete',function (req, res) {
    var id = req.query.id || '';
    Work.remove({
        _id:id
    }).then(function () { //有必要的话 还要验证是否存在
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/work'
        });
    })
});


module.exports = router;