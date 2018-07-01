## steamer-net
[![NPM Version](https://img.shields.io/npm/v/steamer-net.svg?style=flat)](https://www.npmjs.com/package/steamer-net)
[![Travis](https://img.shields.io/travis/steamerjs/steamer-net.svg)](https://travis-ci.org/steamerjs/steamer-net)
[![Deps](https://david-dm.org/steamerjs/steamer-net.svg)](https://david-dm.org/steamerjs/steamer-net)
[![Coverage](https://img.shields.io/coveralls/steamerjs/steamer-net.svg)](https://coveralls.io/github/steamerjs/steamer-net)

ajax util for development

## Options
* url
	- [String] request url
* param
	- [Object]
	- jsonCbName [String] necessary if ajaxType is `JSONP`
* success
	- [Function] success callback
* error
	- [Function] error callback
    - errCode: `-1` => `xhr.onerror`, `-2` => `xhr.ontimeout`
* timeout
    - [Integer] timeout (unit: ms)
* ajaxType
	- [String] ajax type
    - default `GET`
	- `POST` | `GET` | `JSONP` | `FORM`
* dataType
    - [String] returned data type
    - default `json`
    - `json` | `text` |
* xhrFields
    - [Object]
    - {
        withCredentials: `true` or `false`
    }
* headers
    - [Object] request headers
    - {
        'Access-Control-Allow-Origin': '*'
    }


## Functions
* net.ajaxInit
```
net.ajaxInit({
    beforeRequest: function(opts)　{
        opts.param.xsrf = 'xsrf';
        return opts;
    },
    beforeResponse: function(data, successCb, errorCb) {
        data.foo = 'bar';
        successCb(data);
    },
    dataReturnSuccessCondition: function(data) {
        return !data.errCode;
    },
});
```
> `dataReturnSuccessCondition` will invoked after `beforeResponse`

* net.ajax
```
net.ajax({
    url: baseUrl + "get_material_info.fcg",
    param: {
    	id: 1
    },
    ajaxType: 'POST',
    success: function(data){
       	// some code
    },
    error: function(xhr){
    	// some code
    }
});
```

* net.ajaxGet
```
net.ajaxGet({
    url: baseUrl + "get_material_info.fcg",
    param: {
    	id: 1
    },
    success: function(data){
       	// some code
    },
    error: function(xhr){
    	// some code
    }
});
```

* net.ajaxPost
```
net.ajaxPost({
    url: baseUrl + "get_material_info.fcg",
    param: {
    	id: 1
    },
    success: function(data){
       	// some code
    },
    error: function(xhr){
    	// some code
    }
})
```
* net.ajaxJsonp
```
net.ajaxJsonp({
    url: baseUrl + "get_material_info.fcg",
    param: {
    	id: 1,
    	jsonCbName: "jsonpCb"
    },
    success: function(data){
       	// some code
    },
    error: function(xhr){
    	// some code
    }
})
```

## Local data
If you would like to use local data, you can specify `localData` param.

```
net.ajaxPost({
    url: baseUrl + "get_material_info.fcg",
    param: {
        id: 1
    },
    localData: [{id: 1, name: "a"}],
    success: function(data){
        // some code
    },
    error: function(xhr){
        // some code
    }
})
```

### Test
```
npm run test
````
