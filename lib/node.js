var assert = require('assert');
var events = require('events');
var url    = require('url');

var DEFAULT_TIMEOUT = 5000;

function Node(forge){
  this.forge    = forge;
}

Node.prototype.error    = function(){}
Node.prototype.receive  = function(){}
Node.prototype.send     = function(address,message){
  var frame = {
    head:{
      src: url.parse(this.name),
      dst: url.parse(address)
    },
    body: message
  }
  this.emitter.emit('message',frame);
  
  return this;
}

Node.prototype.enqueue = function(frame){
  var self = this;
  
  var body = frame.body;
  var head = frame.head;
  
  var header = function(message){
    self.send(src,message);
  }
  
  header.ReplyAddress = head.src;
  header.FromAddress  = head.dst;
  
  this.receive(body,header);
}

Node.prototype.emitter = new events.EventEmitter();
Node.prototype.name    = '';

function NodeForge(app){}

NodeForge.prototype.New = function(){
  return new Node(this);
}

NodeForge.prototype.NewCase = function(name,emitter){
  var node = this.New();
  
  node.emitter = emitter;
  node.name    = name;
  
  return node;
}

module.exports.forge = function(app){
  return new NodeForge(app);
}
