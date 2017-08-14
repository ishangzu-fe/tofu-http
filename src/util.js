function Format(format) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
}

function toJSON() {
    return this.Format('yyyy-MM-dd hh:mm:ss');
}

export default {
    DateInt: () => {
        Date.prototype.Format = Format;
        Date.prototype.toJSON = toJSON;
    },
    merge: (receiver, supplier) => {
        var key, value;
        var self = this;

        for (key in supplier) {
            if (supplier.hasOwnProperty(key)) {
                receiver[key] = cloneValue(supplier[key], receiver[key]);
            }
        }

        function isPlainObject(o) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor
            // property. Make sure that DOM nodes and window objects don't
            // pass through, as well
            if (!o || toString.call(o) !== "[object Object]" ||
                o.nodeType || Util.isWindow(o)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (o.constructor &&
                    !hasOwn.call(o, "constructor") &&
                    !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            var key;

            // Support: IE<9
            // Handle iteration over inherited properties before own properties.
            // http://bugs.jquery.com/ticket/12199
            if (iteratesOwnLast) {
                for (key in o) {
                    return hasOwn.call(o, key);
                }
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            for (key in o) {}

            return key === undefined || hasOwn.call(o, key);
        }


        function cloneValue(value, prev) {
            if (Object.prototype.toString.call(value)) {
                value = value.slice();
            } else if (isPlainObject(value)) {
                isPlainObject(prev) || (prev = {});

                value = self.merge(prev, value);
            }

            return value;
        }
        return receiver;
    }
}