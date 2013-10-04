HttpResponse.JQueryAjaxInterceptor = function() {
  this.queue = null;
};

// assumes jquery is available

HttpResponse.JQueryAjaxInterceptor.prototype = jQuery.extend(
  {}, HttpResponse.BaseInterceptor, {

  activate: function(jquery) {
    if (!jquery) { jquery = window.jQuery || window.$; }
    jquery.ajax = this.interceptor();
  },

  format: function(url, settings) {
    if (settings) {
      settings.url = url;
    }

    if (!settings && typeof url == "object") {
      settings = url;
    }

    if (!settings && typeof url == "string") {
      settings = {};
      settings.url = url;
    }

    return {
      url: settings.url,
      type: settings.type || 'get',
      resolve: settings.success || function() { },
      reject: settings.error || function() { }
    };
  }
});
