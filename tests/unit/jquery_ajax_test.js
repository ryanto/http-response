var interceptor;

module("Unit Interceptor JQuery Ajax", {
  setup: function() {
    interceptor = new HttpResponse.JQueryAjaxInterceptor();
  },
  teardown: function() {
    interceptor = null;
  }
});

test("should find and patch jquery automatically", function() {
  var tmp = window.jQuery,
      stub = {};

  window.jQuery = stub;

  interceptor.activate();
  ok(stub.ajax, 'found and set ajax function');

  window.jQuery = tmp;
});

test("should be able to understand $.ajax with only a url", function() {
  var request = interceptor.format("/hello/world");
  equal(request.url, "/hello/world");
  equal(request.type, "get");
});

test("should be able to understand $.ajax with only options", function() {
  var request = interceptor.format({
    type: "post",
    url: "/things"
  });

  equal(request.url, "/things");
  equal(request.type, "post");
});

test("should be able to understand $.ajax with a url and object", function() {
  var request = interceptor.format("/people", { type: "patch" });
  equal(request.url, "/people");
  equal(request.type, "patch");
});
