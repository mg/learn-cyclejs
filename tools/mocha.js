var jsdom = require('jsdom')
var chai = require('chai')

// set up babel for mocha
require("babel/register")({
  babelrc: '../.babelrc',
});

// When running tests, we have no interest in any pictures, style files
// or related assets. These only make sense in the browser enviroment
// so we simply ignore them when running unit tests
function noop() {
  return null
}

// add to this list when we need to ignore a new asset type
require.extensions['.css']= noop
require.extensions['.less']= noop
require.extensions['.sass']= noop
require.extensions['.scss']= noop
require.extensions['.svg']= noop
require.extensions['.png']= noop


// the virtual dom enviroment for the unit tests
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
var win = doc.defaultView

global.document = doc
global.window = win

// anything in window should also be in global
Object.keys(window).forEach(function(key) {
  if (!(key in global)) {
    global[key] = window[key]
  }
})

// Set up enviroment for react-vendor-prefixes package
global.window.getComputedStyle= function() {
  return ['-webkit-']
}
