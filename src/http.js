import 'isomorphic-fetch';
import util from './util';

class Http {
    constructor(isMock = true, chain = data => {
        return data
    }, headers) {
        util.DateInt();
        if (typeof Object['assign'] != 'function') {
            Object.assign = function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            }
        }
        this.isMock = isMock;
        this.chain = chain;
        this.headers = util.merge({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, headers);

        ['get', 'post', 'put', 'delete', 'download'].forEach(v => {
            this[`$${v}`] = (url, params) => {
                return this.restful.call(this, url, params, v);
            }
        });
    }

    getParam(params) {
        let result = '';
        for (let item in params) {
            if (params[item]) {
                result += `${item}=${params[item]}&`;
            }
        }
        result = result.substring(0, result.lastIndexOf('&'));
        if (result) {
            result = `?${result}`;
        }
        return result;
    }

    send(url, config) {
        let _c = Object.assign({}, config);
        _c.method = _c.method === 'download' ? 'post' : _c.method;

        return fetch(url, _c).then(res => {
            if (config.method === 'download') {
                return res.blob();
            } else {
                return res.json();
            }
        }).then(this.chain).catch(err => {
            return err;
        });
    }

    restful(url, params, method) {
        const config = {
            method: method,
            credentials: 'include',
            headers: this.headers
        }

        if (method == 'get' && params) {
            url = url + this.getParam(params);
        } else {
            config['body'] = JSON.stringify(params);
        }

        return this.send(url, config);
    }
}

export default Http;