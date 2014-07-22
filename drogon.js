/**
 * Module dependencies.
 */

var fs = require('fs'),
  jade = require('jade')

var html = jade.renderFile('digit.jade')
fs.writeFileSync('digit.html',html)
