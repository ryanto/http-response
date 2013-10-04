HttpResponse.BaseInterceptor = {
  interceptor: function() {
    var instance = this,
        format = instance.format,
        handler = instance.handler;

    return function() {
      return handler.respondTo.call(handler, format.apply(instance, arguments));
    };
  }
};
