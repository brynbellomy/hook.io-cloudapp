
var Hook = require('hook.io').Hook,
    util = require('util'),
    cloud = require('cloudapp');

var types = ['all', 'image', 'bookmark', 'text', 'archive', 'audio', 'video', 'unknown'];

var CloudAppHook = exports.CloudAppHook = function(options){

  var self = this;

  Hook.call(self, options);

  self.config.use('file', { file: './config.json'});

  self.on('hook::ready', function(){
    
    self.on('*::list', function(event){
      require('inspect')(arguments);
      var opts = {
        type: event
      };
      self.list(opts);
    });

    self.on('*::addBookmark', function(event) {
      var opts = {
        url: event.url,
        name: event.name
      };
      self.addBookmark(opts);
    });

  });

};

// CloudApp inherits from Hook
util.inherits(CloudAppHook, Hook);

CloudAppHook.prototype.addBookmark = function(options) {
  var self = this,
      options = options || {},
      settings = self.config.get('cloudapp');
  
  cloud.setCredentials(settings.email, settings.password);

  cloud.addBookmark(options.url, function(result) {
    require('inspect')(arguments);
  }, options.name);
};

CloudAppHook.prototype.list = function(options) {


  var self = this,
      options = options || {},
      settings = self.config.get('cloudapp');
  
  cloud.setCredentials(settings.email, settings.password);

  var params = {
    'page': 1,
    'per_page': 10,
    //'type': (options.itemType != null ? options.itemType : 'all'),
    'deleted': 'false'
  };
console.log('options', options);
  if (options.type && typeof options.type == 'string') {
    params.type = options.type
  }

  if (params.type == 'all') {
    delete params.type;
  }

  cloud.getItems(params, function(result) {
    var vartype = typeof result;
    try {
      console.log('>> type', typeof result);
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
    } catch(err) {
      self.emit('error', 'Could not parse response JSON.');
    }

    self.emit('listTypeof', vartype);
    self.emit('listResponse', result);
    require('inspect')(arguments);

    console.log('=======');
    console.log(result[0].href);
  });
};

