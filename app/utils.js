function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
function fixDate (date) {
  
  return (date == '0000-00-00')?null:date;
}

function toMysqlDateFormat(date) {
     if(date instanceof Date){
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
    return date;
}

function preprocessData(dataArray, options) {
    if(options.operation == 'convert'){
        if(options.direction == 'receiving'){
            dataArray = convertTinyIntToBoolean(dataArray, options.colIndex);
        }else if(options.direction == 'sending'){
            dataArray = convertBooleanToTinyInt(dataArray, options.colIndex);
        }
        
    }
    return dataArray; 
}

function convertTinyIntToBoolean(dataArray, colIndex) {
    for(var i=0; i < dataArray.length; i++){
        dataArray[i][colIndex] = (dataArray[i][colIndex] == 1)?true : false;
    }
    return dataArray;
}


function convertBooleanToTinyInt(dataArray, colIndex) {
    for(var i=0; i < dataArray.length; i++){
        dataArray[i][colIndex] = (dataArray[i][colIndex] == true)? 1 : 0;
    }
    return dataArray;
}

function showToastMsg(type, msg) {
    $("#toast").dxToast({
        message: msg,
        type: type,
        displayTime: 3000
    });
}

//module.export {pad}

module.exports = {
    pad: pad,
    fixDate : fixDate,
    toMysqlDateFormat: toMysqlDateFormat,
    preprocessData : preprocessData,
    showToastMsg : showToastMsg
};