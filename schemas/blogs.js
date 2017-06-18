var mongoose = require('mongoose'); //加载数据库模块

//内容的表结构
module.exports = new mongoose.Schema({
    //博文标题
    title:String,
    //添加时间
    addTime:{
        type:Date,
        default: new Date
    },
    //描述
    description:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },
    //delta
    delta:{
        type:Array,
        default:[]
    }
});


