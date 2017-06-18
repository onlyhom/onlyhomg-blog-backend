/**
 * Created by onlyhom on 2017/5/9.
 */

var mongoose = require('mongoose'); //加载数据库模块

//用户的表结构
module.exports = new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});


