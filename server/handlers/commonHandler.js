'use strict'

const EventEmitter = require('events');
class ResponseEmitter extends EventEmitter {};
var respEmitter = new ResponseEmitter();

module.exports = function() {

var methods = {};

	methods.getEventEmitter = function(){
    return respEmitter;
  }

    return methods;

}
