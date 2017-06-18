/**
 * Created by onlyhom on 2017/5/14.
 */

var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category', categoriesSchema);