let Store_Resident = require('../../stores/resident')
let Utils = require('../../utils')


var sectionId = 'ui-resident-fiche-suivi-section';
//let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')
var gridResult = null;
var resultDataSource = null;

var formSearchData = {
    //id: "1",
    code : '',
    num_cin : '',
    nom_de_famille: "",
}

var formSearch = $("#" + sectionId + " .form-search").dxForm({
    formData: formSearchData,
    items: [
            {dataField: 'code', 
             editorOptions : {
                onValueChanged: function (e) {
                    //alert('Code edited;');
                    gridResult.option('dataSource', null);
                    Store_Resident.load({'filter': 'code,sw,' + e.value}).done(function(result) {
                        //console.log(result);
                        resultDataSource = result;
                        gridResult.option('dataSource', resultDataSource);
                    });
                    return;
                } 
             } 
            },
            {dataField: 'num_cin',
             editorOptions : {
                onValueChanged: function (e) {
                    //alert('Code edited;');
                    gridResult.option('dataSource', null);
                    Store_Resident.load({'filter': 'num_cin,sw,' + e.value}).done(function(result) {
                        //console.log(result);
                        resultDataSource = result;
                        gridResult.option('dataSource', resultDataSource);
                    });
                    return;
                } 
             } 
            },
            {dataField: 'nom_de_famille',
             editorOptions : {
                onValueChanged: function (e) {
                    //alert('Code edited;');
                    gridResult.option('dataSource', null);
                    Store_Resident.load({'filter': 'nom,sw,' + e.value}).done(function(result) {
                        //console.log(result);
                        resultDataSource = result;
                        gridResult.option('dataSource', resultDataSource);
                    });
                    return;
                } 
             } 
            },
    ],
    colCount: 3
}).dxForm('instance');

var formData = {
    //id: "1",
    code : '',
    num_cin : '',
    nom: "",
    prenom: "",
    date_naissance: "1990-01-01",
    lieu_naissance : '',
    tel_resident : '',
    tel_tuteur : '',
    sexe : 'M',
    nationalite : '',
    ville : '',
    appartenance_politique : 'Non',
    recommandation : 'Non',
    photo : null,
}

var form = $("#" + sectionId + " .form").dxForm({
    formData: formData,
    items: [//{dataField: 'id'},
            {dataField: 'code', editorOptions : { disabled : true} },
            {},
            {itemType: "group",
             caption: "Informations personnelles",
             items: 
                [
                {
                    editorType: 'dxSelectBox',
                    dataField: 'sexe',
                },
                {dataField: 'num_cin'},
                {dataField: 'nom'},
                {dataField: 'prenom'},
                {
                    editorType: 'dxDateBox',
                    dataField: 'date_naissance',
                    label: {
                        showColon: true,
                        text: 'Date de naissance'
                    }
                },
                {dataField: 'nationalite'},
                {dataField: 'ville'},
                {dataField: 'lieu_naissance'}]
            },
            {itemType: "group",
             caption: "Photo",
             items: 
                [{
                    editorType: 'string', 
                    dataField: 'photo',
                    label : {visible : false}
                }]
            },
            {itemType: "group",
             caption: "Contact",
             items: [{dataField: 'tel_resident'},
                     {dataField: 'tel_tuteur'},]
            },
            {itemType: "group",
             caption: "Autres",
             items: [
                     {dataField: 'appartenance_politique'},
                     {dataField: 'recommandation'},]
            },
            //{editorType : 'dxTextArea', dataField: 'adresse'},
            ],
            customizeItem: function (item) {
                    if (item.dataField !== 'photo')
                        return;
                        
                    item.template = function (data, itemElement) {
                        var value = data.editorOptions.value;
                        if(value == null){
                            value = 'assets/img/resident-homme-placeholder.png';
                        }
                        var img = $('<img>').attr('src', value).attr('height', '180px').attr('width', '160px');
                        img.appendTo(itemElement);
                    }
                },
    colCount: 2
}).dxForm('instance');

gridResult = $("#" + sectionId + " .grid-result").dxDataGrid({
    dataSource: null, 
    editing: {
        allowAdding : false,
        allowDeleting : false,
        allowUpdating : false,
        mode : 'cell'},
    columns : [ {dataField: 'num_cin', sortOrder : 'desc'}, {dataField: 'nom'}, {dataField: 'chambre'}, {dataField: 'pavillon'}]
}).dxDataGrid('instance');