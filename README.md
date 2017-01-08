## steamer-net
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
* ajaxType
	- [String] ajax type
	- `POST` | `GET` | `JSONP`


## Functions
* net.ajaxInit
```
net.ajaxInit({
	dataReturnSuccessCondition: function(data) {
        return !data.errCode;
    }
});
```

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
`index.html` is the test file. Use `fiddler` or `charles` to set up a proxy for tesing in order to skip cross origin issues:

```
// example
http://localhost:8081/*  /project/spec
http://localhost:8081/index.js /project/index.js
```

### Changelog
* v0.2.4 basic ajax features
* v0.2.5 remove xhr.onload
* v0.2.6 fix ajax get bug
* v1.0.0 add tests