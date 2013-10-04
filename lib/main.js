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
        respondToRequest = function(resolve, reject) {
          var response = findResponse();
          if (response) {
            if (request.error) {
              reject();
              callback = request.reject;
            } else {
              resolve();
              callback = request.resolve;
            }
            respondWith(response, callback);
          } else {
            // try to find the response in a few ms
            // timeout if searching for too long
            setTimeout(function() {
              promising(resolve, reject);
            }, 10);
          }
        };

    return new this.Promise(respondToRequest);
  }
};
