!(function () {
  "use strict";
  !(function (t) {
    function e() {}
    function r(t, e) {
      return function () {
        t.apply(e, arguments);
      };
    }
    function n(t) {
      if ("object" != typeof this)
        throw new TypeError("Promises must be constructed via new");
      if ("function" != typeof t) throw new TypeError("not a function");
      (this._state = 0),
        (this._handled = !1),
        (this._value = void 0),
        (this._deferreds = []),
        f(t, this);
    }
    function o(t, e) {
      for (; 3 === t._state; ) t = t._value;
      0 !== t._state
        ? ((t._handled = !0),
          n._immediateFn(function () {
            var r = 1 === t._state ? e.onFulfilled : e.onRejected;
            if (null !== r) {
              var n;
              try {
                n = r(t._value);
              } catch (t) {
                return void s(e.promise, t);
              }
              i(e.promise, n);
            } else (1 === t._state ? i : s)(e.promise, t._value);
          }))
        : t._deferreds.push(e);
    }
    function i(t, e) {
      try {
        if (e === t)
          throw new TypeError("A promise cannot be resolved with itself.");
        if (e && ("object" == typeof e || "function" == typeof e)) {
          var o = e.then;
          if (e instanceof n) return (t._state = 3), (t._value = e), void a(t);
          if ("function" == typeof o) return void f(r(o, e), t);
        }
        (t._state = 1), (t._value = e), a(t);
      } catch (e) {
        s(t, e);
      }
    }
    function s(t, e) {
      (t._state = 2), (t._value = e), a(t);
    }
    function a(t) {
      2 === t._state &&
        0 === t._deferreds.length &&
        n._immediateFn(function () {
          t._handled || n._unhandledRejectionFn(t._value);
        });
      for (var e = 0, r = t._deferreds.length; e < r; e++)
        o(t, t._deferreds[e]);
      t._deferreds = null;
    }
    function u(t, e, r) {
      (this.onFulfilled = "function" == typeof t ? t : null),
        (this.onRejected = "function" == typeof e ? e : null),
        (this.promise = r);
    }
    function f(t, e) {
      var r = !1;
      try {
        t(
          function (t) {
            r || ((r = !0), i(e, t));
          },
          function (t) {
            r || ((r = !0), s(e, t));
          }
        );
      } catch (t) {
        if (r) return;
        (r = !0), s(e, t);
      }
    }
    var h = setTimeout;
    (n.prototype.catch = function (t) {
      return this.then(null, t);
    }),
      (n.prototype.then = function (t, r) {
        var n = new this.constructor(e);
        return o(this, new u(t, r, n)), n;
      }),
      (n.all = function (t) {
        var e = Array.prototype.slice.call(t);
        return new n(function (t, r) {
          function n(i, s) {
            try {
              if (s && ("object" == typeof s || "function" == typeof s)) {
                var a = s.then;
                if ("function" == typeof a)
                  return void a.call(
                    s,
                    function (t) {
                      n(i, t);
                    },
                    r
                  );
              }
              (e[i] = s), 0 == --o && t(e);
            } catch (t) {
              r(t);
            }
          }
          if (0 === e.length) return t([]);
          for (var o = e.length, i = 0; i < e.length; i++) n(i, e[i]);
        });
      }),
      (n.resolve = function (t) {
        return t && "object" == typeof t && t.constructor === n
          ? t
          : new n(function (e) {
              e(t);
            });
      }),
      (n.reject = function (t) {
        return new n(function (e, r) {
          r(t);
        });
      }),
      (n.race = function (t) {
        return new n(function (e, r) {
          for (var n = 0, o = t.length; n < o; n++) t[n].then(e, r);
        });
      }),
      (n._immediateFn =
        ("function" == typeof setImmediate &&
          function (t) {
            setImmediate(t);
          }) ||
        function (t) {
          h(t, 0);
        }),
      (n._unhandledRejectionFn = function (t) {
        "undefined" != typeof console &&
          console &&
          console.warn("Possible Unhandled Promise Rejection:", t);
      }),
      (n._setImmediateFn = function (t) {
        n._immediateFn = t;
      }),
      (n._setUnhandledRejectionFn = function (t) {
        n._unhandledRejectionFn = t;
      }),
      "undefined" != typeof module && module.exports
        ? (module.exports = n)
        : t.Promise || (t.Promise = n);
  })(window),
    (function (t) {
      function e(t) {
        if (
          ("string" != typeof t && (t = String(t)),
          /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))
        )
          throw new TypeError("Invalid character in header field name");
        return t.toLowerCase();
      }
      function r(t) {
        return "string" != typeof t && (t = String(t)), t;
      }
      function n(t) {
        var e = {
          next: function () {
            var e = t.shift();
            return { done: void 0 === e, value: e };
          },
        };
        return (
          m.iterable &&
            (e[Symbol.iterator] = function () {
              return e;
            }),
          e
        );
      }
      function o(t) {
        (this.map = {}),
          t instanceof o
            ? t.forEach(function (t, e) {
                this.append(e, t);
              }, this)
            : Array.isArray(t)
            ? t.forEach(function (t) {
                this.append(t[0], t[1]);
              }, this)
            : t &&
              Object.getOwnPropertyNames(t).forEach(function (e) {
                this.append(e, t[e]);
              }, this);
      }
      function i(t) {
        if (t.bodyUsed) return Promise.reject(new TypeError("Already read"));
        t.bodyUsed = !0;
      }
      function s(t) {
        return new Promise(function (e, r) {
          (t.onload = function () {
            e(t.result);
          }),
            (t.onerror = function () {
              r(t.error);
            });
        });
      }
      function a(t) {
        var e = new FileReader(),
          r = s(e);
        return e.readAsArrayBuffer(t), r;
      }
      function u(t) {
        var e = new FileReader(),
          r = s(e);
        return e.readAsText(t), r;
      }
      function f(t) {
        for (
          var e = new Uint8Array(t), r = new Array(e.length), n = 0;
          n < e.length;
          n++
        )
          r[n] = String.fromCharCode(e[n]);
        return r.join("");
      }
      function h(t) {
        if (t.slice) return t.slice(0);
        var e = new Uint8Array(t.byteLength);
        return e.set(new Uint8Array(t)), e.buffer;
      }
      function c() {
        return (
          (this.bodyUsed = !1),
          (this._initBody = function (t) {
            if (((this._bodyInit = t), t))
              if ("string" == typeof t) this._bodyText = t;
              else if (m.blob && Blob.prototype.isPrototypeOf(t))
                this._bodyBlob = t;
              else if (m.formData && FormData.prototype.isPrototypeOf(t))
                this._bodyFormData = t;
              else if (
                m.searchParams &&
                URLSearchParams.prototype.isPrototypeOf(t)
              )
                this._bodyText = t.toString();
              else if (m.arrayBuffer && m.blob && _(t))
                (this._bodyArrayBuffer = h(t.buffer)),
                  (this._bodyInit = new Blob([this._bodyArrayBuffer]));
              else {
                if (
                  !m.arrayBuffer ||
                  (!ArrayBuffer.prototype.isPrototypeOf(t) && !v(t))
                )
                  throw new Error("unsupported BodyInit type");
                this._bodyArrayBuffer = h(t);
              }
            else this._bodyText = "";
            this.headers.get("content-type") ||
              ("string" == typeof t
                ? this.headers.set("content-type", "text/plain;charset=UTF-8")
                : this._bodyBlob && this._bodyBlob.type
                ? this.headers.set("content-type", this._bodyBlob.type)
                : m.searchParams &&
                  URLSearchParams.prototype.isPrototypeOf(t) &&
                  this.headers.set(
                    "content-type",
                    "application/x-www-form-urlencoded;charset=UTF-8"
                  ));
          }),
          m.blob &&
            ((this.blob = function () {
              var t = i(this);
              if (t) return t;
              if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
              if (this._bodyArrayBuffer)
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              if (this._bodyFormData)
                throw new Error("could not read FormData body as blob");
              return Promise.resolve(new Blob([this._bodyText]));
            }),
            (this.arrayBuffer = function () {
              return this._bodyArrayBuffer
                ? i(this) || Promise.resolve(this._bodyArrayBuffer)
                : this.blob().then(a);
            })),
          (this.text = function () {
            var t = i(this);
            if (t) return t;
            if (this._bodyBlob) return u(this._bodyBlob);
            if (this._bodyArrayBuffer)
              return Promise.resolve(f(this._bodyArrayBuffer));
            if (this._bodyFormData)
              throw new Error("could not read FormData body as text");
            return Promise.resolve(this._bodyText);
          }),
          m.formData &&
            (this.formData = function () {
              return this.text().then(y);
            }),
          (this.json = function () {
            return this.text().then(JSON.parse);
          }),
          this
        );
      }
      function d(t) {
        var e = t.toUpperCase();
        return A.indexOf(e) > -1 ? e : t;
      }
      function l(t, e) {
        var r = (e = e || {}).body;
        if (t instanceof l) {
          if (t.bodyUsed) throw new TypeError("Already read");
          (this.url = t.url),
            (this.credentials = t.credentials),
            e.headers || (this.headers = new o(t.headers)),
            (this.method = t.method),
            (this.mode = t.mode),
            r || null == t._bodyInit || ((r = t._bodyInit), (t.bodyUsed = !0));
        } else this.url = String(t);
        if (
          ((this.credentials = e.credentials || this.credentials || "omit"),
          (!e.headers && this.headers) || (this.headers = new o(e.headers)),
          (this.method = d(e.method || this.method || "GET")),
          (this.mode = e.mode || this.mode || null),
          (this.referrer = null),
          ("GET" === this.method || "HEAD" === this.method) && r)
        )
          throw new TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(r);
      }
      function y(t) {
        var e = new FormData();
        return (
          t
            .trim()
            .split("&")
            .forEach(function (t) {
              if (t) {
                var r = t.split("="),
                  n = r.shift().replace(/\+/g, " "),
                  o = r.join("=").replace(/\+/g, " ");
                e.append(decodeURIComponent(n), decodeURIComponent(o));
              }
            }),
          e
        );
      }
      function p(t) {
        var e = new o();
        return (
          t.split(/\r?\n/).forEach(function (t) {
            var r = t.split(":"),
              n = r.shift().trim();
            if (n) {
              var o = r.join(":").trim();
              e.append(n, o);
            }
          }),
          e
        );
      }
      function b(t, e) {
        e || (e = {}),
          (this.type = "default"),
          (this.status = "status" in e ? e.status : 200),
          (this.ok = this.status >= 200 && this.status < 300),
          (this.statusText = "statusText" in e ? e.statusText : "OK"),
          (this.headers = new o(e.headers)),
          (this.url = e.url || ""),
          this._initBody(t);
      }
      if (!t.fetch) {
        var m = {
          searchParams: "URLSearchParams" in t,
          iterable: "Symbol" in t && "iterator" in Symbol,
          blob:
            "FileReader" in t &&
            "Blob" in t &&
            (function () {
              try {
                return new Blob(), !0;
              } catch (t) {
                return !1;
              }
            })(),
          formData: "FormData" in t,
          arrayBuffer: "ArrayBuffer" in t,
        };
        if (m.arrayBuffer)
          var w = [
              "[object Int8Array]",
              "[object Uint8Array]",
              "[object Uint8ClampedArray]",
              "[object Int16Array]",
              "[object Uint16Array]",
              "[object Int32Array]",
              "[object Uint32Array]",
              "[object Float32Array]",
              "[object Float64Array]",
            ],
            _ = function (t) {
              return t && DataView.prototype.isPrototypeOf(t);
            },
            v =
              ArrayBuffer.isView ||
              function (t) {
                return t && w.indexOf(Object.prototype.toString.call(t)) > -1;
              };
        (o.prototype.append = function (t, n) {
          (t = e(t)), (n = r(n));
          var o = this.map[t];
          this.map[t] = o ? o + "," + n : n;
        }),
          (o.prototype.delete = function (t) {
            delete this.map[e(t)];
          }),
          (o.prototype.get = function (t) {
            return (t = e(t)), this.has(t) ? this.map[t] : null;
          }),
          (o.prototype.has = function (t) {
            return this.map.hasOwnProperty(e(t));
          }),
          (o.prototype.set = function (t, n) {
            this.map[e(t)] = r(n);
          }),
          (o.prototype.forEach = function (t, e) {
            var r = this;
            for (var n in r.map)
              r.map.hasOwnProperty(n) && t.call(e, r.map[n], n, r);
          }),
          (o.prototype.keys = function () {
            var t = [];
            return (
              this.forEach(function (e, r) {
                t.push(r);
              }),
              n(t)
            );
          }),
          (o.prototype.values = function () {
            var t = [];
            return (
              this.forEach(function (e) {
                t.push(e);
              }),
              n(t)
            );
          }),
          (o.prototype.entries = function () {
            var t = [];
            return (
              this.forEach(function (e, r) {
                t.push([r, e]);
              }),
              n(t)
            );
          }),
          m.iterable && (o.prototype[Symbol.iterator] = o.prototype.entries);
        var A = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        (l.prototype.clone = function () {
          return new l(this, { body: this._bodyInit });
        }),
          c.call(l.prototype),
          c.call(b.prototype),
          (b.prototype.clone = function () {
            return new b(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new o(this.headers),
              url: this.url,
            });
          }),
          (b.error = function () {
            var t = new b(null, { status: 0, statusText: "" });
            return (t.type = "error"), t;
          });
        var B = [301, 302, 303, 307, 308];
        (b.redirect = function (t, e) {
          if (-1 === B.indexOf(e)) throw new RangeError("Invalid status code");
          return new b(null, { status: e, headers: { location: t } });
        }),
          (t.Headers = o),
          (t.Request = l),
          (t.Response = b),
          (t.fetch = function (t, e) {
            return new Promise(function (r, n) {
              var o = new l(t, e),
                i = new XMLHttpRequest();
              (i.onload = function () {
                var t = {
                  status: i.status,
                  statusText: i.statusText,
                  headers: p(i.getAllResponseHeaders() || ""),
                };
                t.url =
                  "responseURL" in i
                    ? i.responseURL
                    : t.headers.get("X-Request-URL");
                var e = "response" in i ? i.response : i.responseText;
                r(new b(e, t));
              }),
                (i.onerror = function () {
                  n(new TypeError("Network request failed"));
                }),
                (i.ontimeout = function () {
                  n(new TypeError("Network request failed"));
                }),
                i.open(o.method, o.url, !0),
                "include" === o.credentials && (i.withCredentials = !0),
                "responseType" in i && m.blob && (i.responseType = "blob"),
                o.headers.forEach(function (t, e) {
                  i.setRequestHeader(e, t);
                }),
                i.send(void 0 === o._bodyInit ? null : o._bodyInit);
            });
          }),
          (t.fetch.polyfill = !0);
      }
    })("undefined" != typeof self ? self : window);
})();
