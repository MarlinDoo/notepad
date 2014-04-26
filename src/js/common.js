//
// requirejs configuration.
// by making this a variable, we can share it between
// -- minifying job in grunt
// -- requirejs when running browser from within src
// -- phantomjs running jasmine started from grunt
//    (which needs to overwrite the base url)
//
var require = {
  baseUrl: "js",
  paths: {
    "dep": "redirected",
    "jquery": "vendor/jquery-1.9.1",
    "underscore": "vendor/underscore-1.5.2",
    "backbone": "vendor/backbone-1.1.0",
    "localstorage": "vendor/backbone-localstorage",
    "bootstrap": "vendor/bootstrap",
    // "bootstrap-modal": "vendor/bootstrap-modal",
    // "text": "vendor/text",
    // "baseinput": "ui/baseinput",
    // "inputTemp": "templates/inputTemp.html",
    "noteapp": "apps/noteapp",
    // test specific
    "jasmine": "vendor/jasmine-1.3.1",
    "jasmine-html": "vendor/jasmine-html-1.3.1",
    "SpecHelper": "../spec/SpecHelper",
    "PhantomReporter": "../spec/PhantomReporter",
    "PhantomRunner": "../spec/PhantomRunner",
    "HtmlRunner": "../spec/HtmlRunner"
  },
  shim: {
    "jasmine": {
      exports: "jasmine"
    },
    "jasmine-html": {
      deps: ["jasmine"]
    }
  }
};

