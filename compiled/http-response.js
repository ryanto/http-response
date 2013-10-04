window.HttpResponse = function() {
  this.Promise = Ember.RSVP.Promise;
  this.queue = new this.namespace.Queue();
  this.interceptor = "JQueryAjax";
  this.activate();
};

HttpResponse.prototype = {
  namespace: HttpResponse,

  activate: function() {
    this.interceptorInstance = new this.namespace[this.interceptor + "Interceptor"]();
    this.interceptorInstance.handler = this;
    this.interceptorInstance.activate();
  },

  stub: function(httpVerb, url, responseData) {
    var request, response;

    request = this.request({
      type: httpVerb,
      url: url
    });

    response = this.response({
      data: responseData
    });

    this.queue.add(request, response);
  },

  request: function(options) {
    return new this.namespace.Request(options);
  },

  response: function(options) {
    return new this.namespace.Response(options);
  },

  respondTo: function(requestData) {
    var queue = this.queue,
        request = this.request(requestData),
        findResponse = function() {
          return queue.responseFor(request);
        },
        respondWith = function(response, callback) {
          setTimeout(function() { callback(response.data); }, response.latency);
        },
        promising = function(resolve, reject) {
          var response = findResponse();
          if (response) {
            var callback = (response.error ? reject : resolve);
            respondWith(response, callback); 
          } else {
            // try to find the response in a few ms
            setTimeout(function() {
              promising(resolve, reject);
            }, 10);
          }
        };

    return new this.Promise(promising);
  }
};
HttpResponse.JQueryAjaxInterceptor = function() {
  this.queue = null;
};

HttpResponse.JQueryAjaxInterceptor.prototype = {
  activate: function(jquery) {
    if (!jquery) { jquery = window.jQuery || window.$; }
    jquery.ajax = this.interceptor();
  },

  format: function(url, settings) {
    if (!settings) { settings = {}; }

    return {
      url: url,
      type: settings.type || 'get'
    };
  },

  // this is generic so it can be abstracted out
  interceptor: function() {
    var instance = this,
        format = instance.format,
        handler = instance.handler;

    return function() {
      return handler.respondTo.call(handler, format.apply(instance, arguments));
    };
  }
};
HttpResponse.Queue = function() {
  this._queue = [];
};

HttpResponse.Queue.prototype = {
  add: function(request, response) {
    this._queue.push({
      request: request,
      response: response
    });
  },

  find: function(request) {
    var queue = this._queue,
        highestScore;

    if (!queue || queue.length === 0) { return; }

    highestScore = function(a, b) {
      if (!a) { return b; }
      if (!b) { return a; }
      return (request.compareScore(a) > request.compareScore(b) ? a : b);
    };

    return queue.reduce(highestScore);
  },

  responseFor: function(request) {
    var item = this.find(request);

    if (item) {
      return item.response;
    }
  }
};
HttpResponse.Request = function(options) {
  this.type = options.type;
  this.url = options.url;
};

HttpResponse.Request.prototype = {
  match: function(other) {
    return (this.type == other.type && this.url == other.url);
  },

  compareScore: function(other) {
    if (!this.match(other)) { return 0; }

    // come up with algo here
    return 1;
  }

};


HttpResponse.Response = function(options) {
  this.data = options.data;
  this.error = false;
  this.latency = options.latency || 10;
};

HttpResponse.Response.prototype = {

};
