HttpResponse.Response = function(options) {
  this.data = options.data;
  this.error = false;
  this.latency = options.latency || 10;
};

HttpResponse.Response.prototype = {

};
