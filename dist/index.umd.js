(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.index = global.index || {}, global.index.umd = global.index.umd || {}, global.index.umd.js = {})));
}(this, (function (exports) { 'use strict';

    /**
     * steamer-net
     * github: https://github.com/SteamerTeam/steamer-net
     * npm: https://www.npmjs.com/package/steamer-net
     */

    var global = typeof global !== 'undefined' ? global : {};

    if (typeof window !== 'undefined') {
        global = window;
    } else if (typeof self !== 'undefined') {
        global = self;
    }

    // global config for whole plugin
    var config = {
        dataReturnSuccessCondition: function dataReturnSuccessCondition() {
            return true;
        },
        beforeRequest: function beforeRequest(opts) {
            return opts;
        },
        beforeResponse: function beforeResponse(data, successCb, errorCb) {
            successCb(data);
        }
    };

    // readyState const
    var DONE = 4;

    // status code
    var STATE_200 = 200;

    // empty function
    function emptyFunc() {}

    function makeOpts(optParam) {

        var options = config.beforeRequest(optParam);
        var opts = {};
        opts.url = options.url;
        opts.paramObj = options.param || {};
        opts.successCb = options.success || emptyFunc;
        opts.errorCb = options.error || emptyFunc;
        opts.localData = options.localData || null;
        opts.xhrFields = options.xhrFields || {};
        opts.headers = options.headers || {};
        opts.method = options.ajaxType || 'GET';
        opts.dataType = options.dataType || 'json';
        opts.async = options.async;
        opts.timeout = options.timeout;
        opts.method = opts.method.toUpperCase();
        return opts;
    }

    /**
     * create xhr
     * @return {Object} [xhr object]
     */
    function createXHR() {

        var xhr = null;

        var XMLHttpFactories = [function () {
            return new XMLHttpRequest();
        }, function () {
            return new XDomainRequest();
        }, function () {
            return new ActiveXObject('Msxml2.XMLHTTP');
        }, function () {
            return new ActiveXObject('Msxml3.xmlhttp');
        }, function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }];

        for (var i = 0, len = XMLHttpFactories.length; i < len; i++) {
            try {
                xhr = XMLHttpFactories[i]();
            } catch (e) {
                continue;
            }
            break;
        }

        return xhr;
    }

    /**
     * make url/request param
     * @param  {Object} paramObj [param object passed by user]
     * @return {String}          [return param string]
     */
    function makeParam(paramObj) {
        var paramArray = [];

        for (var key in paramObj) {
            if (paramObj.hasOwnProperty(key)) {
                paramArray.push(key + '=' + encodeURIComponent(paramObj[key]));
            }
        }

        return paramArray.join('&');
    }

    /**
     * stringify url/request param
     * @param  {Object} paramObj [param object passed by user]
     * @return {String}          [return param json string]
     */
    function stringifyParam(paramObj) {
        var obj = {};
        for (var key in paramObj) {
            if (paramObj.hasOwnProperty(key)) {
                var value = paramObj[key];
                obj[key] = typeof value === 'string' ? encodeURIComponent(value) : value;
            }
        }

        return JSON.stringify(obj);
    }

    /**
     * make url with param
     * @param  {String} urlParam        [original url]
     * @param  {Array}  paramArray [param array]
     * @return {String}            [final url]
     */
    function makeUrl(urlParam, paramString) {
        var url = urlParam;
        url += (urlParam.indexOf('?') > 0 ? '&' : '?') + paramString;
        return url;
    }

    /**
     * set request headers
     * @param {Object} xhr
     * @param {Object} headers
     */
    function makeHeaders(xhr, headers, method) {

        if (!xhr.setRequestHeader) {
            return;
        }

        if (!headers['Content-type'] && (method === 'GET' || method === 'POST')) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }

        var hdrs = headers || {};
        for (var key in hdrs) {
            if (hdrs.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, hdrs[key]);
            }
        }
    }

    function makeXhrFields(xhr, xhrFields) {
        xhr.withCredentials = true;

        if (xhrFields.withCredentials === false) {
            xhr.withCredentials = false;
        }
    }

    function ajaxInit(cf) {
        config.dataReturnSuccessCondition = cf.dataReturnSuccessCondition || config.dataReturnSuccessCondition;
        config.beforeRequest = cf.beforeRequest || config.beforeRequest;
        config.beforeResponse = cf.beforeResponse || config.beforeResponse;
    }

    function ajaxGet(options) {
        var opts = makeOpts(options);
        var paramString = makeParam(opts.paramObj);
        var url = makeUrl(opts.url, paramString);

        var xhr = sendReq(opts);

        if (!xhr) {
            return;
        }

        xhr.open('GET', url, true);
        setXhrTimeout(xhr, opts); // IE11一定要在xhr.open之后设置timeout时间
        makeXhrFields(xhr, opts.xhrFields);
        makeHeaders(xhr, opts.headers, 'GET');
        xhr.send();
    }

    function ajaxPost(options) {
        var opts = makeOpts(options);
        var paramString = '';
        var url = opts.url;
        var xhr = sendReq(opts);

        if (!xhr) {
            return;
        }

        xhr.open('POST', url, true);

        // json格式
        if (options.type && options.type === 'json') {
            paramString = stringifyParam(opts.paramObj);
            opts.headers['Content-type'] = 'application/json';
        } else {
            paramString = makeParam(opts.paramObj);
        }
        setXhrTimeout(xhr, opts); // IE11一定要在xhr.open之后设置timeout时间
        makeXhrFields(xhr, opts.xhrFields);
        makeHeaders(xhr, opts.headers, 'POST');
        xhr.send(paramString);
    }

    function ajaxForm(options) {
        var opts = makeOpts(options);
        var url = opts.url;

        var xhr = sendReq(opts);

        if (!xhr) {
            return;
        }

        xhr.open('POST', url, true);
        setXhrTimeout(xhr, opts); // IE11一定要在xhr.open之后设置timeout时间
        makeXhrFields(xhr, opts.xhrFields);
        makeHeaders(xhr, opts.headers, 'FORM');
        xhr.send(opts.paramObj);
    }

    /**
     * jsonp
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function ajaxJsonp(options) {

        var opts = makeOpts(options);

        if (!opts.paramObj) {
            throw new Error('Please provide parameter for jsonp');
        }

        if (!opts.paramObj.jsonCbName) {
            opts.paramObj.jsonCbName = 'jsonCb_' + Date.now();
        }

        opts.paramObj.callback = opts.paramObj.jsonCbName;
        delete opts.paramObj['jsonCbName'];

        global[opts.paramObj.callback] = function (data) {
            if (opts.localData) {
                onDataReturn(opts.localData, opts);
                return;
            }

            onDataReturn(data, opts);
            removeScript(script);
        };

        function removeScript(st) {
            setTimeout(function () {
                st.parentNode.removeChild(st);
            }, 200);
        }

        var paramString = makeParam(opts.paramObj);
        var url = makeUrl(opts.url, paramString);
        var script = global && global.document ? global.document.createElement('script') : {};
        var head = global && global.document ? global.document.getElementsByTagName('head')[0] : {};

        script.src = url;
        head.appendChild(script);

        script.onerror = function (err) {
            opts.errorCb({ errCode: err });
            removeScript(script);
        };
    }

    function onDataReturn(data, opts) {
        config.beforeResponse(data, function (data) {
            var isSuccess = config.dataReturnSuccessCondition(data);
            isSuccess ? opts.successCb(data) : opts.errorCb(data);
        }, opts.errorCb);
    }

    function sendReq(opts) {
        var xhr = createXHR();

        if (!xhr) {
            throw new Error('XMLHttp is not defined');
        }

        // 如果本地已经从别的地方获取到数据，就不用请求了
        if (opts.localData) {
            onDataReturn(opts.localData, opts);
            return;
        }

        // 是否async
        xhr.async = opts.async === false ? false : true;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === DONE) {
                if (xhr.status === STATE_200) {
                    var data = xhr.responseText;
                    if (opts.dataType === 'json') {
                        data = JSON.parse(xhr.responseText);
                    }
                    onDataReturn(data, opts);
                } else {
                    opts.errorCb({
                        errCode: xhr.status
                    });
                }
            }
        };

        xhr.onerror = function () {
            opts.errorCb({
                errCode: -1
            });
        };

        xhr.ontimeout = function () {
            opts.errorCb({
                errCode: -2
            });
        };

        return xhr;
    }

    function setXhrTimeout(xhr, opts) {
        // 设置timeout
        if (opts.timeout) {
            xhr.timeout = opts.timeout;
        }
    }

    function ajax(options) {

        var opts = makeOpts(options);

        switch (opts.method) {
            case 'JSONP':
                ajaxJsonp(options);
                break;
            case 'GET':
                ajaxGet(options);
                break;
            case 'POST':
                ajaxPost(options);
                break;
            case 'FORM':
                ajaxForm(options);
                break;
        }
    }

    var net = {
        ajax: ajax,
        ajaxGet: ajaxGet,
        ajaxPost: ajaxPost,
        ajaxForm: ajaxForm,
        ajaxJsonp: ajaxJsonp,
        ajaxInit: ajaxInit
    };

    exports.ajaxInit = ajaxInit;
    exports.ajaxGet = ajaxGet;
    exports.ajaxJsonp = ajaxJsonp;
    exports.default = net;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
