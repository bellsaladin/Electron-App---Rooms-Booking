let Store_Resident = require('../../stores/resident')
let Store_Chambre = require('../../stores/chambre')
let Store_Reservation = require('../../stores/reservation')
let Store_Pavillon = require('../../stores/pavillon')
let Store_Etage = require('../../stores/etage')
let Store_Categorie = require('../../stores/categorie')
let Store_Type = require('../../stores/type')
let Utils = require('../../utils')

// variables
var sectionId = 'ui-resident-localisation-section';
var button_save = null;
var button_remove = null;
var button_sortie = null;
var lastReservationOfResident = null;
var chambreLibreList = [];

var dataSourceFrais = [
                       {type_frais : 'Caution', montant : '500', regle : true},
                       {type_frais : 'Inscription', montant : '300', regle : true},
                       {type_frais : 'Assurance', montant : '60', regle : true},
                       {type_frais : '09/2016', montant : '700', regle : true},
                       {type_frais : '10/2016', montant : '700', regle : true},
                       {type_frais : '11/2016', montant : '700', regle : true},
                       {type_frais : '12/2016', montant : '700', regle : true},
                       {type_frais : '01/2017', montant : '700', regle : false},
                       {type_frais : '02/2017', montant : '700', regle : false},
                       {type_frais : '03/2017', montant : '700', regle : false},
                       {type_frais : '04/2017', montant : '700', regle : false},
                       {type_frais : '05/2017', montant : '700', regle : false},
                       {type_frais : '06/2017', montant : '700', regle : false},
                       {type_frais : '07/2017', montant : '350', regle : false},
                      ];


var formData = {
    resident_code : '',
    resident_infos : '',
    resident_id : null,
    chambre_id : 0,
    date_inscription : null,
    date_entree : null,
    date_sortie : null,
    list_frais : dataSourceFrais
}

// form ui

var form = $("#" + sectionId + " .form").dxForm({
    formData: formData,
    items: [
            {
                editorType: 'dxTextBox',
                dataField: 'resident_code',
                label : {text : 'Code résident'},
                editorOptions : {
                    onValueChanged: function (e) {
                        //alert('resident_code : ' + e.value);
                        loadResidentInfos(e.value);
                        return;
                    } 
                }
            },
            {},
            {dataField: 'resident_infos', label :{text: ' ', showColon : false}, editorOptions: {disabled : true}},
            {},
            {
                editorType: 'dxSelectBox',
                dataField: 'chambre_id',
                label : {text : 'Chambre'},
                editorOptions : {
                    dataSource : chambreLibreList,
                    valueExpr: 'val',
                    displayExpr: 'txt',
                    //onValueChanged: function (e) {
                        //alert('Pavillon selectionné : ' + e.value);
                        //setNewNumChambre(e.value);
                        //return;
                    //} 
                }
            },
            {},
            {
                editorType: 'dxDateBox',
                dataField: 'date_inscription',
                editorOptions : {
                    format : 'date',
                }
            },
            {},
            {
                editorType: 'dxDateBox',
                dataField: 'date_entree',
                editorOptions : {
                }
            },
            {
                editorType: 'dxDateBox',
                dataField: 'date_sortie',
                editorOptions : {
                }
            },
            {dataField: 'list_frais', visible : false, colspan : 3}
           ],
            customizeItem: function (item) {
                    if (item.dataField == 'list_frais') {
                        item.template = function (data, itemElement) {
                            var value = data.editorOptions.value;
                            //$('<input>').attr('type', 'hidden').prop('value', value).appendTo(itemElement);
                            //$('<div>').html(value).appendTo(itemElement);
                            $('<div>').dxDataGrid({
                                dataSource: value, editing: {
                                    allowAdding : false,
                                    allowDeleting : false,
                                    allowUpdating : false,
                                    mode : 'row',}
                                }).appendTo(itemElement);
                            $('<div class="spaced">').dxButton({
                                text: '1èr réglement',
                                onClick: function() {
                                    // use list_frais
                                    var list_frais = value;
                                }
                            }).appendTo(itemElement);;
                            $('<div  class="spaced">').dxButton({
                                text: '2ème réglement',
                                onClick: function() {
                                    // use list_frais
                                    var list_frais = value;
                                }
                            }).appendTo(itemElement);;
                            $('<div  class="spaced">').dxButton({
                                text: '3ème réglement',
                                onClick: function() {
                                    // use list_frais
                                    var list_frais = value;
                                }
                            }).appendTo(itemElement);;
                        }
                    }
                },
    colCount: 2
}).dxForm('instance');

function loadResidentInfos( resident_code){
    formData.resident_code = resident_code;
    resetForm();
    //alert('setResidentInfos');
    Store_Resident.load()
    .done(function(result) {
        for (var i = 0; i < result.length; i++) {
            var resident = result[i];
            //console.log (resident);
            if(resident.code == null || resident.code.length == 0) continue;
            //console.log(resident.code + ' ' + resident_code);
            if(resident.code == resident_code){
                //alert(chambre.num)
                formData.resident_infos = resident.prenom + ' ' + resident.nom;
                formData.resident_code = resident_code;
                formData.resident_id = resident.id;
                form.updateData(formData);
                loadLastReservationOfResident(resident.id);
                button_save.option('visible', true);
                return;
            }
        }
        //alert(formData.resident_infos);
        form.updateData(formData);
    })
    .fail(function(error) {
        // handle error
    });
}

// set 'chambres libres' list 

function setChambreLibreList(){
    
    Store_Chambre.load()
    .done(function(chambres) {
        Store_Pavillon.load()
            .done(function(pavillons) {
                for (var i = 0; i < chambres.length; i++) {
                    var chambre = chambres[i];
                    if(chambre.num == null || chambre.num.length == 0) continue;
                    var pavillonName = ''; 
                    for (var j = 0; j < pavillons.length; j++) {
                        var pavillon = pavillons[j];
                        if(chambre.pavillon_id == pavillon.id)
                            pavillonName = pavillon.nom;
                    }
                    chambreLibreList.push({val : chambre.id, txt : chambre.num + ' ' + pavillonName})
                }
                form.itemOption('chambre_id', {dataSource : chambreLibreList});
                form.getEditor('chambre_id').option('dataSource', chambreLibreList);
            })
            .fail(function(error) {
                // handle error
            });
    })
    .fail(function(error) {
        // handle error
    });
}

setChambreLibreList();

// chercher la dernière reservation pour cet étudiant 

function loadLastReservationOfResident(residentId){
    
    Store_Reservation.load()
    .done(function(reservations) {
        //alert(reservations);
        for (var i = 0; i < reservations.length; i++) {
            var reservation = reservations[i];
            
            if(reservation.resident_id == residentId){
                
                lastReservationOfResident = reservation;
                formData.chambre_id = lastReservationOfResident.chambre_id;
                formData.date_inscription = Utils.fixDate(lastReservationOfResident.date_inscription);
                formData.date_entree      = Utils.fixDate(lastReservationOfResident.date_entree);
                formData.date_sortie      = Utils.fixDate(lastReservationOfResident.date_sortie);
                button_remove.option('visible', true);
                form.itemOption('list_frais', 'visible', true);
                form.updateData(formData);
                return;
            }
        }
    })
    .fail(function(error) {
        // handle error
    });
}

function resetForm(){
    
    lastReservationOfResident = null;
    // if no reservation found
    formData.chambre_id = null;
    formData.date_inscription = null;
    formData.date_entree      = null;
    formData.date_sortie      = null;
    formData.resident_infos = 'AUCUN RESULTAT';
    formData.resident_id = null;
    form.updateData(formData);
    button_save.option('visible', false);
    button_remove.option('visible', false);
    button_sortie.option('visible', false);
    form.itemOption('list_frais', 'visible', false);
    //alert('resetForm');
}

button_save = $("#" + sectionId + " .button-save").dxButton({
    text: 'Enregistrer',
    visible : false,
    onClick: function() {
        var formData = form.option('formData');
        //console.log(formData.toString());
        //return $.post(apiBaseURL, formData);
        //alert( 'date sortie : ' + Utils.toMysqlDateFormat(formData.date_sortie));

        // convert dates to mysql format
        formData.date_inscription = Utils.toMysqlDateFormat(formData.date_inscription)
        formData.date_entree = Utils.toMysqlDateFormat(formData.date_entree)
        formData.date_sortie = Utils.toMysqlDateFormat(formData.date_sortie)

        // important before calling save so that it checks for lastReservationOfResident in case save was 
        loadLastReservationOfResident(formData.resident_code);

        if(lastReservationOfResident == null){
            //alert('Store_Reservation.insert(formData);');
            Store_Reservation.insert(formData);
        }else{
            Store_Reservation.update(lastReservationOfResident.id, formData);
            //alert('Store_Reservation.update(lastReservationOfResident.id, formData);');
        }
    }
}).dxButton('instance');

button_remove = $("#" + sectionId + " .button-remove").dxButton({
    text: 'Supprimer',
    visible : false,
    onClick: function() {
        var formData = form.option('formData');
        //console.log(formData.toString());
        //return $.post(apiBaseURL, formData);
        Store_Reservation.insert(formData);
    }
}).dxButton('instance');

button_sortie = $("#" + sectionId + " .button-sortie").dxButton({
    text: 'Sortie',
    visible : false,
    onClick: function() {
        var formData = form.option('formData');
        //console.log(formData.toString());
        //return $.post(apiBaseURL, formData);
        Store_Reservation.insert(formData);
    }
}).dxButton('instance');

/*var employee = {
    "Full_Name":"John Heart",
    "Title":"CEO",
    "Birth_Date":"03/16/1964",
    "Prefix":"Mr.",
    "Address":"351 S Hill St.",
    "City":"Los Angeles",
    "Zipcode":90013,
    "Email":"jheart@dx-email.com",
    "Skype":"jheart_DX_skype",
    "Home_Phone":"(213) 555-9208",
    "Mobile_Phone":"(213) 555-9392" 
}

var showLoadPanel = function() {
    loadpanel.show();
    showEmployeeInfo({});
};

var showEmployeeInfo = function(employee) {
    $(".birth-date").text(employee.Birth_Date || "");
    $(".city").text(employee.City || "");
    $(".zipcode").text(employee.Zipcode || "");
    $(".address-info").text(employee.Address || "");
    $(".mobile-phone").text(employee.Mobile_Phone || "");
    $(".email").text(employee.Email || "");
};

$(".show-panel").dxButton({
    text: "Load Data", 
    onClick: showLoadPanel 
});


var loadpanel = $(".loadpanel").dxLoadPanel({
    shadingColor: "rgba(255,255,255,0.7)",
    position: { of: "#employee" },
    indicatorSrc : 'assets/img/ajax-loader.gif',
    minWidth : '200px',
    visible: false,
    showIndicator: true,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
    onShown: function(){
        setTimeout(function () { 
            loadpanel.hide();          
        }, 3000);
    },
    onHidden: function(){
        showEmployeeInfo(employee);
    }      
}).dxLoadPanel("instance");

$(".with-indicator").dxCheckBox({
    value: true,
    text: "With indicator",
    onValueChanged: function(e) {
        loadpanel.option("showIndicator", e.value);
    }
});

$(".with-overlay").dxCheckBox({
    value: true,
    text: "With overlay",
    onValueChanged: function(e) {
        loadpanel.option("shading", e.value);
    }
});

$(".with-pane").dxCheckBox({
    value: true,
    text: "With pane",
    onValueChanged: function(e) {
        loadpanel.option("showPane", e.value);
    }
});

$(".outside-click").dxCheckBox({
    value: false,
    text: "Close on outside click",
    onValueChanged: function(e) {
        loadpanel.option("closeOnOutsideClick", e.value);
    }
});*/
