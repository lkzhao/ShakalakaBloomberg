(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/luke/RiceProjects/InstantChat-Server/websrc/util/Auth.coffee":[function(require,module,exports){
var defaultUsername, initialSocket, token, username;

defaultUsername = "anonymous";

token = localStorage["token"];

username = localStorage["username"];

if (!username) {
  token = null;
}

initialSocket = io.connect("", {
  query: "token=" + token
});

initialSocket.on("connect", function() {
  console.log("socket connected");
  return $.get("/user/profile/" + auth.username + "?token=" + auth.token).done((function(_this) {
    return function(data) {
      console.log("load initial profile");
      auth.profile = data;
      return auth._onProfileChange();
    };
  })(this)).fail((function(_this) {
    return function() {};
  })(this));
});

initialSocket.on("profileChange", function(data) {
  console.log("received profileChange from socket");
  auth.profile = data;
  return auth._onProfileChange();
});

window.auth = {
  username: username,
  token: token,
  socket: initialSocket,
  callbacks: {},
  onceCallbacks: {},
  profile: {},
  _onProfileChange: function() {
    var cb, i, j, len, len1, ref, ref1, results;
    if (this.onceCallbacks.profileChange) {
      ref = this.onceCallbacks.profileChange;
      for (i = 0, len = ref.length; i < len; i++) {
        cb = ref[i];
        console.log(cb);
        cb(this.profile);
      }
      this.onceCallbacks.profileChange = [];
    }
    if (this.callbacks.profileChange) {
      ref1 = this.callbacks.profileChange;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        cb = ref1[j];
        console.log(cb);
        results.push(cb(this.profile));
      }
      return results;
    }
  },
  once: function(key, cb) {
    if (this.onceCallbacks[key]) {
      return this.onceCallbacks[key].push(cb);
    } else {
      return this.onceCallbacks[key] = [cb];
    }
  },
  on: function(key, cb) {
    if (this.callbacks[key]) {
      return this.callbacks[key].push(cb);
    } else {
      return this.callbacks[key] = [cb];
    }
  },
  off: function(key, cb) {
    var index;
    if (this.callbacks[key]) {
      index = this.callbacks[key].indexOf(cb);
      return this.callbacks[key].splice(index, 1);
    }
  },
  loggedIn: function() {
    return this.token && this.username;
  },
  _saveTokenAndUsername: function(token, username) {
    this.socket.disconnect();
    localStorage["username"] = username;
    this.username = username;
    localStorage["token"] = token;
    this.token = localStorage["token"];
    return this.socket.connect("", {
      query: "token=" + token
    });
  },
  uploadImage: function(imageFile, callback) {
    var data;
    if (!this.loggedIn()) {
      return;
    }
    if (!imageFile) {
      return;
    }
    data = new FormData();
    data.append("image", imageFile);
    return $.ajax({
      url: "/user/upload?token=" + auth.token,
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST'
    }).done((function(_this) {
      return function(data) {
        return callback(true);
      };
    })(this)).fail(function() {
      return callback(false);
    });
  },
  authenticate: function(username, password, callback) {
    console.log(username, password);
    return $.ajax({
      url: window.location.origin + "/login",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: username,
        password: password
      })
    }).done((function(_this) {
      return function(data, textStatus, jqXHR) {
        if (data.success && data.token) {
          _this._saveTokenAndUsername(data.token, username);
          return _this.once('profileChange', callback);
        } else {
          return callback(false, data.error);
        }
      };
    })(this)).fail((function(_this) {
      return function(jqXHR, textStatus, errorThrown) {
        return callback(false, {
          error: "Cannot connect to server"
        });
      };
    })(this));
  },
  signup: function(username, password, email, name, callback) {
    return $.ajax({
      url: window.location.origin + "/signup",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: username,
        password: password,
        email: email,
        name: name
      })
    }).done((function(_this) {
      return function(data, textStatus, jqXHR) {
        if (data.success && data.token) {
          _this.profile = {};
          _this.once('profileChange', callback);
          return _this._saveTokenAndUsername(data.token, username);
        } else if (data.error) {
          return callback(false, data.error);
        }
      };
    })(this)).fail((function(_this) {
      return function(jqXHR, textStatus, errorThrown) {
        return callback(false, {
          error: "Cannot connect to server"
        });
      };
    })(this));
  },
  logout: function() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.username = null;
    return this.token = null;
  }
};

module.exports = auth;


},{}],"/Users/luke/RiceProjects/InstantChat-Server/websrc/view/main.cjsx":[function(require,module,exports){
var Auth;

Auth = require("../util/Auth");


},{"../util/Auth":"/Users/luke/RiceProjects/InstantChat-Server/websrc/util/Auth.coffee"}]},{},["/Users/luke/RiceProjects/InstantChat-Server/websrc/view/main.cjsx"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbHVrZS9SaWNlUHJvamVjdHMvSW5zdGFudENoYXQtU2VydmVyL3dlYnNyYy91dGlsL0F1dGguY29mZmVlIiwiL1VzZXJzL2x1a2UvUmljZVByb2plY3RzL0luc3RhbnRDaGF0LVNlcnZlci93ZWJzcmMvdmlldy9tYWluLmNqc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGVBQUEsR0FBa0I7O0FBQ2xCLEtBQUEsR0FBUSxZQUFhLENBQUEsT0FBQTs7QUFDckIsUUFBQSxHQUFXLFlBQWEsQ0FBQSxVQUFBOztBQUN4QixJQUFHLENBQUMsUUFBSjtFQUNFLEtBQUEsR0FBUSxLQURWOzs7QUFHQSxhQUFBLEdBQWdCLEVBQUUsQ0FBQyxPQUFILENBQVcsRUFBWCxFQUFlO0VBQUEsS0FBQSxFQUFNLFFBQUEsR0FBUyxLQUFmO0NBQWY7O0FBRWhCLGFBQWEsQ0FBQyxFQUFkLENBQWlCLFNBQWpCLEVBQTRCLFNBQUE7RUFDMUIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBWjtTQUNBLENBQUMsQ0FBQyxHQUFGLENBQU0sZ0JBQUEsR0FBaUIsSUFBSSxDQUFDLFFBQXRCLEdBQStCLFNBQS9CLEdBQXdDLElBQUksQ0FBQyxLQUFuRCxDQUNFLENBQUMsSUFESCxDQUNTLENBQUEsU0FBQSxLQUFBO1dBQUEsU0FBQyxJQUFEO01BQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQkFBWjtNQUNBLElBQUksQ0FBQyxPQUFMLEdBQWU7YUFDZixJQUFJLENBQUMsZ0JBQUwsQ0FBQTtJQUhLO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURULENBS0csQ0FBQyxJQUxKLENBS1UsQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFBLEdBQUE7RUFBQSxDQUFBLENBQUEsQ0FB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LEVBSkY7U0FBQSxNQUtLLElBQUcsSUFBSSxDQUFDLEtBQVI7aUJBQ0gsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsSUFBSSxDQUFDLEtBQXJCLEVBREc7O01BTkE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVlAsQ0FrQkMsQ0FBQyxJQWxCRixDQWtCTyxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsV0FBcEI7ZUFDTCxRQUFBLENBQVMsS0FBVCxFQUFnQjtVQUFDLEtBQUEsRUFBTywwQkFBUjtTQUFoQjtNQURLO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWxCUDtFQURNLENBbkZSO0VBMEdBLE1BQUEsRUFBUSxTQUFBO0lBQ04sWUFBWSxDQUFDLFVBQWIsQ0FBd0IsT0FBeEI7SUFDQSxZQUFZLENBQUMsVUFBYixDQUF3QixVQUF4QjtJQUNBLElBQUMsQ0FBQSxRQUFELEdBQVk7V0FDWixJQUFDLENBQUEsS0FBRCxHQUFTO0VBSkgsQ0ExR1I7OztBQWdIRixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ3pJakIsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGNBQVIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZGVmYXVsdFVzZXJuYW1lID0gXCJhbm9ueW1vdXNcIlxudG9rZW4gPSBsb2NhbFN0b3JhZ2VbXCJ0b2tlblwiXVxudXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2VbXCJ1c2VybmFtZVwiXVxuaWYgIXVzZXJuYW1lXG4gIHRva2VuID0gbnVsbFxuXG5pbml0aWFsU29ja2V0ID0gaW8uY29ubmVjdChcIlwiLCBxdWVyeTpcInRva2VuPSN7dG9rZW59XCIpXG5cbmluaXRpYWxTb2NrZXQub24gXCJjb25uZWN0XCIsIC0+XG4gIGNvbnNvbGUubG9nIFwic29ja2V0IGNvbm5lY3RlZFwiXG4gICQuZ2V0KFwiL3VzZXIvcHJvZmlsZS8je2F1dGgudXNlcm5hbWV9P3Rva2VuPSN7YXV0aC50b2tlbn1cIilcbiAgICAuZG9uZSggKGRhdGEpPT5cbiAgICAgIGNvbnNvbGUubG9nIFwibG9hZCBpbml0aWFsIHByb2ZpbGVcIlxuICAgICAgYXV0aC5wcm9maWxlID0gZGF0YVxuICAgICAgYXV0aC5fb25Qcm9maWxlQ2hhbmdlKClcbiAgICApLmZhaWwoID0+XG5cbiAgICApXG5cbmluaXRpYWxTb2NrZXQub24gXCJwcm9maWxlQ2hhbmdlXCIsIChkYXRhKSAtPlxuICBjb25zb2xlLmxvZyBcInJlY2VpdmVkIHByb2ZpbGVDaGFuZ2UgZnJvbSBzb2NrZXRcIlxuICBhdXRoLnByb2ZpbGUgPSBkYXRhXG4gIGF1dGguX29uUHJvZmlsZUNoYW5nZSgpXG5cbndpbmRvdy5hdXRoID0gXG4gIHVzZXJuYW1lOiB1c2VybmFtZVxuICB0b2tlbjogdG9rZW5cbiAgc29ja2V0OiBpbml0aWFsU29ja2V0XG4gIGNhbGxiYWNrczoge31cbiAgb25jZUNhbGxiYWNrczoge31cbiAgcHJvZmlsZToge31cblxuICBfb25Qcm9maWxlQ2hhbmdlOiAtPlxuICAgIGlmIEBvbmNlQ2FsbGJhY2tzLnByb2ZpbGVDaGFuZ2VcbiAgICAgIGZvciBjYiBpbiBAb25jZUNhbGxiYWNrcy5wcm9maWxlQ2hhbmdlXG4gICAgICAgIGNvbnNvbGUubG9nIGNiXG4gICAgICAgIGNiKEBwcm9maWxlKVxuICAgICAgQG9uY2VDYWxsYmFja3MucHJvZmlsZUNoYW5nZSA9IFtdXG4gICAgaWYgQGNhbGxiYWNrcy5wcm9maWxlQ2hhbmdlXG4gICAgICBmb3IgY2IgaW4gQGNhbGxiYWNrcy5wcm9maWxlQ2hhbmdlXG4gICAgICAgIGNvbnNvbGUubG9nIGNiXG4gICAgICAgIGNiKEBwcm9maWxlKVxuXG4gIG9uY2U6IChrZXksIGNiKS0+XG4gICAgaWYgQG9uY2VDYWxsYmFja3Nba2V5XVxuICAgICAgQG9uY2VDYWxsYmFja3Nba2V5XS5wdXNoIGNiXG4gICAgZWxzZVxuICAgICAgQG9uY2VDYWxsYmFja3Nba2V5XSA9IFtjYl1cblxuICBvbjogKGtleSwgY2IpLT5cbiAgICBpZiBAY2FsbGJhY2tzW2tleV1cbiAgICAgIEBjYWxsYmFja3Nba2V5XS5wdXNoIGNiXG4gICAgZWxzZVxuICAgICAgQGNhbGxiYWNrc1trZXldID0gW2NiXVxuXG4gIG9mZjogKGtleSwgY2IpLT5cbiAgICBpZiBAY2FsbGJhY2tzW2tleV1cbiAgICAgIGluZGV4ID0gQGNhbGxiYWNrc1trZXldLmluZGV4T2YoY2IpXG4gICAgICBAY2FsbGJhY2tzW2tleV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICBcbiAgbG9nZ2VkSW46IC0+XG4gICAgcmV0dXJuIEB0b2tlbiBhbmQgQHVzZXJuYW1lXG5cbiAgX3NhdmVUb2tlbkFuZFVzZXJuYW1lOiAodG9rZW4sIHVzZXJuYW1lKSAtPlxuICAgIEBzb2NrZXQuZGlzY29ubmVjdCgpXG4gICAgbG9jYWxTdG9yYWdlW1widXNlcm5hbWVcIl0gPSB1c2VybmFtZVxuICAgIEB1c2VybmFtZSA9IHVzZXJuYW1lXG4gICAgbG9jYWxTdG9yYWdlW1widG9rZW5cIl0gPSB0b2tlblxuICAgIEB0b2tlbiA9IGxvY2FsU3RvcmFnZVtcInRva2VuXCJdXG4gICAgQHNvY2tldC5jb25uZWN0KFwiXCIsIHF1ZXJ5OlwidG9rZW49I3t0b2tlbn1cIilcblxuICB1cGxvYWRJbWFnZTogKGltYWdlRmlsZSwgY2FsbGJhY2spIC0+XG4gICAgaWYgIUBsb2dnZWRJbigpXG4gICAgICByZXR1cm5cbiAgICBpZiAhaW1hZ2VGaWxlXG4gICAgICByZXR1cm5cbiAgICBkYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBkYXRhLmFwcGVuZCBcImltYWdlXCIsIGltYWdlRmlsZVxuICAgICQuYWpheChcbiAgICAgIHVybDogXCIvdXNlci91cGxvYWQ/dG9rZW49I3thdXRoLnRva2VufVwiLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIHR5cGU6ICdQT1NUJ1xuICAgICkuZG9uZSggKGRhdGEpID0+XG4gICAgICBjYWxsYmFjayB0cnVlXG4gICAgKS5mYWlsKCAtPlxuICAgICAgY2FsbGJhY2sgZmFsc2VcbiAgICApXG5cbiAgYXV0aGVudGljYXRlOiAodXNlcm5hbWUsIHBhc3N3b3JkLCBjYWxsYmFjaykgLT5cbiAgICBjb25zb2xlLmxvZyB1c2VybmFtZSwgcGFzc3dvcmRcbiAgICAkLmFqYXgoXG4gICAgICB1cmw6IFwiI3t3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9sb2dpblwiXG4gICAgICB0eXBlOiBcIlBPU1RcIlxuICAgICAgY29udGVudFR5cGUgOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQpXG4gICAgKS5kb25lKChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT5cbiAgICAgIGlmIGRhdGEuc3VjY2VzcyAmJiBkYXRhLnRva2VuXG4gICAgICAgIEBfc2F2ZVRva2VuQW5kVXNlcm5hbWUgZGF0YS50b2tlbiwgdXNlcm5hbWVcbiAgICAgICAgQG9uY2UgJ3Byb2ZpbGVDaGFuZ2UnLCBjYWxsYmFja1xuICAgICAgZWxzZVxuICAgICAgICBjYWxsYmFjayBmYWxzZSwgZGF0YS5lcnJvclxuICAgICkuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+XG4gICAgICBjYWxsYmFjayBmYWxzZSwge2Vycm9yOiBcIkNhbm5vdCBjb25uZWN0IHRvIHNlcnZlclwifVxuICAgIClcblxuICBzaWdudXA6ICh1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsLCBuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAkLmFqYXgoXG4gICAgICB1cmw6IFwiI3t3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9zaWdudXBcIlxuICAgICAgdHlwZTogXCJQT1NUXCJcbiAgICAgIGNvbnRlbnRUeXBlIDogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICBuYW1lOiBuYW1lXG4gICAgICApXG4gICAgKS5kb25lKChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT5cbiAgICAgIGlmIGRhdGEuc3VjY2VzcyBhbmQgZGF0YS50b2tlblxuICAgICAgICBAcHJvZmlsZSA9IHt9XG4gICAgICAgICMgd2FpdCBmb3IgcHJvZmlsZWNoYW5nZSBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2tcbiAgICAgICAgQG9uY2UgJ3Byb2ZpbGVDaGFuZ2UnLCBjYWxsYmFja1xuICAgICAgICBAX3NhdmVUb2tlbkFuZFVzZXJuYW1lIGRhdGEudG9rZW4sIHVzZXJuYW1lXG4gICAgICBlbHNlIGlmIGRhdGEuZXJyb3JcbiAgICAgICAgY2FsbGJhY2sgZmFsc2UsIGRhdGEuZXJyb3JcbiAgICApLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PlxuICAgICAgY2FsbGJhY2sgZmFsc2UsIHtlcnJvcjogXCJDYW5ub3QgY29ubmVjdCB0byBzZXJ2ZXJcIn1cbiAgICApXG5cbiAgbG9nb3V0OiAtPlxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtIFwidG9rZW5cIlxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtIFwidXNlcm5hbWVcIlxuICAgIEB1c2VybmFtZSA9IG51bGxcbiAgICBAdG9rZW4gPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gYXV0aCIsIkF1dGggPSByZXF1aXJlIFwiLi4vdXRpbC9BdXRoXCJcbiMgUmVhY3QgPSByZXF1aXJlIFwicmVhY3QvYWRkb25zXCJcblxuIyBSb3V0ZXIgPSByZXF1aXJlIFwicmVhY3Qtcm91dGVyXCJcblxuIyBEZWZhdWx0Um91dGUgPSBSb3V0ZXIuRGVmYXVsdFJvdXRlXG4jIE5vdEZvdW5kUm91dGUgPSBSb3V0ZXIuTm90Rm91bmRSb3V0ZVxuIyBMaW5rID0gUm91dGVyLkxpbmtcbiMgUm91dGUgPSBSb3V0ZXIuUm91dGVcbiMgUm91dGVIYW5kbGVyID0gUm91dGVyLlJvdXRlSGFuZGxlclxuIyBOYXZpZ2F0aW9uID0gUm91dGVyLk5hdmlnYXRpb25cbiMgUmVkaXJlY3QgPSBSb3V0ZXIuUmVkaXJlY3RcblxuIyBSb29tID0gcmVxdWlyZSBcIi4vcm9vbVwiXG4jIExvZ2luID0gcmVxdWlyZSBcIi4vbG9naW5cIlxuIyBEYXNoYm9hcmQgPSByZXF1aXJlIFwiLi9kYXNoYm9hcmRcIlxuIyBTaWdudXBTdWNjZXNzID0gcmVxdWlyZSBcIi4vc2lnbnVwU3VjY2Vzc1wiXG5cbiMgVGhlbWVNYW5hZ2VyID0gcmVxdWlyZShcIm1hdGVyaWFsLXVpL2xpYi9zdHlsZXMvdGhlbWUtbWFuYWdlclwiKSgpXG4jIGluamVjdFRhcEV2ZW50UGx1Z2luID0gcmVxdWlyZSBcInJlYWN0LXRhcC1ldmVudC1wbHVnaW5cIlxuXG4jIENvbG9ycyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9zcmMvc3R5bGVzL2NvbG9yc1wiKVxuXG4jIGluamVjdFRhcEV2ZW50UGx1Z2luKClcblxuIyBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzc1xuIyAgIGNoaWxkQ29udGV4dFR5cGVzOlxuIyAgICAgbXVpVGhlbWU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcblxuIyAgIGdldENoaWxkQ29udGV4dDogKCkgLT5cbiMgICAgIG11aVRoZW1lOiBUaGVtZU1hbmFnZXIuZ2V0Q3VycmVudFRoZW1lKClcblxuIyAgIGNvbXBvbmVudFdpbGxNb3VudDogLT5cbiMgICAgIFRoZW1lTWFuYWdlci5zZXRQYWxldHRlXG4jICAgICAgIHByaW1hcnkxQ29sb3I6IENvbG9ycy5ncmVlbjQwMCxcbiMgICAgICAgcHJpbWFyeTJDb2xvcjogQ29sb3JzLmdyZWVuQTQwMCxcbiMgICAgICAgcHJpbWFyeTNDb2xvcjogQ29sb3JzLmdyZWVuQTIwMCxcbiMgICAgICAgYWNjZW50MUNvbG9yOiBDb2xvcnMuYmx1ZUdyZXk3MDAsXG4jICAgICAgIGFjY2VudDJDb2xvcjogQ29sb3JzLmJsdWVHcmV5NjAwLFxuIyAgICAgICBhY2NlbnQzQ29sb3I6IENvbG9ycy5ibHVlR3JleTgwMCxcbiMgICAgICAgdGV4dENvbG9yOiBDb2xvcnMuYmx1ZUdyZXk4MDAsXG4jICAgICAgIGNhbnZhc0NvbG9yOiBDb2xvcnMud2hpdGUsXG4jICAgICAgIGJvcmRlckNvbG9yOiBDb2xvcnMuZ3JleTMwMCxcbiMgICAgICAgZGlzYWJsZWRDb2xvcjogQ29sb3JzLmdyZXk0MDBcblxuIyAgIHJlbmRlcjogLT5cbiMgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFpblwiPlxuIyAgICAgICA8Um91dGVIYW5kbGVyIHsuLi50aGlzLnByb3BzfS8+XG4jICAgICA8L2Rpdj5cblxuXG4jIE5vdEZvdW5kID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiMgICByZW5kZXI6IC0+XG4jICAgICA8aDE+IDQwNCAtIE5vdCBGb3VuZCA8L2gxPlxuXG4jIHJvdXRlcyA9XG4jICAgPFJvdXRlIG5hbWU9XCJhcHBcIiBwYXRoPVwiL1wiIGhhbmRsZXI9e0FwcH0+XG4jICAgICA8Um91dGUgbmFtZT1cImNoYXRcIiBwYXRoPVwiY2hhdC86cm9vbUlkXCIgaGFuZGxlcj17Um9vbX0vPlxuIyAgICAgPERlZmF1bHRSb3V0ZSBoYW5kbGVyPXtEYXNoYm9hcmR9Lz5cbiMgICAgIDxSb3V0ZSBuYW1lPVwibG9naW5cIiBwYXRoPVwibG9naW5cIiBoYW5kbGVyPXtMb2dpbn0vPlxuIyAgICAgPFJvdXRlIG5hbWU9XCJzaWdudXBcIiBwYXRoPVwic2lnbnVwXCIgaGFuZGxlcj17TG9naW59Lz5cbiMgICAgIDxSb3V0ZSBuYW1lPVwic2lnbnVwU3VjY2Vzc1wiIHBhdGg9XCJzaWdudXBTdWNjZXNzXCIgaGFuZGxlcj17U2lnbnVwU3VjY2Vzc30gLz5cbiMgICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfSAvPlxuIyAgIDwvUm91dGU+XG5cbiMgUm91dGVyLnJ1biByb3V0ZXMsIChIYW5kbGVyLCBzdGF0ZSkgLT5cbiMgICBSZWFjdC5yZW5kZXIgPEhhbmRsZXIgey4uLnN0YXRlfS8+LCAkKFwiI21haW5cIikuZ2V0KDApXG4iXX0=
