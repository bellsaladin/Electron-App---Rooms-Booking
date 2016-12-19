let Store_Chambre = require('../../stores/chambre')
let Store_Pavillon = require('../../stores/pavillon')
let Store_Etage = require('../../stores/etage')
let Store_Categorie = require('../../stores/categorie')
let Store_Type = require('../../stores/type')
let Config = require('../../config')

var dataGrid = $("#ui-chambre-list-section .gridContainer").dxDataGrid({
    dataSource: Store_Chambre,
    masterDetail : {enabled : false},
    rowAlternationEnabled : true,
    showRowLines : true,
    showColumnLines : false,
    selection: {
        mode: "multiple"
    },
    grouping: {
        autoExpandAll: false,
    },
    remoteOperations : {
        filtering : false,
        grouping : false,
        paging : false,
        sorting : false,
        summary : false,
    },
    paging : {enabled : false},
    loadPanel : {
        enabled : true,
        height : 90,
        width: 100,
        showPane : true,
        showIndicator : true,
        text : 'Chargement ...'
    },
    noDataText : '',
    editing: {
        allowAdding : false,
        allowDeleting : true,
        allowUpdating : true,
        mode : 'row',
        texts : Config.gridview.editing.texts
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
        dataField: "num",
    }, {
        dataField: "nbr_lits"
    },
     {
        dataField: "pavillon_id",
        groupIndex: 0,
        caption: "Pavillon",
        lookup: { dataSource: Store_Pavillon, valueExpr: 'id', displayExpr: 'nom' }
    },
    {
        dataField: "etage_id",
        groupIndex: 1,
        caption: "Etage",
        lookup: { dataSource: Store_Etage, valueExpr: 'id', displayExpr: 'nom' }
    },
    {
        dataField: "categorie_id",
        caption: "Categorie",
        lookup: { dataSource: Store_Categorie, valueExpr: 'id', displayExpr: 'nom' }
    },
    {
        dataField: "type_id",
        caption: "Type",
        lookup: { dataSource: Store_Type, valueExpr: 'id', displayExpr: 'nom' }
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

/*dataGrid.option("masterDetail", {
        enabled: false,
        template: function (container, info) {
        }
});*/
