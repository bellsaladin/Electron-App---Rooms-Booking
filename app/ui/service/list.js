//let Store_Chambre = require('../../stores/chambre')
//let Store_Pavillon = require('../../stores/pavillon')
let Store_Service = require('../../stores/service')
//let Store_Categorie = require('../../stores/categorie')
//let Store_Type = require('../../stores/type')

var dataGrid = $("#ui-service-list-section .gridContainer").dxDataGrid({
    dataSource: Store_Service,
    masterDetail : {enabled : false},
    rowAlternationEnabled : true,
    showRowLines : true,
    showColumnLines : false,
    selection: {
        mode: "multiple"
    },
    noDataText : '',
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
        dataField: "id",
    }, {
        dataField: "nom"
    }]
}).dxDataGrid('instance');
