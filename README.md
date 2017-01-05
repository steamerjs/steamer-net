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

### Changelog
* v0.2.4 basic ajax features
* v0.2.5 remove xhr.onload
* v0.2.6 fix ajax get bug