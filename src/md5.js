
import CryptoJS from 'crypto-js';
module.exports = function (url, params, method) {
    const urls = url.replace(/(.action)$/, '');
    const ruleTrans = function (key, val) {
        return val === undefined ? null : val;
    }
    const paramsUrl = (method === 'get' ? '' : params ? JSON.stringify(params, ruleTrans) : 'null') + urls;
    let captainSerect = document.cookie.replace(/(?:(?:^|.*;\s*)captain\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)ISZ_SESSIONID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (captainSerect) {
        localStorage.setItem('captainSerect', captainSerect);
        if (localStorage.getItem('captainSerect')) {
            document.cookie = 'captain=; domain=.ishangzu.com;path=/';
        }
    } else {
        captainSerect = localStorage.getItem('captainSerect');
    }
    const hash = CryptoJS.HmacSHA256(paramsUrl, captainSerect);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    const md5Last = CryptoJS.MD5(hashInBase64 + token).toString().toUpperCase('')
    return md5Last
}