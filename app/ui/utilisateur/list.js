//let Store_Chambre = require('../../stores/chambre')
//let Store_Pavillon = require('../../stores/pavillon')
let Store_Service = require('../../stores/service')
let Store_Utilisateur = require('../../stores/utilisateur')
//let Store_Categorie = require('../../stores/categorie')
//let Store_Type = require('../../stores/type')

var dataGrid = $("#ui-utilisateur-list-section .gridContainer").dxDataGrid({
    dataSource: Store_Utilisateur,
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
    noDataText : '',
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
    columns: [
    { dataField: "id",}, 
    { dataField: "nom_utilisateur"},
    { dataField: "mot_de_passe", editorType : 'dxTextBox', editorOptions : {  mode: 'password'} },
    { dataField: "nom"},
    { dataField: "prenom"},
    {
        dataField: 'service_id',
        editorType: 'dxSelectBox',
        caption : 'Service',
        lookup: { dataSource: Store_Service, valueExpr: 'id', displayExpr: 'nom' }
    },
    {dataField: 'active', dataType : 'boolean', caption : 'Activé'}]
}).dxDataGrid('instance');
