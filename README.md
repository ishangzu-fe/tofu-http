# tofu-http

## Install
```shell
npm install tofu-http
```

## Example
``` javascript
import http from 'tofu-http';
const params = {
    id:1
}
http.$get('http://github.com',params).then(res => {
    //do something...
});
```