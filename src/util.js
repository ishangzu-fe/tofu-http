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

        for (key in supplier) {
            if (supplier.hasOwnProperty(key)) {
                receiver[key] = cloneValue(supplier[key], receiver[key]);
            }
        }

        function cloneValue(value, prev) {
            if (Util.isArray(value)) {
                value = value.slice();
            } else if (isPlainObject(value)) {
                isPlainObject(prev) || (prev = {});

                value = Util.merge(prev, value);
            }

            return value;
        }
        return receiver;
    }
}