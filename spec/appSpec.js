'use strict';

describe("ajax direct functions", function() {

	var result = {
	    "retcode": 0,
	    "data":[
	        {
	            "id": 1,
	            "name": "a"
	        },
	        {
	            "id": 2,
	            "name": "b"
	        }
	    ]
	};

	var errorResult = {
		"retcode": 1
	};

	it("test get request", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxGet({
		    url: "./response/1.json",
		    param: {
		    	id: 1
		    },
		    success: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(result));
		    	done();
		    },
		    error: function(xhr) {
		    	done();
		    	console.log(xhr);
		    }
		});
    	
  	});

  	it("test get request error", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxInit({
			dataReturnSuccessCondition: function(data) {
		        return !data.retcode;
		    }
		});

  		net.ajaxGet({
		    url: "./response/3.json",
		    param: {
		    	id: 1
		    },
		    success: function(data) {
		    	done();
		    },
		    error: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(errorResult));
		    	done();
		    }
		});
    	
  	});

	it("test post request", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxPost({
		    url: "./response/1.json",
		    param: {
		    	id: 1
		    },
		    success: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(result));
		    	done();
		    },
		    error: function(xhr) {
		    	done();
		    	console.log(xhr);
		    }
		});
    	
  	});

  	it("test post request error", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxInit({
			dataReturnSuccessCondition: function(data) {
		        return !data.retcode;
		    }
		});

  		net.ajaxPost({
		    url: "./response/3.json",
		    param: {
		    	id: 1
		    },
		    success: function(data) {
		    	done();
		    },
		    error: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(errorResult));
		    	done();
		    }
		});
    	
  	});

  	it("test jsonp request", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxJsonp({
		    url: "./response/2.json",
		    param: {
		    	id: 1,
		    	jsonCbName: "ajaxJson"
		    },
		    success: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(result));
		       	done();
		    },
		    error: function(xhr) {
		    	done();
		    }
		})
    	
  	});

  	it("test jsonp request error", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxInit({
			dataReturnSuccessCondition: function(data) {
		        return !data.retcode;
		    }
		});

  		net.ajaxJsonp({
		    url: "./response/4.json",
		    param: {
		    	id: 1,
		    	jsonCbName: "ajaxJson"
		    },
		    success: function(data) {
		    	done();
		    },
		    error: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(errorResult));
		    	done();
		    }
		});
    	
  	});

});

describe("ajax ajaxType", function() {

	var result = {
	    "retcode": 0,
	    "data":[
	        {
	            "id": 1,
	            "name": "a"
	        },
	        {
	            "id": 2,
	            "name": "b"
	        }
	    ]
	};

	var errorResult = {
		"retcode": 1
	};

	it("test get request", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajax({
		    url: "./response/1.json",
		    param: {
		    	id: 1
		    },
		    ajaxType: "GET",
		    success: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(result));
		    	done();
		    },
		    error: function(xhr) {
		    	console.log(xhr);
		    	done();
		    }
		});
    	
  	});

  	it("test get request error", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxInit({
			dataReturnSuccessCondition: function(data) {
		        return !data.retcode;
		    }
		});

  		net.ajax({
		    url: "./response/3.json",
		    param: {
		    	id: 1
		    },
		    ajaxType: "GET",
		    success: function(data) {
		    	done();
		    },
		    error: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(errorResult));
		    	done();
		    }
		});
    	
  	});

	it("test post request", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajax({
		    url: "./response/1.json",
		    param: {
		    	id: 1
		    },
		    ajaxType: "POST",
		    success: function(data){
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(result));
		    	done();
		    },
		    error: function(xhr){
		    	done();
		    	console.log(xhr);
		    }
		});
    	
  	});

  	it("test post request error", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxInit({
			dataReturnSuccessCondition: function(data) {
		        return !data.retcode;
		    }
		});

  		net.ajax({
		    url: "./response/3.json",
		    param: {
		    	id: 1
		    },
		    ajaxType: "POST",
		    success: function(data) {
		    	done();
		    },
		    error: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(errorResult));
		    	done();
		    }
		});
    	
  	});

  	it("test jsonp request", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajax({
		    url: "./response/2.json",
		    param: {
		    	id: 1,
		    	jsonCbName: "ajaxJson"
		    },
		    ajaxType: "JSONP",
		    success: function(data){
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(result));
		       	done();
		    },
		    error: function(xhr){
		    	done();
		    }
		});
    	
  	});

  	it("test jsonp request error", function(done) {
      		
  		var doneFn = jasmine.createSpy("success");

  		net.ajaxInit({
			dataReturnSuccessCondition: function(data) {
		        return !data.retcode;
		    }
		});

  		net.ajax({
		    url: "./response/4.json",
		    param: {
		    	id: 1,
		    	jsonCbName: "ajaxJson"
		    },
		    ajaxType: "JSONP",
		    success: function(data) {
		    	done();
		    },
		    error: function(data) {
		    	expect(JSON.stringify(data)).toBe(JSON.stringify(errorResult));
		    	done();
		    }
		});
    	
  	});

});