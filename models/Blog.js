
var mongoose = require('mongoose');
var blogsSchema = require('../schemas/blogs');

module.exports = mongoose.model('Blog', blogsSchema);