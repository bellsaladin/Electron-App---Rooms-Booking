let Store_Resident = require('../../stores/resident')
//let normalize = require('electron-shortcut-normalizer')
//let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')

/*var context = new DevExpress.data.ODataContext({
    //url: "http://services.odata.org/V4/Northwind/Northwind.svc",version: 4,
    //url: "http://localhost:8886/NorthwindJpaProducerExample.svc", version :2,
    url : 'http://localhost:9000/3ea8f06baf64/',
    successHandler: function(error) {
        alert(error.message);
    },
    errorHandler: function(error) {
        alert(error.message);
    },
    entities: {
        Categories: { 
            key: "CategoryID", 
            keyType: "Int32" 
        },
        Customers: { 
            name: "Customers",
            key: "CustomerID", 
            keyType: "String" 
        }
    },
    beforeSend: function (sender) {
            sender['params'].user = '6adb637f9cf2';
            sender['params'].password = 'C1myVo6Vd9YJ';
    }
});

var categoriesSource = new DevExpress.data.DataSource(context.Categories);
var customersSource = new DevExpress.data.DataSource(context.Customers);*/

var dataGrid = $("#ui-resident-list-section .gridContainer").dxDataGrid({
    dataSource: Store_Resident,
    masterDetail : {enabled : true},
    rowAlternationEnabled : true,
    showRowLines : true,
    showColumnLines : false,
    selection: {
        mode: "multiple"
    },
    remoteOperations : {
        filtering : false,
        grouping : false,
        paging : false,
        sorting : false,
        summary : false,
    },
    loadPanel : {
        enabled : true,
        height : 90,
        width: 100,
        showPane : true,
        showIndicator : true,
        text : 'Chargement ...'
    },
    editing: {
        allowAdding : true,
        allowDeleting : true,
        allowUpdating : true,
        mode : 'row',
    },
    onSelectionChanged: function(data) {
        //deleteButton.option("disabled", !data.selectedRowsData.length)
    }, 
    filterRow: {
        visible: true,
        applyFilter: "auto"
    },
    searchPanel: {
        visible: true,
        width: 240,
        placeholder: "Search..."
    },
    headerFilter: {
        visible: true
    },
    columns: [{
        dataField: "nom",
        caption: "Nom",
    }, {
        dataField: "prenom",
        caption: "Prenom",
    },
     {
        dataField: "date_naissance",
        alignment: "right",
        dataType: "date",
    },
    {
        dataField: "appartenance_politique",
        alignment: "right",
    }],
    
    /*columns: [{
        dataField: "OrderNumber",
        width: 130,
        caption: "Invoice Number",
        headerFilter: {
            groupInterval: 10000
        }
    }, {
        dataField: "OrderDate",
        alignment: "right",
        dataType: "date",
        headerFilter: {
            dataSource: function(data) {
                data.dataSource.postProcess = function(results) {
                    results.push({
                        text: "Weekends",
                        value: [[getOrderDay, "=", 0],
                          "or",
                        [getOrderDay, "=", 6]]
                    });
                    
                    return results;
                };
            }
        }
    }, {
        dataField: "SaleAmount",
        alignment: "right",
        format: "currency",
        headerFilter: {
            dataSource: [ {
                text: "Less than $3000",
                value: ["SaleAmount", "<", 3000]
            }, {
                
                text: "$3000 - $5000",
                value: [["SaleAmount", ">=", 3000], ["SaleAmount", "<", 5000]]
            }, {
                
                text: "$5000 - $10000",
                value: [["SaleAmount", ">=", 5000], ["SaleAmount", "<", 10000]]
            }, {
                
                text: "$10000 - $20000",
                value: [["SaleAmount", ">=", 10000], ["SaleAmount", "<", 20000]]
            }, {
                
                text: "Greater than $20000",
                value: ["SaleAmount", ">=", 20000]
            }]
        }
    }, "Employee", {
        caption: "City",
        dataField: "CustomerStoreCity"
    }, {
        caption: "State",
        dataField: "CustomerStoreState"
    }]*/
}).dxDataGrid('instance');

/*dataGrid2.option("masterDetail", {
        enabled: false,
        template: function (container, info) {
        }
});*/