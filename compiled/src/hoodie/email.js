// Generated by CoffeeScript 1.3.3
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Hoodie.Email = (function() {

  function Email(hoodie) {
    this.hoodie = hoodie;
    this._handleEmailUpdate = __bind(this._handleEmailUpdate, this);

  }

  Email.prototype.send = function(emailAttributes) {
    var attributes, defer,
      _this = this;
    if (emailAttributes == null) {
      emailAttributes = {};
    }
    defer = this.hoodie.defer();
    attributes = $.extend({}, emailAttributes);
    if (!this._isValidEmail(emailAttributes.to)) {
      attributes.error = "Invalid email address (" + (attributes.to || 'empty') + ")";
      return defer.reject(attributes).promise();
    }
    this.hoodie.store.add('$email', attributes).then(function(obj) {
      return _this._handleEmailUpdate(defer, obj);
    });
    return defer.promise();
  };

  Email.prototype._isValidEmail = function(email) {
    if (email == null) {
      email = '';
    }
    return /@/.test(email);
  };

  Email.prototype._handleEmailUpdate = function(defer, attributes) {
    var _this = this;
    if (attributes == null) {
      attributes = {};
    }
    if (attributes.error) {
      return defer.reject(attributes);
    } else if (attributes.deliveredAt) {
      return defer.resolve(attributes);
    } else {
      return this.hoodie.remote.one("updated:$email:" + attributes.id, function(attributes) {
        return _this._handleEmailUpdate(defer, attributes);
      });
    }
  };

  return Email;

})();