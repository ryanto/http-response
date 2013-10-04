HttpResponse.Request = function(options) {
  this.type = options.type;
  this.url = options.url;
  this.resolve = options.resolve;
  this.reject = options.reject;
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


