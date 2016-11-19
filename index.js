"use strict";

exports.__esModule = true;
exports.ajaxInit = ajaxInit;
exports.ajaxGet = ajaxGet;
exports.ajaxPost = ajaxPost;
exports.ajaxJsonp = ajaxJsonp;
/**
 * steamer-net
 * github: https://github.com/SteamerTeam/steamer-net
 * npm: https://www.npmjs.com/package/steamer-net
 * version: 0.2.2
 * date: 2016.07.30
 */

// global config for whole plugin
var config = {
    dataReturnSuccessCondition: function dataReturnSuccessCondition() {
        return true;
    }
};

// readyState const
var DONE = 4;

// status code
var STATE_200 = 200;

// empty function
function emptyFunc() {};

function makeOpts(options) {

    var opts = {};
    opts.url = options.url, opts.paramObj = options.param || {}, opts.successCb = options.success || emptyFunc, opts.errorCb = options.error || emptyFunc, opts.method = options.ajaxType || 'GET';
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
        return new ActiveXObject("Msxml2.XMLHTTP");
    }, function () {
        return new ActiveXObject("Msxml3.xmlhttp");
    }, function () {
        return new ActiveXObject("Microsoft.XMLHTTP");
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
    var paramArray = [],
        paramString = '';

    for (var key in paramObj) {
        paramArray.push(key + '=' + encodeURIComponent(paramObj[key]));
    }

    return paramArray.join('&');
}

/**
 * make url with param
 * @param  {String} url        [original url]
 * @param  {Array}  paramArray [param array]
 * @return {String}            [final url]
 */
function makeUrl(url, paramString) {
    url += (!!~url.indexOf('?') ? '&' : '?') + paramString;
    return url;
}

function ajaxInit(cf) {
    config.dataReturnSuccessCondition = cf.dataReturnSuccessCondition || config.dataReturnSuccessCondition;
}

function ajaxGet(xhr, options) {
    var opts = makeOpts(options),
        paramString = makeParam(opts.paramObj),
        url = makeUrl(opts.url, opts.paramString);

    xhr.open(opts.method, url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader && xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function ajaxPost(xhr, options) {
    var opts = makeOpts(options),
        paramString = makeParam(opts.paramObj),
        url = opts.url;

    xhr.open(opts.method, url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader && xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(paramString);
}

/**
 * jsonp
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function ajaxJsonp(options) {

    var opts = makeOpts(options);

    if (!opts.paramObj || !opts.paramObj.jsonCbName) {
        throw new Error("Please provide a callback function name for jsonp");
    }

    opts.paramObj.callback = opts.paramObj.jsonCbName;
    delete opts.paramObj['jsonCbName'];

    window[opts.paramObj.callback] = function (data) {
        onDataReturn(data, opts);
        removeScript(script);
    };

    function removeScript(st) {
        setTimeout(function () {
            st.parentNode.removeChild(st);
            st = null;
        }, 200);
    }

    var paramString = makeParam(opts.paramObj),
        url = makeUrl(opts.url, paramString),
        script = document.createElement("script"),
        head = document.getElementsByTagName("head")[0];

    script.src = url;
    head.appendChild(script);

    script.onerror = function (err) {
        opts.errorCb({ errCode: err });
        removeScript(script);
    };
}

function onDataReturn(data, opts) {
    var isSuccess = config.dataReturnSuccessCondition(data);
    isSuccess ? opts.successCb(data) : opts.errorCb(data);
}

function ajax(options) {

    var xhr = createXHR();

    var opts = makeOpts(options);

    // 如果本地已经从别的地方获取到数据，就不用请求了
    if (opts.localData) {
        onDataReturn(opts.localData, opts);
        return;
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === DONE) {
            if (xhr.status === STATE_200) {
                var data = JSON.parse(xhr.responseText);
                onDataReturn(data, opts);
            } else {
                opts.errorCb({
                    errCode: xhr.status
                });
            }
        }
    };

    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        onDataReturn(data, opts);
    };

    xhr.onerror = function () {
        opts.errorCb({
            errCode: -1
        });
    };

    switch (opts.method) {
        case 'JSONP':
            ajaxJsonp(options);
            break;
        case 'GET':
            ajaxGet(xhr, options);
            break;
        case 'POST':
            ajaxPost(xhr, options);
            break;
    }
}

var net = {
    ajax: ajax,
    ajaxGet: ajaxGet,
    ajaxPost: ajaxPost,
    ajaxJsonp: ajaxJsonp,
    ajaxInit: ajaxInit
};

exports.default = net;