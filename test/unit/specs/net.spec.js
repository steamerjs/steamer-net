"use strict";

// http://harttle.land/2016/08/15/sinon-xhr.html
// https://rjzaworski.com/2015/05/testing-api-requests-with-xhr-and-sinon-js
// http://sinonjs.org/releases/v4.4.2/fake-xhr-and-server/

import net from '../../../src/index.js';

describe('xhr', function(){
    var xhr, fake;
    before(function(){
        fake = sinon.useFakeXMLHttpRequest();
        fake.onCreate = function(_xhr){ xhr = _xhr; };
    });

    it('GET - json', function(done) {
        net.ajaxGet({
            url: "./response/1.json",
            param: {
                id: 1
            },
            headers: {
                'Content-Type': 'application/json',
            },
            success: function(data) {
                expect(data).to.be.eql({
                    a: 1,
                    b: {},
                    c: true
                });
                done();
            },
            error: function(xhr) {
                done();
                // console.log(xhr);
            }
        });

        expect(xhr.url).to.be.eql('./response/1.json?id=1');
        expect(xhr.method).to.be.eql('GET');

        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
            a: 1,
            b: {},
            c: true
        }));
    });

    it('GET - string', function(done) {
        net.ajaxGet({
            url: "./response/1.json",
            param: {
                id: 1
            },
            dataType: 'text',
            success: function(data) {
                expect(data).to.be.eql('hello world');
                done();
            },
            error: function(xhr) {
                done();
                // console.log(xhr);
            }
        });

        expect(xhr.url).to.be.eql('./response/1.json?id=1');
        expect(xhr.method).to.be.eql('GET');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, 'hello world');
    });

    it('GET - ajax', function(done) {
        net.ajax({
            url: "./response/1.json",
            param: {
                id: 1
            },
            ajaxType: 'GET',
            dataType: 'text',
            xhrFields: {
                withCredentials: false,
            },
            success: function(data) {
                expect(data).to.be.eql('hello world');
                done();
            },
            error: function(xhr) {
                done();
                // console.log(xhr);
            }
        });

        expect(xhr.withCredentials).to.be.eql(false);
        expect(xhr.url).to.be.eql('./response/1.json?id=1');
        expect(xhr.method).to.be.eql('GET');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, 'hello world');
    });

    it('POST - json', function(done) {
        net.ajaxPost({
            url: "./response/1.json",
            param: {
                id: 1
            },
            success: function(data) {
                expect(data).to.be.eql({
                    a: 1,
                    b: {},
                    c: true
                });
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.requestBody).to.be.eql('id=1');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, JSON.stringify({
            a: 1,
            b: {},
            c: true
        }));
    });

    it('POST - text', function(done) {
        net.ajaxPost({
            url: "./response/1.json",
            param: {
                id: 1
            },
            dataType: 'text',
            success: function(data) {
                expect(data).to.be.eql('hello world');
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.requestBody).to.be.eql('id=1');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, 'hello world');
    });

    it('POST - ajax', function(done) {
        net.ajax({
            url: "./response/1.json",
            param: {
                id: 1
            },
            ajaxType: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function(data) {
                expect(data).to.be.eql({
                    a: 1,
                    b: {},
                    c: true
                });
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.requestHeaders).to.be.eql({
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        });
        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.requestBody).to.be.eql('id=1');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, JSON.stringify({
            a: 1,
            b: {},
            c: true
        }));
    });

    it('POST - localData', function(done) {
        net.ajax({
            url: "./response/1.json",
            param: {
                id: 1
            },
            localData: {
                a: 1,
                b: 2,
            },
            ajaxType: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function(data) {
                expect(data).to.be.eql({
                    a: 1,
                    b: 2,
                });
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.requestHeaders).to.be.eql({
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        });
        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.requestBody).to.be.eql('id=1');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, JSON.stringify({
            a: 1,
            b: {},
            c: true
        }));
    });

    it('POST - dataReturnSuccessCondition', function(done) {

        net.ajaxInit({
            dataReturnSuccessCondition: function(data) {
                return data.retcode === 0;
            }
        })

        net.ajax({
            url: "./response/1.json",
            param: {
                id: 1
            },
            ajaxType: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function(data) {
                // console.log(data);
                expect(data).to.be.eql({
                    retcode: 0,
                    data: {
                        a: 1,
                        b: 2
                    }
                });
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.requestHeaders).to.be.eql({
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        });
        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.requestBody).to.be.eql('id=1');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, JSON.stringify({
            retcode: 0,
            data: {
                a: 1,
                b: 2
            }
        }));
    });

    it('FORM', function(done) {
        let formData = new FormData();
        formData.append("a", 1);
        formData.append("b", 2);
        // console.log(formData.getAll('a'));
        net.ajaxForm({
            url: "./response/1.json",
            param: formData,
            success: function(data) {
                expect(data).to.be.eql({
                    a: 1,
                    b: {},
                    c: true
                });
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.requestBody.getAll('a')).to.be.eql(['1']);
        expect(xhr.requestBody.getAll('b')).to.be.eql(['2']);
        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, {}, JSON.stringify({
            a: 1,
            b: {},
            c: true
        }));
    });

    it('FORM - ajax', function(done) {
        let formData = new FormData();
        formData.append("a", 1);
        formData.append("b", 2);
        // console.log(formData.getAll('a'));
        net.ajax({
            url: "./response/1.json",
            param: formData,
            ajaxType: 'FORM',
            success: function(data) {
                expect(data).to.be.eql({
                    a: 1,
                    b: {},
                    c: true
                });
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.requestBody.getAll('a')).to.be.eql(['1']);
        expect(xhr.requestBody.getAll('b')).to.be.eql(['2']);
        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, {}, JSON.stringify({
            a: 1,
            b: {},
            c: true
        }));
    });

    // it.only('JSONP - text', function(done) {
    //     net.ajaxJsonp({
    //         url: "./response/1.json",
    //         param: {
    //             id: 1,
    //             jsonCbName: "ajaxJson"
    //         },
    //         dataType: 'text',
    //         success: function(data) {
    //             console.log(data);
    //             // expect(data).to.be.eql('hello world');
    //             done();
    //         },
    //         error: function(xhr) {
    //             done();
    //         }
    //     });

    //     // expect(xhr.url).to.be.eql('./response/1.json?id=1');
    //     // expect(xhr.requestBody).to.be.eql('id=1');
    //     // expect(xhr.method).to.be.eql('GET');

    //     // xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, 'ajaxJson({ a: 1, b: {}, c: true})');
    // });

    it('GET - dataReturnSuccessCondition&beforeResponse', function(done) {

        net.ajaxInit({
            beforeResponse: function(data, successCb, errorCb) {
                data.retcode = 0;
                successCb(data);
            },
            dataReturnSuccessCondition: function(data) {
                return data.retcode === 0;
            }
        })

        net.ajax({
            url: "./response/1.json",
            ajaxType: 'GET',
            param: {
                id: 1
            },
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function(data) {
                // console.log(data);
                expect(data).to.be.eql({
                    retcode: 0,
                });
                done();
            },
            error: function(xhr) {
                done();
            }
        });

        expect(xhr.url).to.be.eql('./response/1.json?id=1');
        expect(xhr.method).to.be.eql('GET');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, JSON.stringify({
            retcode: 1,
        }));
    });

    it('GET - beforeRequest&beforeResponse', function(done) {
        net.ajaxInit({
            beforeRequest: function(opts)　{
                opts.param.flag = 'test';
                return opts;
            },
            beforeResponse: function(data, successCb, errorCb) {
                data.retcode = 1;
                data.data.test = 'beforeRequest&beforeResponse';
                if(data.retcode === 0) {
                    successCb(data);
                } else {
                    errorCb(data);
                }
            },
            dataReturnSuccessCondition: function() {
                return true;
            },
        })


        net.ajax({
            url: "./response/1.json",
            param: {
                id: 1
            },
            ajaxType: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            success: function(data) {
                done();
            },
            error: function(data) {
                expect(data).to.be.eql({
                    retcode: 1,
                    data: {
                        a: 1,
                        test: 'beforeRequest&beforeResponse',
                    }
                });
                done();
            }
        });
        expect(xhr.requestBody).to.be.eql('id=1&flag=test');
        expect(xhr.url).to.be.eql('./response/1.json');
        expect(xhr.method).to.be.eql('POST');

        xhr.respond(200, { 'Content-Type': 'application/x-www-form-urlencoded' }, JSON.stringify({
            retcode: 0,
            data: {
                a: 1,
            }
        }));
    });

    after(function(){
        fake.restore();
    });
});
