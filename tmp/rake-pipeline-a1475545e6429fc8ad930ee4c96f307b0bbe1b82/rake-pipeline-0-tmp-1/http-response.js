HttpResponse.JQueryAjaxInterceptor = function() {

};

HttpResponse.JQueryAjaxInterceptor.activate = function(jquery) {
  if (!jquery) { jquery = window.jQuery || window.$; }

  var instance = new this();

  this.call(jquery, function() {
    this.ajax = function() {
      return instance.handle(arguments);
    };
  });
};

JqueryAjaxInterceptor.prototype = {
  handle: function(url, settings) {
    console.log('you are requesting ' + url);
  }
};
HttpResponse = {};
