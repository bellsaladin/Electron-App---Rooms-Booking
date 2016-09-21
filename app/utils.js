function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
function fixDate (date) {
  
  return (date == '0000-00-00')?null:date;
}

function toMysqlDateFormat(date) {
        var year, month, day;
        year = String(date.getFullYear());
        month = String(date.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(date.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    }

//module.export {pad}

module.exports = {
    pad: pad,
    fixDate : fixDate,
    toMysqlDateFormat: toMysqlDateFormat,
};