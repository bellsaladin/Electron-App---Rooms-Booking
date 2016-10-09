//let Store_Chambre = require('../../stores/chambre')
//let Store_Pavillon = require('../../stores/pavillon')
let Store_Etage = require('../../stores/etage')
//let Store_Categorie = require('../../stores/categorie')
//let Store_Type = require('../../stores/type')

var dataGrid = $("#ui-etage-list-section .gridContainer").dxDataGrid({
    dataSource: Store_Etage,
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
    noDataText : '',
    headerFilter: {
        visible: true
    },
    columns: [{
        dataField: "id",
    }, {
        dataField: "nom"
    }]
}).dxDataGrid('instance');
