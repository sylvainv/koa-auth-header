"use strict";

var koa = require('koa');
var request = require('supertest');
var expect = require('chai').expect;
var agent = require('supertest-koa-agent');

describe("Authentication", function() {
  var app;
  beforeEach(function () {
    app = koa();

    var authHeader = require('../index.js')({
      required: true,
      types: {
        Bearer: function(value) {
          this.request.token = value;
        }
      }
    });

    app.use(function* (next) {
      try {
        yield next;
        this.response.body = this.request.token;
        this.response.status = 200;
      }
      catch(error) {
        this.response.body = error.message;
        this.response.status = error.status;
      }
    });

    app.use(authHeader);
  });

  it('Authentication required', function(done) {
    agent(app)
      .get('/')
      .expect(401)
      .expect((response) => {
        expect(response.text).to.be.equal('Authorization header required');
      })
      .end(done);
  });

  it('Authentication not supported', function (done) {
    agent(app)
      .get('/')
      .set('Authorization', 'Toto   ddd')
      .expect((response) => {
        expect(response.text).to.be.equal('Authorization header not supported');
      })
      .expect(401)
      .end(done);
  });

  it('Bearer Authentication', function (done) {
    agent(app)
      .get('/')
      .set('Authorization', 'Bearer   mytoken')
      .expect((response) => {
        expect(response.text).to.be.equal('mytoken');
      })
      .end(done);
  });
});
