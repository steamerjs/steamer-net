/**
 * steamer-net
 * github: https://github.com/SteamerTeam/steamer-net
 * npm: https://www.npmjs.com/package/steamer-net
 * version: 0.2.2
 * date: 2016.07.30
 */

var global = (typeof global !== "undefined") ? global : {};

if (typeof window !== "undefined") {
    global = window;
} 
else if (typeof self !== "undefined"){
    global = self;
}

// global config for whole plugin
var config = {
    dataReturnSuccessCondition: function() {
        return true;
    }
};

// readyState const
const DONE = 4;

// status code
const STATE_200 = 200;

// empty function
function emptyFunc() {}

function makeOpts(options) {

    let opts = {};
        opts.url = options.url,
        opts.paramObj = options.param || {},
        opts.successCb = options.success || emptyFunc,
        opts.errorCb = options.error || emptyFunc,
        opts.localData = options.localData || null,
        opts.xhrFields = options.xhrFields || {},
        opts.headers = options.headers || {};
        opts.method = options.ajaxType || 'GET';
        opts.method = opts.method.toUpperCase();
    return opts;
}


/**
 * create xhr
 * @return {Object} [xhr object]
 */
function createXHR() {

    var xhr = null;

    var XMLHttpFactories = [
        
        function () { return new XMLHttpRequest(); },
        function () { return new XDomainRequest(); },
        function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
        function () { return new ActiveXObject("Msxml3.xmlhttp"); },
        function () { return new ActiveXObject("Microsoft.XMLHTTP"); }

    ];

    for (var i = 0, len = XMLHttpFactories.length; i < len; i++) {
        try {
            xhr = XMLHttpFactories[i]();
        }
        catch (e) {
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
    let paramArray = [];

    for(let key in paramObj){
        paramArray.push(key + '=' + encodeURIComponent(paramObj[key]));
    }

    return  paramArray.join('&');
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

/**
 * set request headers
 * @param {Object} xhr 
 * @param {Object} headers 
 */
function makeHeaders(xhr, headers, method) {

    if (!xhr.setRequestHeader) {
        return;
    }

    if ((method === 'GET' || method === 'POST')) {
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    }

    let headers = headers || {};
    for (let key in headers) {
        if (headeres.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key]);
        }
    }
}

function makeXhrFields(xhr, xhrFields) {
    xhr.withCredentials = xhrFields.withCredentials || true;
}

export function ajaxInit(cf) {
    config.dataReturnSuccessCondition = cf.dataReturnSuccessCondition || config.dataReturnSuccessCondition;
}

export function ajaxGet(options) {
    let opts = makeOpts(options),
        paramString = makeParam(opts.paramObj),
        url = makeUrl(opts.url, paramString);

    var xhr = sendReq(opts);

    if (!xhr) {
        return;  
    } 

    xhr.open('GET', url, true);
    makeXhrFields(xhr, opts.xhrFields);
    // xhr.setRequestHeader && xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    makeHeaders(xhr, opts.headers, 'GET');
    xhr.send();
}

export function ajaxPost(options) {
    let opts = makeOpts(options),
        paramString = makeParam(opts.paramObj),
        url = opts.url;

    var xhr = sendReq(opts);

    if (!xhr) {
        return;  
    } 

    xhr.open('POST', url, true);
    makeXhrFields(xhr, opts.xhrFields);
    // xhr.setRequestHeader && xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    makeHeaders(xhr, opts.headers, 'POST');
    xhr.send(paramString);
}

function ajaxForm(options) {
    var opts = makeOpts(options),
        url = opts.url;

    var xhr = sendReq(opts);

    if (!xhr) {
        return;
    }

    xhr.open('POST', url, true);
    makeXhrFields(xhr, opts.xhrFields, 'FORM');
    xhr.send(opts.paramObj);
}

/**
 * jsonp
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function ajaxJsonp(options) {

    let opts = makeOpts(options);

    if (!opts.paramObj) {
        throw new Error("Please provide parameter for jsonp");
    }

    if (!opts.paramObj.jsonCbName) {
        opts.paramObj.jsonCbName = "jsonCb_" + Date.now();
    }

    opts.paramObj.callback = opts.paramObj.jsonCbName;
    delete opts.paramObj['jsonCbName'];

    global[opts.paramObj.callback] = function(data) {
        if (opts.localData) {
            onDataReturn(opts.localData, opts);
            return;
        }

        onDataReturn(data, opts);
        removeScript(script);
    };

    function removeScript(st) {
        setTimeout(function() {
            st.parentNode.removeChild(st);
            st = null;
        }, 200);
    }

    let paramString = makeParam(opts.paramObj),
        url = makeUrl(opts.url, paramString),
        script = (global && global.document) ? global.document.createElement("script") : {},
        head = (global && global.document) ? global.document.getElementsByTagName("head")[0] : {};
    
    script.src = url;
    head.appendChild(script);

    script.onerror = function(err) {
        opts.errorCb({errCode: err});
        removeScript(script);
    };
}

function onDataReturn(data, opts) {
    let isSuccess = config.dataReturnSuccessCondition(data);
    isSuccess ? opts.successCb(data) : opts.errorCb(data);
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

    xhr.onreadystatechange = function() {
        if (xhr.readyState === DONE) {
            if (xhr.status === STATE_200) {
                let data = JSON.parse(xhr.responseText);
                onDataReturn(data, opts);
            }
            else {
                opts.errorCb({
                    errCode: xhr.status
                });
            }
        }
    };

    xhr.onerror = function() {
        opts.errorCb({
            errCode: -1
        });
    };

    return xhr;
}

function ajax(options) {

    let opts = makeOpts(options);

    switch(opts.method) {
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

let net = {
    ajax,
    ajaxGet,
    ajaxPost,
    ajaxJsonp,  
    ajaxInit, 
};

export default net;
