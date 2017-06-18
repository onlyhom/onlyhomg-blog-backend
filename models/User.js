/**
 * Created by onlyhom on 2017/5/14.
 */

var mongoose = require('mongoose');
var userSchema = require('../schemas/users');

module.exports = mongoose.model('User', userSchema);