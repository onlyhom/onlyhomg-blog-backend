var mongoose = require('mongoose'); //加载数据库模块

//内容的表结构
module.exports = new mongoose.Schema({
    //关联字段 - 作品分类的id
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    name:String,
    //描述
    description:{
        type:String,
        default:''
    },
    imageUrl:{
        type:String,
        default:''
    },
    demoUrl:{
        type:String,
        default:'#'
    },
    onlineUrl:{
        type:String,
        default:'#'
    },
    codeUrl:{
        type:String,
        default:''
    }
});


