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
