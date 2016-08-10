"use strict";

var _ = require('lodash');

module.exports = function (options) {
  options = _.defaults(options || {}, {
    required: true,
    types: {}
  });

  return function* (next) {
    var header = this.request.header;
    if (typeof header === "undefined" || (typeof header !== "undefined" && typeof header.authorization === "undefined")) {
      if (options.required === true) {
        this.throw(401, 'Authorization header required');
      }

      yield next;
      return;
    }

    var parts = header.authorization.split(/[\W]+/);
    parts = parts.map((value) => {return value.trim()});

    if (parts.length === 2 && _.has(options.types, parts[0])) {
      // call the corresponding function for the type of authorization
      options.types[parts[0]].apply(this, [parts[1]]);
      yield next;
      return;
    }

    this.throw(401, 'Authorization header not supported');
  };
};
