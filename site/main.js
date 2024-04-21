/*
 * anime.js v3.0.1
 * (c) 2019 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

!function(n, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : n.anime = e()
}(this, function() {
    "use strict";
    var n = {
        update: null,
        begin: null,
        loopBegin: null,
        changeBegin: null,
        change: null,
        changeComplete: null,
        loopComplete: null,
        complete: null,
        loop: 1,
        direction: "normal",
        autoplay: !0,
        timelineOffset: 0
    }
      , e = {
        duration: 1e3,
        delay: 0,
        endDelay: 0,
        easing: "easeOutElastic(1, .5)",
        round: 0
    }
      , r = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective"]
      , t = {
        CSS: {},
        springs: {}
    };
    function a(n, e, r) {
        return Math.min(Math.max(n, e), r)
    }
    function o(n, e) {
        return n.indexOf(e) > -1
    }
    function i(n, e) {
        return n.apply(null, e)
    }
    var u = {
        arr: function(n) {
            return Array.isArray(n)
        },
        obj: function(n) {
            return o(Object.prototype.toString.call(n), "Object")
        },
        pth: function(n) {
            return u.obj(n) && n.hasOwnProperty("totalLength")
        },
        svg: function(n) {
            return n instanceof SVGElement
        },
        inp: function(n) {
            return n instanceof HTMLInputElement
        },
        dom: function(n) {
            return n.nodeType || u.svg(n)
        },
        str: function(n) {
            return "string" == typeof n
        },
        fnc: function(n) {
            return "function" == typeof n
        },
        und: function(n) {
            return void 0 === n
        },
        hex: function(n) {
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(n)
        },
        rgb: function(n) {
            return /^rgb/.test(n)
        },
        hsl: function(n) {
            return /^hsl/.test(n)
        },
        col: function(n) {
            return u.hex(n) || u.rgb(n) || u.hsl(n)
        },
        key: function(r) {
            return !n.hasOwnProperty(r) && !e.hasOwnProperty(r) && "targets" !== r && "keyframes" !== r
        }
    };
    function s(n) {
        var e = /\(([^)]+)\)/.exec(n);
        return e ? e[1].split(",").map(function(n) {
            return parseFloat(n)
        }) : []
    }
    function c(n, e) {
        var r = s(n)
          , o = a(u.und(r[0]) ? 1 : r[0], .1, 100)
          , i = a(u.und(r[1]) ? 100 : r[1], .1, 100)
          , c = a(u.und(r[2]) ? 10 : r[2], .1, 100)
          , f = a(u.und(r[3]) ? 0 : r[3], .1, 100)
          , l = Math.sqrt(i / o)
          , d = c / (2 * Math.sqrt(i * o))
          , p = d < 1 ? l * Math.sqrt(1 - d * d) : 0
          , v = 1
          , h = d < 1 ? (d * l - f) / p : -f + l;
        function g(n) {
            var r = e ? e * n / 1e3 : n;
            return r = d < 1 ? Math.exp(-r * d * l) * (v * Math.cos(p * r) + h * Math.sin(p * r)) : (v + h * r) * Math.exp(-r * l),
            0 === n || 1 === n ? n : 1 - r
        }
        return e ? g : function() {
            var e = t.springs[n];
            if (e)
                return e;
            for (var r = 0, a = 0; ; )
                if (1 === g(r += 1 / 6)) {
                    if (++a >= 16)
                        break
                } else
                    a = 0;
            var o = r * (1 / 6) * 1e3;
            return t.springs[n] = o,
            o
        }
    }
    function f(n, e) {
        void 0 === n && (n = 1),
        void 0 === e && (e = .5);
        var r = a(n, 1, 10)
          , t = a(e, .1, 2);
        return function(n) {
            return 0 === n || 1 === n ? n : -r * Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1 - t / (2 * Math.PI) * Math.asin(1 / r)) * (2 * Math.PI) / t)
        }
    }
    function l(n) {
        return void 0 === n && (n = 10),
        function(e) {
            return Math.round(e * n) * (1 / n)
        }
    }
    var d = function() {
        var n = 11
          , e = 1 / (n - 1);
        function r(n, e) {
            return 1 - 3 * e + 3 * n
        }
        function t(n, e) {
            return 3 * e - 6 * n
        }
        function a(n) {
            return 3 * n
        }
        function o(n, e, o) {
            return ((r(e, o) * n + t(e, o)) * n + a(e)) * n
        }
        function i(n, e, o) {
            return 3 * r(e, o) * n * n + 2 * t(e, o) * n + a(e)
        }
        return function(r, t, a, u) {
            if (0 <= r && r <= 1 && 0 <= a && a <= 1) {
                var s = new Float32Array(n);
                if (r !== t || a !== u)
                    for (var c = 0; c < n; ++c)
                        s[c] = o(c * e, r, a);
                return function(n) {
                    return r === t && a === u ? n : 0 === n || 1 === n ? n : o(f(n), t, u)
                }
            }
            function f(t) {
                for (var u = 0, c = 1, f = n - 1; c !== f && s[c] <= t; ++c)
                    u += e;
                var l = u + (t - s[--c]) / (s[c + 1] - s[c]) * e
                  , d = i(l, r, a);
                return d >= .001 ? function(n, e, r, t) {
                    for (var a = 0; a < 4; ++a) {
                        var u = i(e, r, t);
                        if (0 === u)
                            return e;
                        e -= (o(e, r, t) - n) / u
                    }
                    return e
                }(t, l, r, a) : 0 === d ? l : function(n, e, r, t, a) {
                    for (var i, u, s = 0; (i = o(u = e + (r - e) / 2, t, a) - n) > 0 ? r = u : e = u,
                    Math.abs(i) > 1e-7 && ++s < 10; )
                        ;
                    return u
                }(t, u, u + e, r, a)
            }
        }
    }()
      , p = function() {
        var n = ["Quad", "Cubic", "Quart", "Quint", "Sine", "Expo", "Circ", "Back", "Elastic"]
          , e = {
            In: [[.55, .085, .68, .53], [.55, .055, .675, .19], [.895, .03, .685, .22], [.755, .05, .855, .06], [.47, 0, .745, .715], [.95, .05, .795, .035], [.6, .04, .98, .335], [.6, -.28, .735, .045], f],
            Out: [[.25, .46, .45, .94], [.215, .61, .355, 1], [.165, .84, .44, 1], [.23, 1, .32, 1], [.39, .575, .565, 1], [.19, 1, .22, 1], [.075, .82, .165, 1], [.175, .885, .32, 1.275], function(n, e) {
                return function(r) {
                    return 1 - f(n, e)(1 - r)
                }
            }
            ],
            InOut: [[.455, .03, .515, .955], [.645, .045, .355, 1], [.77, 0, .175, 1], [.86, 0, .07, 1], [.445, .05, .55, .95], [1, 0, 0, 1], [.785, .135, .15, .86], [.68, -.55, .265, 1.55], function(n, e) {
                return function(r) {
                    return r < .5 ? f(n, e)(2 * r) / 2 : 1 - f(n, e)(-2 * r + 2) / 2
                }
            }
            ]
        }
          , r = {
            linear: [.25, .25, .75, .75]
        }
          , t = function(t) {
            e[t].forEach(function(e, a) {
                r["ease" + t + n[a]] = e
            })
        };
        for (var a in e)
            t(a);
        return r
    }();
    function v(n, e) {
        if (u.fnc(n))
            return n;
        var r = n.split("(")[0]
          , t = p[r]
          , a = s(n);
        switch (r) {
        case "spring":
            return c(n, e);
        case "cubicBezier":
            return i(d, a);
        case "steps":
            return i(l, a);
        default:
            return u.fnc(t) ? i(t, a) : i(d, t)
        }
    }
    function h(n) {
        try {
            return document.querySelectorAll(n)
        } catch (n) {
            return
        }
    }
    function g(n, e) {
        for (var r = n.length, t = arguments.length >= 2 ? arguments[1] : void 0, a = [], o = 0; o < r; o++)
            if (o in n) {
                var i = n[o];
                e.call(t, i, o, n) && a.push(i)
            }
        return a
    }
    function m(n) {
        return n.reduce(function(n, e) {
            return n.concat(u.arr(e) ? m(e) : e)
        }, [])
    }
    function y(n) {
        return u.arr(n) ? n : (u.str(n) && (n = h(n) || n),
        n instanceof NodeList || n instanceof HTMLCollection ? [].slice.call(n) : [n])
    }
    function b(n, e) {
        return n.some(function(n) {
            return n === e
        })
    }
    function x(n) {
        var e = {};
        for (var r in n)
            e[r] = n[r];
        return e
    }
    function M(n, e) {
        var r = x(n);
        for (var t in n)
            r[t] = e.hasOwnProperty(t) ? e[t] : n[t];
        return r
    }
    function w(n, e) {
        var r = x(n);
        for (var t in e)
            r[t] = u.und(n[t]) ? e[t] : n[t];
        return r
    }
    function k(n) {
        return u.rgb(n) ? (r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e = n)) ? "rgba(" + r[1] + ",1)" : e : u.hex(n) ? (t = n.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(n, e, r, t) {
            return e + e + r + r + t + t
        }),
        a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t),
        "rgba(" + parseInt(a[1], 16) + "," + parseInt(a[2], 16) + "," + parseInt(a[3], 16) + ",1)") : u.hsl(n) ? function(n) {
            var e, r, t, a = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(n) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(n), o = parseInt(a[1], 10) / 360, i = parseInt(a[2], 10) / 100, u = parseInt(a[3], 10) / 100, s = a[4] || 1;
            function c(n, e, r) {
                return r < 0 && (r += 1),
                r > 1 && (r -= 1),
                r < 1 / 6 ? n + 6 * (e - n) * r : r < .5 ? e : r < 2 / 3 ? n + (e - n) * (2 / 3 - r) * 6 : n
            }
            if (0 == i)
                e = r = t = u;
            else {
                var f = u < .5 ? u * (1 + i) : u + i - u * i
                  , l = 2 * u - f;
                e = c(l, f, o + 1 / 3),
                r = c(l, f, o),
                t = c(l, f, o - 1 / 3)
            }
            return "rgba(" + 255 * e + "," + 255 * r + "," + 255 * t + "," + s + ")"
        }(n) : void 0;
        var e, r, t, a
    }
    function C(n) {
        var e = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(n);
        if (e)
            return e[2]
    }
    function O(n, e) {
        return u.fnc(n) ? n(e.target, e.id, e.total) : n
    }
    function P(n, e) {
        return n.getAttribute(e)
    }
    function I(n, e, r) {
        if (b([r, "deg", "rad", "turn"], C(e)))
            return e;
        var a = t.CSS[e + r];
        if (!u.und(a))
            return a;
        var o = document.createElement(n.tagName)
          , i = n.parentNode && n.parentNode !== document ? n.parentNode : document.body;
        i.appendChild(o),
        o.style.position = "absolute",
        o.style.width = 100 + r;
        var s = 100 / o.offsetWidth;
        i.removeChild(o);
        var c = s * parseFloat(e);
        return t.CSS[e + r] = c,
        c
    }
    function B(n, e, r) {
        if (e in n.style) {
            var t = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
              , a = n.style[e] || getComputedStyle(n).getPropertyValue(t) || "0";
            return r ? I(n, a, r) : a
        }
    }
    function D(n, e) {
        return u.dom(n) && !u.inp(n) && (P(n, e) || u.svg(n) && n[e]) ? "attribute" : u.dom(n) && b(r, e) ? "transform" : u.dom(n) && "transform" !== e && B(n, e) ? "css" : null != n[e] ? "object" : void 0
    }
    function T(n) {
        if (u.dom(n)) {
            for (var e, r = n.style.transform || "", t = /(\w+)\(([^)]*)\)/g, a = new Map; e = t.exec(r); )
                a.set(e[1], e[2]);
            return a
        }
    }
    function F(n, e, r, t) {
        var a, i = o(e, "scale") ? 1 : 0 + (o(a = e, "translate") || "perspective" === a ? "px" : o(a, "rotate") || o(a, "skew") ? "deg" : void 0), u = T(n).get(e) || i;
        return r && (r.transforms.list.set(e, u),
        r.transforms.last = e),
        t ? I(n, u, t) : u
    }
    function N(n, e, r, t) {
        switch (D(n, e)) {
        case "transform":
            return F(n, e, t, r);
        case "css":
            return B(n, e, r);
        case "attribute":
            return P(n, e);
        default:
            return n[e] || 0
        }
    }
    function A(n, e) {
        var r = /^(\*=|\+=|-=)/.exec(n);
        if (!r)
            return n;
        var t = C(n) || 0
          , a = parseFloat(e)
          , o = parseFloat(n.replace(r[0], ""));
        switch (r[0][0]) {
        case "+":
            return a + o + t;
        case "-":
            return a - o + t;
        case "*":
            return a * o + t
        }
    }
    function E(n, e) {
        if (u.col(n))
            return k(n);
        var r = C(n)
          , t = r ? n.substr(0, n.length - r.length) : n;
        return e && !/\s/g.test(n) ? t + e : t
    }
    function L(n, e) {
        return Math.sqrt(Math.pow(e.x - n.x, 2) + Math.pow(e.y - n.y, 2))
    }
    function S(n) {
        for (var e, r = n.points, t = 0, a = 0; a < r.numberOfItems; a++) {
            var o = r.getItem(a);
            a > 0 && (t += L(e, o)),
            e = o
        }
        return t
    }
    function j(n) {
        if (n.getTotalLength)
            return n.getTotalLength();
        switch (n.tagName.toLowerCase()) {
        case "circle":
            return o = n,
            2 * Math.PI * P(o, "r");
        case "rect":
            return 2 * P(a = n, "width") + 2 * P(a, "height");
        case "line":
            return L({
                x: P(t = n, "x1"),
                y: P(t, "y1")
            }, {
                x: P(t, "x2"),
                y: P(t, "y2")
            });
        case "polyline":
            return S(n);
        case "polygon":
            return r = (e = n).points,
            S(e) + L(r.getItem(r.numberOfItems - 1), r.getItem(0))
        }
        var e, r, t, a, o
    }
    function q(n, e) {
        var r = e || {}
          , t = r.el || function(n) {
            for (var e = n.parentNode; u.svg(e) && (e = e.parentNode,
            u.svg(e.parentNode)); )
                ;
            return e
        }(n)
          , a = t.getBoundingClientRect()
          , o = P(t, "viewBox")
          , i = a.width
          , s = a.height
          , c = r.viewBox || (o ? o.split(" ") : [0, 0, i, s]);
        return {
            el: t,
            viewBox: c,
            x: c[0] / 1,
            y: c[1] / 1,
            w: i / c[2],
            h: s / c[3]
        }
    }
    function $(n, e) {
        function r(r) {
            void 0 === r && (r = 0);
            var t = e + r >= 1 ? e + r : 0;
            return n.el.getPointAtLength(t)
        }
        var t = q(n.el, n.svg)
          , a = r()
          , o = r(-1)
          , i = r(1);
        switch (n.property) {
        case "x":
            return (a.x - t.x) * t.w;
        case "y":
            return (a.y - t.y) * t.h;
        case "angle":
            return 180 * Math.atan2(i.y - o.y, i.x - o.x) / Math.PI
        }
    }
    function X(n, e) {
        var r = /-?\d*\.?\d+/g
          , t = E(u.pth(n) ? n.totalLength : n, e) + "";
        return {
            original: t,
            numbers: t.match(r) ? t.match(r).map(Number) : [0],
            strings: u.str(n) || e ? t.split(r) : []
        }
    }
    function Y(n) {
        return g(n ? m(u.arr(n) ? n.map(y) : y(n)) : [], function(n, e, r) {
            return r.indexOf(n) === e
        })
    }
    function Z(n) {
        var e = Y(n);
        return e.map(function(n, r) {
            return {
                target: n,
                id: r,
                total: e.length,
                transforms: {
                    list: T(n)
                }
            }
        })
    }
    function Q(n, e) {
        var r = x(e);
        if (/^spring/.test(r.easing) && (r.duration = c(r.easing)),
        u.arr(n)) {
            var t = n.length;
            2 === t && !u.obj(n[0]) ? n = {
                value: n
            } : u.fnc(e.duration) || (r.duration = e.duration / t)
        }
        var a = u.arr(n) ? n : [n];
        return a.map(function(n, r) {
            var t = u.obj(n) && !u.pth(n) ? n : {
                value: n
            };
            return u.und(t.delay) && (t.delay = r ? 0 : e.delay),
            u.und(t.endDelay) && (t.endDelay = r === a.length - 1 ? e.endDelay : 0),
            t
        }).map(function(n) {
            return w(n, r)
        })
    }
    function V(n, e) {
        var r = []
          , t = e.keyframes;
        for (var a in t && (e = w(function(n) {
            for (var e = g(m(n.map(function(n) {
                return Object.keys(n)
            })), function(n) {
                return u.key(n)
            }).reduce(function(n, e) {
                return n.indexOf(e) < 0 && n.push(e),
                n
            }, []), r = {}, t = function(t) {
                var a = e[t];
                r[a] = n.map(function(n) {
                    var e = {};
                    for (var r in n)
                        u.key(r) ? r == a && (e.value = n[r]) : e[r] = n[r];
                    return e
                })
            }, a = 0; a < e.length; a++)
                t(a);
            return r
        }(t), e)),
        e)
            u.key(a) && r.push({
                name: a,
                tweens: Q(e[a], n)
            });
        return r
    }
    function z(n, e) {
        var r;
        return n.tweens.map(function(t) {
            var a = function(n, e) {
                var r = {};
                for (var t in n) {
                    var a = O(n[t], e);
                    u.arr(a) && 1 === (a = a.map(function(n) {
                        return O(n, e)
                    })).length && (a = a[0]),
                    r[t] = a
                }
                return r.duration = parseFloat(r.duration),
                r.delay = parseFloat(r.delay),
                r
            }(t, e)
              , o = a.value
              , i = u.arr(o) ? o[1] : o
              , s = C(i)
              , c = N(e.target, n.name, s, e)
              , f = r ? r.to.original : c
              , l = u.arr(o) ? o[0] : f
              , d = C(l) || C(c)
              , p = s || d;
            return u.und(i) && (i = f),
            a.from = X(l, p),
            a.to = X(A(i, l), p),
            a.start = r ? r.end : 0,
            a.end = a.start + a.delay + a.duration + a.endDelay,
            a.easing = v(a.easing, a.duration),
            a.isPath = u.pth(o),
            a.isColor = u.col(a.from.original),
            a.isColor && (a.round = 1),
            r = a,
            a
        })
    }
    var H = {
        css: function(n, e, r) {
            return n.style[e] = r
        },
        attribute: function(n, e, r) {
            return n.setAttribute(e, r)
        },
        object: function(n, e, r) {
            return n[e] = r
        },
        transform: function(n, e, r, t, a) {
            if (t.list.set(e, r),
            e === t.last || a) {
                var o = "";
                t.list.forEach(function(n, e) {
                    o += e + "(" + n + ") "
                }),
                n.style.transform = o
            }
        }
    };
    function G(n, e) {
        Z(n).forEach(function(n) {
            for (var r in e) {
                var t = O(e[r], n)
                  , a = n.target
                  , o = C(t)
                  , i = N(a, r, o, n)
                  , u = A(E(t, o || C(i)), i)
                  , s = D(a, r);
                H[s](a, r, u, n.transforms, !0)
            }
        })
    }
    function R(n, e) {
        return g(m(n.map(function(n) {
            return e.map(function(e) {
                return function(n, e) {
                    var r = D(n.target, e.name);
                    if (r) {
                        var t = z(e, n)
                          , a = t[t.length - 1];
                        return {
                            type: r,
                            property: e.name,
                            animatable: n,
                            tweens: t,
                            duration: a.end,
                            delay: t[0].delay,
                            endDelay: a.endDelay
                        }
                    }
                }(n, e)
            })
        })), function(n) {
            return !u.und(n)
        })
    }
    function W(n, e) {
        var r = n.length
          , t = function(n) {
            return n.timelineOffset ? n.timelineOffset : 0
        }
          , a = {};
        return a.duration = r ? Math.max.apply(Math, n.map(function(n) {
            return t(n) + n.duration
        })) : e.duration,
        a.delay = r ? Math.min.apply(Math, n.map(function(n) {
            return t(n) + n.delay
        })) : e.delay,
        a.endDelay = r ? a.duration - Math.max.apply(Math, n.map(function(n) {
            return t(n) + n.duration - n.endDelay
        })) : e.endDelay,
        a
    }
    var J = 0;
    var K, U = [], _ = [], nn = function() {
        function n() {
            K = requestAnimationFrame(e)
        }
        function e(e) {
            var r = U.length;
            if (r) {
                for (var t = 0; t < r; ) {
                    var a = U[t];
                    if (a.paused) {
                        var o = U.indexOf(a);
                        o > -1 && (U.splice(o, 1),
                        r = U.length)
                    } else
                        a.tick(e);
                    t++
                }
                n()
            } else
                K = cancelAnimationFrame(K)
        }
        return n
    }();
    function en(r) {
        void 0 === r && (r = {});
        var t, o = 0, i = 0, u = 0, s = 0, c = null;
        function f(n) {
            var e = window.Promise && new Promise(function(n) {
                return c = n
            }
            );
            return n.finished = e,
            e
        }
        var l, d, p, v, h, m, y, b, x = (d = M(n, l = r),
        p = M(e, l),
        v = V(p, l),
        h = Z(l.targets),
        m = R(h, v),
        y = W(m, p),
        b = J,
        J++,
        w(d, {
            id: b,
            children: [],
            animatables: h,
            animations: m,
            duration: y.duration,
            delay: y.delay,
            endDelay: y.endDelay
        }));
        f(x);
        function k() {
            var n = x.direction;
            "alternate" !== n && (x.direction = "normal" !== n ? "normal" : "reverse"),
            x.reversed = !x.reversed,
            t.forEach(function(n) {
                return n.reversed = x.reversed
            })
        }
        function C(n) {
            return x.reversed ? x.duration - n : n
        }
        function O() {
            o = 0,
            i = C(x.currentTime) * (1 / en.speed)
        }
        function P(n, e) {
            e && e.seek(n - e.timelineOffset)
        }
        function I(n) {
            for (var e = 0, r = x.animations, t = r.length; e < t; ) {
                var o = r[e]
                  , i = o.animatable
                  , u = o.tweens
                  , s = u.length - 1
                  , c = u[s];
                s && (c = g(u, function(e) {
                    return n < e.end
                })[0] || c);
                for (var f = a(n - c.start - c.delay, 0, c.duration) / c.duration, l = isNaN(f) ? 1 : c.easing(f), d = c.to.strings, p = c.round, v = [], h = c.to.numbers.length, m = void 0, y = 0; y < h; y++) {