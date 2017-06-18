/**
 * Created by onlyhom on 2017/5/14.
 */

var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content', contentsSchema);