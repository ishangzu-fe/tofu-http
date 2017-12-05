import 'whatwg-fetch';
import 'isomorphic-fetch';
import Util from './util';

class Http {
    constructor(isMock = true, chain = data => {
        return data
    }, headers, errorHandler = err => {
        console.error(err);
    }) {
        Util.DateInt();
        this.isMock = isMock;
        this.chain = chain;
        this.headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, headers);
        this.errorHandler = errorHandler;

        ['get', 'post', 'put', 'delete', 'download'].forEach(v => {
            this[`$${v}`] = (url, params, headers) => {
                return this.restful.call(this, url, params, v, headers);
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
            if (res.status >= 400) return res;

            if (config.method === 'download') {
                return res.blob();
            } else {
                return res.json();
            }
        }).then(this.chain).catch(this.errorHandler);
    }

    restful(url, params, method, headers = {}) {
        const config = {
            method: method,
            credentials: 'include',
            headers: Object.assign(this.headers, headers)
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
