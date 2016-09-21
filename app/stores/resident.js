var entityName = 'resident';
var apiBaseURL = 'http://localhost/_RestAPIs/ResidenceUniversitaire/api.php/' + entityName;

var Store = new DevExpress.data.CustomStore({
    key: "id", //["resident_id", "reglement_id"],
    load: function (loadOptions) {
        var filterOptions = loadOptions.filter ? JSON.stringify(loadOptions.filter) : "";   // Getting filter settings
        var sortOptions = loadOptions.sort ? JSON.stringify(loadOptions.sort) : "";  // Getting sort settings
        var requireTotalCount = loadOptions.requireTotalCount; // You can check this parameter on the server side  
                                                               // to ensure that a number of records (totalCount) is required
        var skip = loadOptions.skip; // A number of records that should be skipped 
        var take = loadOptions.take; // A number of records that should be taken

        /*var d = $.Deferred();
        $.getJSON('http://mydomain.com/MyDataService', {  
            filter: filterOptions,
            sort: sortOptions,
            requireTotalCount: requireTotalCount,
            skip: skip,
            take: take
        }).done(function (result) {
            // Data processing here
            d.resolve(result.data, { totalCount: result.totalCount }); 
        });*/

        console.log('Store_' + entityName +' : load()');
        var deferred = $.Deferred();
        $.get(apiBaseURL + '?transform=1'/*, {  
            filter: filterOptions,
            sort: sortOptions,
            requireTotalCount: requireTotalCount,
            skip: skip,
            take: take
        }*/).done(function (result) {
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
        console.log(key);
        console.log(values);
        return $.ajax({
            url: apiBaseURL + "/" + encodeURIComponent(key),
            method: "PUT",
            data: values
        });
    },
    insert: function (values) {
        //Inserting data
        console.log(values.toString());
        return $.post(apiBaseURL, values);
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
