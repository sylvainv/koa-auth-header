# koa-auth-header

Simple authorization header parser for koa.js framework

## Usage

```javascript
app = koa();

var authHeader = require('koa-auth-header')({
  required: true, // if the authorization are required, will throw a 401 if the header is not present,
  types: {
    // if the authorization header is Authorization: Bearer: sometoken
    Bearer: function(value) {
      this.request.token = value;
    }
  }
});

app.use(authHeader);
```
