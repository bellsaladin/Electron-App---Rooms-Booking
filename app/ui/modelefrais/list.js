//let Store_Chambre = require('../../stores/chambre')
//let Store_Pavillon = require('../../stores/pavillon')
let Store_ModeleFrais = require('../../stores/modelefrais')
let Store_Type = require('../../stores/type')

var dataGrid = $("#ui-modelefrais-list-section .gridContainer").dxDataGrid({
    dataSource: Store_ModeleFrais,
    masterDetail : {enabled : false},
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
    noDataText : '',
    paging : {enabled : false},
    columns: [
    { dataField: "id", visible : false}, 
    { dataField: "type_frais"},
    { dataField: "montant", dataType :'money', },
    { dataField: "list_order" , dataType :'number', sortOrder : 'asc', caption :'Ordre d\'affichage' },
    {
        dataField: 'typechambre_id',
        editorType: 'dxSelectBox',
        caption : 'Type chambre',
        lookup: { dataSource: Store_Type, valueExpr: 'id', displayExpr: 'nom' },
        groupIndex: 0,
    }]
}).dxDataGrid('instance');
