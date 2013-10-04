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
