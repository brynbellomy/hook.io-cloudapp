
var Hook = require('hook.io').Hook,
    util = require('util'),
    cloud = require('cloudapp');

var types = ['all', 'image', 'bookmark', 'text', 'archive', 'audio', 'video', 'unknown'];

var CloudAppHook = exports.CloudAppHook = function(options){

  var self = this;

  Hook.call(self, options);

  self.config.use('file', { file: './config.json'});

  self.on('hook::ready', function(){
    
    self.on('*::list', function(event, email){
      self.list();
    });
  });

};

// CloudApp inherits from Hook
util.inherits(CloudAppHook, Hook);

CloudAppHook.prototype.list = function(options) {
  
  var self = this,
      settings = self.config.get('cloudapp');
  console.log('SETTINGS', settings);
  cloud.setCredentials(settings.email, settings.password);
 
  var params = {
    'page': 1,
    'per_page': 10,
    'type': 'all',
    'deleted': 'false'
  };

  if (params.type == 'all') {
    delete params.type;
  }
  cloud.getItems(params, function(err, result) {
    if(err) {
      return self.emit('error', err);
    }
      
    self.emit('list', result);
  });
};

