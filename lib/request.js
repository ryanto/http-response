HttpResponse.Request = function(options) {
  // actuall request
  this.type = options.type;
  this.url = options.url;

  // object data
  this.resolve = options.resolve;
  this.reject = options.reject;
  this.timeout = options.timeout || 1;
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


