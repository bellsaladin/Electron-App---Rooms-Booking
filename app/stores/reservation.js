let Config = require('../config')

var entityName = 'reservation';
var apiBaseURL = Config.API_BASE_URL + entityName;

var Store = new DevExpress.data.CustomStore({
    key: "id", //["resident_id", "reglement_id"],
    load: function (loadOptions) {
        var filterOptions = loadOptions.filter ? JSON.stringify(loadOptions.filter) : "";   // Getting filter settings
        console.log(loadOptions)
        var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";  // Getting sort settings
        var requireTotalCount = loadOptions.requireTotalCount; // You can check this parameter on the server side  
                                                               // to ensure that a number of records (totalCount) is required
        var skip = loadOptions.skip; // A number of records that should be skipped 
        var take = loadOptions.take; // A number of records that should be taken

        console.log('Store_' + entityName +' : load()');
        var deferred = $.Deferred();
        $.get(apiBaseURL + '?transform=1', {  
            filter: loadOptions.filter,
            sort: sortOptions,
            requireTotalCount: requireTotalCount,
            skip: skip,
            take: take
        }).done(function (result) {
            var rowsCount = 0;
            if(result[entityName]) {
                rowsCount = result[entityName].length;
            }
            if (loadOptions.requireTotalCount === true)
                deferred.resolve(result[entityName], { totalCount: rowsCount });
            else
                deferred.resolve(result[entityName])
        });
        return deferred.promise();        
    },
    byKey: function(key) {
        //alert(encodeURIComponent(key));
        return $.getJSON(apiBaseURL + "/" + encodeURIComponent(key));
    },
    update: function (key, values) {
        ////Updating data
        //alert(' encodeURIComponent(key)'  +  encodeURIComponent(key));
        // console.log(key);
        // console.log(values);
        return $.ajax({
            url: apiBaseURL + "/" + encodeURIComponent(key),
            method: "PUT",
            data: values
        });
    },
    insert: function (values, doneCallback) {
        //Inserting data
        // console.log(values.toString());
        //alert(doneCallback);
        //console.log('doneCallback');
        //console.log(doneCallback);
        return $.post(apiBaseURL, values).done(doneCallback);
        /*if (typeof doneCallback === "function") {
            alert('with callback');
            return $.post(apiBaseURL, values).done(doneCallback);   
        }
        else{
            alert('no callback');
            return $.post(apiBaseURL, values);
        }*/

        /*return $.ajax({
            url: apiBaseURL + "/" + encodeURIComponent(key),
            method: "POST",
        });*/
    },
    remove: function (key) {
        //Deleting data
        //alert('encodeURIComponent(key) : ' + encodeURIComponent(key));
        return $.ajax({
            url: apiBaseURL + "/" + encodeURIComponent(key),
            method: "DELETE",
        });
    }
});

module.exports = Store;