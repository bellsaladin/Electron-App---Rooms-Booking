let Store_Resident = require('../../stores/resident')
let Store_Chambre = require('../../stores/chambre')
let Store_Reservation = require('../../stores/reservation')
let Store_Reservation_Details = require('../../stores/reservation_details')
let Store_Reglement = require('../../stores/reglement')
let Store_Reglement_Details = require('../../stores/reglement_details')
let Store_Pavillon = require('../../stores/pavillon')
let Store_Etage = require('../../stores/etage')
let Store_Categorie = require('../../stores/categorie')
let Store_Type = require('../../stores/type')
let Store_Modelefrais = require('../../stores/modelefrais')
let Utils = require('../../utils')
let Config = require('../../config')

// variables
var sectionId = 'ui-resident-localisation-section';
var button_save = null;
var button_remove = null;
var button_cloture = null;
var button_reglement = null;
var lastReservationOfResident = null;
var gridViewListFrais = null;
var gridViewListFraisReglement = null;
var gridViewReglement = null;
var chambreLibreList = [];

var listeFrais_model = [
                       /*{list_order : 1, type_frais : 'Caution', montant : '500', regle : false},
                       {list_order : 2, type_frais : 'Inscription', montant : '300', regle : false},
                       {list_order : 3, type_frais : 'Assurance', montant : '60', regle : false},
                       {list_order : 4, type_frais : '09/2016', montant : '700', regle : false},
                       {list_order : 5, type_frais : '10/2016', montant : '700', regle : false},
                       {list_order : 6, type_frais : '11/2016', montant : '700', regle : false},
                       {list_order : 7, type_frais : '12/2016', montant : '700', regle : false},
                       {list_order : 8, type_frais : '01/2017', montant : '700', regle : false},
                       {list_order : 9, type_frais : '02/2017', montant : '700', regle : false},
                       {list_order : 10, type_frais : '03/2017', montant : '700', regle : false},
                       {list_order : 11, type_frais : '04/2017', montant : '700', regle : false},
                       {list_order : 12, type_frais : '05/2017', montant : '700', regle : false},
                       {list_order : 13, type_frais : '06/2017', montant : '700', regle : false},
                       {list_order : 14, type_frais : '07/2017', montant : '350', regle : false},*/
                      ];

var listeFrais = Utils.shallowCopy(listeFrais_model); // original important snapshot of 'listFrais'

var listeFraisReglement = [];

var reglementData = [
                       //{num_quittance : '0001', date :'01/09/2016', listFrais : [{type_frais : 'Caution', montant : 500}]},
                       //{num_quittance : '0002', date :'01/09/2017', listFrais : []},
                    ];

var formData = {
    resident_code : '',
    resident_infos : '',
    resident_nom : '',
    resident_prenom : '',
    resident_id : null,
    pavillon_id : null,
    etage_id : null,
    chambre_id : 0,
    //date_inscription : null,
    //date_entree : null,
    //date_sortie : null,
    date_inscription : '2016-01-01',
    date_entree : '2016-01-01',
    date_sortie : '2016-01-01',
    avance : 0,
    list_frais : listeFrais,
    reglement : reglementData
}

// logic functions


function updateListeFraisReglement(list_frais){
    listeFraisReglement = [];
    for(var i=0; i < list_frais.length ; i++){
        var frais = list_frais[i];
        if(!frais.regle)
            listeFraisReglement.push(Utils.shallowCopy(frais));
    }
}
// util function

function findFraisInListe(list, val){
    //alert('findFraisInListe' + list);
    for(var i = 0 ; i < list.length; i++){
        //alert(list[i].type_frais)
        if (list[i].type_frais == val){
            //alert('found : ' +list[i].type_frais + ';  regle ? : '  + list[i].regle)
            return list[i];
        }
    }
}

function findChambreInListe(list, val){
    for(var i = 0 ; i < list.length; i++){
        if (list[i].val == val){
            return list[i].chambre;
        }
    }
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
                dataField: 'pavillon_id',
                label : {text : 'Pavillon'},
                editorOptions : {
                    dataSource : Store_Pavillon,
                    valueExpr: 'id',
                    displayExpr: 'nom',
                    onValueChanged: function (e) {
                        if(e.value == null) return;
                        var pavillonId = e.value;
                        setChambreLibreList(formData.chambre_id, pavillonId, null)
                        //return;
                    }
                }
            },
            {},
            {
                editorType: 'dxSelectBox',
                dataField: 'etage_id',
                label : {text : 'Etage'},
                editorOptions : {
                    dataSource : Store_Etage,
                    valueExpr: 'id',
                    displayExpr: 'nom',
                    onValueChanged: function (e) {
                        if(e.value == null) return;
                        var pavillonId = form.option('formData').pavillon_id;
                        var etageId = e.value;
                        setChambreLibreList(formData.chambre_id, pavillonId, etageId)
                        //return;
                    }
                }
            },
            {},
            {
                editorType: 'dxSelectBox',
                dataField: 'chambre_id',
                label : {text : 'Chambre'},
                editorOptions : {
                    dataSource : chambreLibreList,
                    valueExpr: 'val',
                    displayExpr: 'txt',
                    onValueChanged: function (e) {
                        if(e.value == null) return;
                        //alert('Chambre selectionnée : ' + e.value);
                        var chambreId = e.value;
                        var chambre = findChambreInListe(chambreLibreList, chambreId);
                        if(chambre == null) return;
                        //alert('type chambre : ' + chambre.type_id);
                        Store_Modelefrais.load({filter : 'typechambre_id,eq,' + chambre.type_id}).then( function (listFraisChambre){
                            for(var i = 0; i < listFraisChambre.length; i++){
                                listFraisChambre[i].id = null;
                                for(var j = 0; j < listeFrais.length; j++){
                                    if(listFraisChambre[i].type_frais == listeFrais[j].type_frais){
                                        listFraisChambre[i].id = listeFrais[j].id; // set id so that the update works
                                        listFraisChambre[i].reservation_id = listeFrais[j].reservation_id; // add this binding info (reservation_id) which doesn't exist at table 'ModeleFrais'
                                        listFraisChambre[i].montant = listeFrais[j].montant;
                                        if(listeFrais[j].regle){
                                            listFraisChambre[i].regle = listeFrais[j].regle;
                                        }else{
                                            listFraisChambre[i].regle = false;
                                        }
                                        break;
                                    }
                                } 

                                //alert(listeFrais[i].regle);
                                //alert(listFraisChambre[i].montant);

                            }
                            listeFrais = listFraisChambre;
                            for(var i = 0; i < listeFrais.length; i++){
                                
                                //alert(listeFrais[i].montant);
                            }
                            gridViewListFrais.option('dataSource', listeFrais);
                            formData.list_frais = listeFrais;
                            updateListeFraisReglement(listeFrais);
                        });
                        //return;
                    }
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
            {dataField: 'list_frais', label : {text : 'Liste des frais'}, visible : false, colspan : 3},
            {dataField: 'reglement', visible : false, colspan : 3}
           ],
            customizeItem: function (item) {
                    // customize list_frais
                    if (item.dataField == 'list_frais') {
                        item.template = function (data, itemElement) {
                            var value = data.editorOptions.value;
                            //$('<input>').attr('type', 'hidden').prop('value', value).appendTo(itemElement);
                            //$('<div>').html(value).appendTo(itemElement);
                            var gridDiv = $('<div>');
                            gridViewListFrais = gridDiv.dxDataGrid({
                                dataSource: value,
                                noDataText : '',
                                sorting : {mode : 'none'},
                                editing: {
                                    allowAdding : false,
                                    allowDeleting : true,
                                    allowUpdating : true,
                                    mode : 'cell',
                                    texts : Config.gridview.editing.texts
                                },
                                columns : [
                                        {dataField: 'list_order', dataType : 'number', visible : false, sortOrder : 'asc'},
                                        {dataField: 'type_frais'}, {dataField: 'montant'},
                                        {dataField: 'regle', dataType : 'boolean', caption : 'Reglé',
                                        editorOptions : {
                                            onValueChanged: function (e) {
                                            }
                                        }}],
                                onEditorPrepared: function (e) {
                                    //console.log(listeFrais_snapshot);
                                    //console.log('onEditorPrepared');
                                    //console.log(e);
                                    var rowIndex = e.row.rowIndex;
                                    var row = e.row;
                                    //alert(row.data.regle);
                                    if (e.dataField == "montant" || e.dataField == "type_frais" ) {
                                        if(formData.list_frais == null) return;
                                        if(formData.list_frais[rowIndex].regle == true){
                                            if(e.editorName == 'dxTextBox'){
                                                var tb = e.editorElement.dxTextBox("instance").option("readOnly", "true");
                                            }
                                        }
                                    }
                                    if (e.dataField == "regle") {
                                        if(e.editorName == 'dxCheckBox'){
                                            var tb = e.editorElement.dxCheckBox("instance").option("readOnly", "true");
                                        }
                                    }
                                }
                            }).dxDataGrid('instance');
                            gridDiv.appendTo(itemElement);
                        }
                    }
                    // customize reglement
                    if (item.dataField == 'reglement') {
                        item.template = function (data, itemElement) {
                            var value = data.editorOptions.value;
                            //$('<input>').attr('type', 'hidden').prop('value', value).appendTo(itemElement);
                            //$('<div>').html(value).appendTo(itemElement);
                            var gridDiv = $('<div>');
                            gridViewReglement = gridDiv.dxDataGrid({
                                dataSource: value,
                                noDataText : '',
                                sorting : {mode :'none'},
                                selection : { mode : 'single'},
                                editing: {
                                    allowAdding : false,
                                    allowDeleting : true,
                                    allowUpdating : false,
                                    mode : 'row',
                                    texts : Config.gridview.editing.texts},
                                columns : [{dataField: 'id', dataType : 'number', visible : false, sortOrder : 'asc'}, {dataField: 'num_quittance', sortOrder : 'asc'}, {dataField: 'date'}],
                                masterDetail: {
                                    enabled: true,
                                    template: function(container, options) {
                                        var element = $('<div>');
                                        element.css('width','1000px'); // making it full
                                        var listFrais = options.data.listFrais;
                                        listFrais.sort(function(a,b) {return (parseInt(a.list_order) > parseInt(b.list_order)) ? 1 : ((parseInt(b.list_order) > parseInt(a.list_order)) ? -1 : 0);} );
                                        element.append('<table class="table-no-border" style="font-size:11px">');
                                        for( var i = 0; i < listFrais.length; i++){
                                            var frais = listFrais[i];
                                            element.append($('<tr class="table-no-border"> <td style="width:110px">&gt;  ' + frais.type_frais + ' :</td><td> ' + frais.montant + ' DH </td></tr>'));
                                        }
                                        element.append('</table>');
                                        var link = $('<a href="javascript:void(0)">Imprimer</a>');
                                        element.append(link);
                                        link.click(function (e){
                                            print_recu_reglement(options.data);
                                        });

                                        container.append(element);
                                    }
                                },
                                onRowRemoving : function(e) {
                                    var data = e.data;
                                    Store_Reglement.remove(data.id);
                                    // décocher le champ 'reglé' sur la liste des frais
                                    console.log(data);

                                    var listFraisRemovedReglement = data.listFrais;
                                    console.log(listFraisRemovedReglement);
                                    console.log(listeFrais);
                                    for( var i = 0; i < listFraisRemovedReglement.length; i++){
                                        var fraisReglement = listFraisRemovedReglement[i];
                                        for( var j = 0; j < listeFrais.length; j++){
                                            var fraisReservation = listeFrais[j];
                                            console.log(fraisReglement.type_frais + ' ' +  fraisReservation.type_frais + ' ' +  fraisReglement.reservation_id + ' ' + fraisReservation.reservation_id)
                                            if(fraisReglement.type_frais == fraisReservation.type_frais && fraisReglement.reservation_id == fraisReservation.reservation_id ){
                                                fraisReservation.regle = false;
                                                console.log('set false')
                                            }
                                        }
                                    }

                                    form.updateData('list_frais', listeFrais); // not working alone
                                    gridViewListFrais.option('dataSource', listeFrais);
                                    // update liste frais pour reglement
                                    updateListeFraisReglement(listeFrais);
                                    // important fix
                                    form.repaint();
                                    form.updateData(formData);
                                    setChambreLibreList(formData.chambre_id, formData.pavillon_id, formData.etage_id);
                                }
                            }).dxDataGrid('instance');
                            gridDiv.appendTo(itemElement);
                        }
                    }
                },
    colCount: 2
}).dxForm('instance');

function loadResidentInfos( resident_code){
    formData.resident_code = resident_code;
    resetForm();
    //alert('setResidentInfos');
    Store_Resident.load({'filter': 'code,eq,' + resident_code})
    .done(function(result) {
        var resident = result[0];
        //console.log (resident);
        //alert(chambre.num)
        formData.resident_infos = resident.prenom + ' ' + resident.nom;
        formData.resident_nom = resident.nom;
        formData.resident_prenom = resident.prenom;
        formData.resident_code = resident_code;
        formData.resident_id = resident.id;
        form.updateData(formData);
        loadLastReservationOfResident(resident.id);
        button_save.option('visible', true);
        return;
        //alert(formData.resident_infos);
        // form.updateData(formData); // @@@ causes the list form to not show
    })
    .fail(function(error) {
        // handle error
    });
}

// set 'chambres libres' list

function setChambreLibreList(residentCurrentChambreId){
    setChambreLibreList(residentCurrentChambreId, null, null)
}

function setChambreLibreList(residentCurrentChambreId, pavillon_id, etage_id){
    var chambreLoadOptions = {};
    if(pavillon_id != null){
        chambreLoadOptions['getParams'] =  '&filter[]=pavillon_id,eq,' + pavillon_id;
        chambreLoadOptions['getParams'] += '&statisfy=all';
    }
    if(etage_id != null){
        chambreLoadOptions['getParams'] +=  '&filter[]=etage_id,eq,' + etage_id;
    }
    Store_Chambre.load(chambreLoadOptions)
    .done(function(chambres) {
        Store_Pavillon.load()
            .done(function(pavillons) {
                Store_Reservation.load()
                    .done(function(reservations) {
                        chambreLibreList = []; // empty
                        for (var i = 0; i < chambres.length; i++) {
                            var chambre = chambres[i];
                            var chambreReservee = false;
                            for (var k = 0; k < reservations.length; k++) {
                                var reservation = reservations[k];
                                //alert(reservation.chambre_id + ' ' + chambre.id)
                                if(reservation.chambre_id == chambre.id && residentCurrentChambreId != chambre.id){
                                    chambreReservee = true;
                                    break;
                                }
                            }
                            if(!chambreReservee){
                                if(chambre.num == null || chambre.num.length == 0) continue;
                                var pavillonName = '';
                                for (var j = 0; j < pavillons.length; j++) {
                                    var pavillon = pavillons[j];
                                    if(chambre.pavillon_id == pavillon.id){
                                        pavillonName = pavillon.nom;
                                        break;
                                    }
                                }
                                chambreLibreList.push({val : chambre.id, txt : ((chambre.nbr_lits==1)?chambre.num + '  (Individuelle)':chambre.num + '  (Double)'), chambre : chambre});
                            }
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
    })
    .fail(function(error) {
        // handle error
    });
}

setChambreLibreList(null);

// chercher la dernière reservation pour cet étudiant

function loadLastReservationOfResident(residentId){
    Store_Reservation.load({'filter': 'resident_id,eq,' + residentId})
    .done(function(reservations) {
        var reservation = reservations[0];
        lastReservationOfResident = reservation;
        formData.chambre_id = lastReservationOfResident.chambre_id;
        formData.pavillon_id = lastReservationOfResident.pavillon_id;
        formData.etage_id = lastReservationOfResident.etage_id;
        formData.date_inscription = Utils.fixDate(lastReservationOfResident.date_inscription);
        formData.date_entree      = Utils.fixDate(lastReservationOfResident.date_entree);
        formData.date_sortie      = Utils.fixDate(lastReservationOfResident.date_sortie);
        button_remove.option('visible', true);
        button_cloture.option('visible', true);
        button_imprimer_recu_inscription.option('visible', true);
        button_reglement.option('visible', true);
        form.itemOption('list_frais', 'visible', true);
        form.itemOption('reglement', 'visible', true);
        gridViewListFrais.option('dataSource', null);
        Store_Reservation_Details.load({'filter': 'reservation_id,eq,' + reservation.id}).done(function(result) {
            result = Utils.preprocessData(result, {operation : 'convert', direction : 'receiving', colIndex : 'regle'});
            // get a snapshot of 'listeFrais_snapshot''
            //listeFrais_snapshot = Utils.deepCopy(formData.list_frais);
            listeFrais = result;
            console.log('listeFrais');
            console.log(listeFrais);
            formData.list_frais = listeFrais;
            gridViewListFrais.option('dataSource', listeFrais);

            // set liste frais pour reglement
            updateListeFraisReglement(listeFrais);

            // load reglements
            loadReglements(lastReservationOfResident.id)

            form.updateData(formData);
        });

        return;
            
    })
    .fail(function(error) {
        // handle error
    });
}

function loadReglements(reservation_id){
    Store_Reglement.load({'filter': 'reservation_id,eq,' + reservation_id}).done(function(reglements) {
            Store_Reglement_Details.load({'filter': 'reservation_id,eq,' + reservation_id}).done(function(reglementDetails) {
                for(var i=0; i < reglements.length ; i++){
                    var reglement = reglements[i];
                    // set liste frais pour reglement
                    reglement.listFrais = [];
                    for(var j=0; j < reglementDetails.length ; j++){
                        if(reglementDetails[j].reglement_id == reglement.id)
                        reglement.listFrais.push(reglementDetails[j])
                    }
                }
                formData.reglement = reglements;
                gridViewReglement.option('dataSource', reglements);
                form.updateData(formData);
                setChambreLibreList(formData.chambre_id, formData.pavillon_id, formData.etage_id);
            });
    });
}

function resetForm(type){
    if(type == 'full'){
        formData.resident_code = '';
    }
    lastReservationOfResident = null;
    // if no reservation found
    formData.chambre_id = null;
    formData.date_inscription = null;
    formData.date_entree      = null;
    formData.date_sortie      = null;
    formData.resident_infos = 'AUCUN RESULTAT';
    formData.resident_id = null;
    formData.reglement = null;
    form.updateData(formData);
    button_save.option('visible', false);
    button_remove.option('visible', false);
    button_reglement.option('visible', false);
    button_cloture.option('visible', false);
    button_imprimer_recu_inscription.option('visible', false);
    form.itemOption('list_frais', 'visible', false);
    form.itemOption('reglement', 'visible', false);

    if(gridViewListFrais){
        listeFrais = Utils.deepCopy(listeFrais_model);
        gridViewListFrais.option('dataSource', listeFrais);
        formData.list_frais = listeFrais;
    }
    form.updateData(formData);
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
        //loadLastReservationOfResident(formData.resident_id).done(function(reservation) {
            //lastReservationOfResident = reservation;
            if(lastReservationOfResident == null){
                // to avoid using $.post in here directly use the promise like for Sotre.load().done ...
                var apiURL = Config.API_BASE_URL + 'reservation';
                // insert reservation
                $.post(apiURL, formData).done(function (reservation_id){
                    for(var i = 0; i < listeFrais.length; i++){
                        var frais = listeFrais[i];
                        //alert('insert' + frais.montant);
                        frais.reservation_id = reservation_id;
                        Store_Reservation_Details.insert(frais);
                    }
                    form.itemOption('list_frais', 'visible', true);
                    //lastReservationOfResident = { id : reservation_id };
                    loadLastReservationOfResident(formData.resident_id);
                    //alert('lastReservationOfResident.id ' + lastReservationOfResident.id)
                });
            } else {
                Store_Reservation.update(lastReservationOfResident.id, formData);
                var listFrais = gridViewListFrais.option('dataSource');
                listFrais =  Utils.preprocessData(listFrais, {operation : 'convert', direction : 'sending', colIndex : 'regle'});
                for(var i = 0; i < listFrais.length; i++){
                    var frais = listFrais[i];
                    //alert(frais.id + ' ' + frais.montant);
                    Store_Reservation_Details.update(frais.id, frais );
                }
                loadLastReservationOfResident(formData.resident_id);
                //alert('Store_Reservation.update(lastReservationOfResident.id, formData);');
            }
        //});
        Utils.showToastMsg('success', 'Localisation enregistrée !');

    }
}).dxButton('instance');

button_remove = $("#" + sectionId + " .button-remove").dxButton({
    text: 'Supprimer',
    visible : false,
    onClick: function() {
        //console.log(formData.toString());
        //return $.post(apiBaseURL, formData);
        Store_Reservation.remove(lastReservationOfResident.id);
        Utils.showToastMsg('success', 'Localisation supprimée !');
        resetForm('full');
    }
}).dxButton('instance');

var pourcentageRemise = 0;
var montantRemise = 0;
var montantTotalRegle = 0;
var popupReglement = null,
    popupReglement_options = {
        width: 600,
        height: 'auto',
        contentTemplate: function(itemElement) {
            var dateDiv = $('<div>');
            var dateBoxReglement = dateDiv.dxDateBox({
                value: new Date()
            }).dxDateBox('instance');
            var remiseDivContainer = $('<div>');
            var remiseDiv = $('<div>');
            
            var remiseBoxReglement = remiseDiv.dxTextBox({
                value: 0,
                onValueChanged: function (e) {
                    pourcentageRemise = parseInt(e.value);
                    montantRemise = montantTotalRegle * pourcentageRemise / 100
                    $('#montant_remise').html(montantRemise);
                }
            }).dxTextBox('instance');
            var montantDiv = $('<div>');
            var montantAVentiler = 0;
            var montantBoxReglement = montantDiv.dxTextBox({
                value: 0,
                onValueChanged: function (e) {
                  montantAVentiler = e.value;
                }
            }).dxTextBox('instance');
            var gridDiv = $('<div>');
            gridViewListFraisReglement = gridDiv.dxDataGrid({
                dataSource: listeFraisReglement,
                noDataText : '',
                sorting : {mode : 'none'},
                editing: {
                    allowAdding : false,
                    allowDeleting : true,
                    allowUpdating : true,
                    mode : 'cell',
                    texts : Config.gridview.editing.texts
                },onRowUpdating: function (e) {
                    console.log(e);
                    var editedRowIndex = gridViewListFraisReglement.getRowIndexByKey(e.key)
                    var montantLigne = parseInt(gridViewListFraisReglement.cellValue(editedRowIndex, 'montant'));
                    if(e.newData['regle'] == true){
                      console.log(listeFraisReglement);
                      montantTotalRegle += montantLigne;
                    }else if(e.newData['regle'] == false){
                      montantTotalRegle -= montantLigne;
                    }
                    // update montant remise
                    montantRemise = montantTotalRegle * pourcentageRemise / 100
                    $('#montant_remise').html(montantRemise);

                    if(e.newData.montant == 0){
                      e.cancel = true;
                    }

                    /*console.log(e);*/
                    /*var rowIndex = e.row.rowIndex;
                    var row = e.row;
                    //alert(row.data.regle);
                    if (e.dataField == "montant" || e.dataField == "type_frais" ) {
                        if(formData.list_frais == null) return;
                        if(formData.list_frais[rowIndex].regle == true){
                            if(e.editorName == 'dxTextBox'){
                                var tb = e.editorElement.dxTextBox("instance").option("readOnly", "true");
                            }
                        }
                    }
                    if (e.dataField == "regle") {
                        if(e.editorName == 'dxCheckBox'){
                            var tb = e.editorElement.dxCheckBox("instance").option("readOnly", "true");
                        }
                    }*/
                },
                columns : [
                        {dataField: 'list_order', dataType : 'number', visible : false, sortOrder : 'asc'},
                        {dataField: 'type_frais'}, {dataField: 'montant'},
                        {dataField: 'regle', dataType : 'boolean', caption : 'Reglé'}],
            }).dxDataGrid('instance');
            var saveDiv = $('<div>');
            saveDiv.dxButton({
                text: 'Enregistrer',
                onClick: function() {

                    // to avoid using $.post in here directly use the promise like for Sotre.load().done ...
                    var apiURL = Config.API_BASE_URL + 'reglement';
                    // insert reservation
                    var dateReglement = dateBoxReglement.option('value');
                    var reglement = {reservation_id : lastReservationOfResident.id, num_quittance : 0, chambre_id : formData.chambre_id, date : dateReglement, remise_prct : pourcentageRemise, remise_montant : montantRemise};
                    $.post(apiURL, reglement).done(function (reglement_id){
                        for(var i = 0; i < listeFraisReglement.length; i++){
                            var frais = listeFraisReglement[i];
                            if(frais.regle == true){
                                frais.reglement_id = reglement_id;
                                frais.reservation_id = lastReservationOfResident.id;
                                Store_Reglement_Details.insert(frais).then(function( frais){
                                    var frais = frais; // make the variable local so that it's not alternated'
                                    findFraisInListe(listeFrais, frais.type_frais).regle = true;
                                    form.updateData('list_frais', listeFrais); // not working alone
                                    gridViewListFrais.option('dataSource', listeFrais);
                                    // update liste frais pour reglement
                                    updateListeFraisReglement(listeFrais);

                                    // reset remise data 
                                    pourcentageRemise = 0;
                                    montantRemise = 0;
                                    montantTotalRegle = 0;
                                    $('#montant_remise').html('0');
                                });
                            }
                        }
                        // load reglements
                        loadReglements(lastReservationOfResident.id)
                        form.repaint();
                        // delete popup
                        popupReglement.hide();
                        popupReglement && $(".popup-reglement").remove();
                    });
                }
            }).dxButton('instance');
            dateDiv.appendTo(itemElement);
            remiseDivContainer.append('Remise (%) : ')
            remiseDivContainer.append(remiseDiv);
            remiseDivContainer.append('<div>Montant remise : <span id="montant_remise">0</span> DH</div>')
            remiseDivContainer.appendTo(itemElement);
            //montantDiv.appendTo(itemElement);
            gridDiv.appendTo(itemElement);
            saveDiv.appendTo(itemElement);
        },
        showTitle: true,
        title: "Réglement",
        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: true
};

button_reglement = $("#" + sectionId + " .button-reglement").dxButton({
    text: 'Ajouter Reglement',
    visible : false,
    onClick: function() {
        popupReglement && $(".popup-reglement").remove();
        $popupContainer = $("<div />")
                                .addClass("popup")
                                .appendTo($("#" + sectionId));
        popupReglement = $popupContainer.dxPopup(popupReglement_options).dxPopup("instance");
        popupReglement.show();
    }
}).dxButton('instance');


var popupCloture = null,
    popupCloture_options = {
        width: 600,
        height: 'auto',
        contentTemplate: function(itemElement) {
            var checkboxDiv = $('<div>');
            var checkBox = checkboxDiv.dxCheckBox({
                value: false,
                text : 'Rembourser',
                onValueChanged: function (e) {
                    //alert('rembourser : ' +  e.value);
                    if(e.value == true){
                        montantInputBox.option('visible', true);
                    }else{
                        montantInputBox.option('visible', false);
                    }
                    return;
                }
            }).dxCheckBox('instance');
            var montantRembourseDiv = $('<div>');
            var montantCaution = 0;
            // find montant Caution
            var listFrais = gridViewListFrais.option('dataSource');
            for(var i = 0; i < listFrais.length; i++){
                var frais = listFrais[i];
                if(frais.type_frais == 'Caution'){
                    montantCaution = frais.montant;
                    //alert(montantCaution);
                    break;
                }
            }

            var montantInputBox = montantRembourseDiv.dxNumberBox({
                value : montantCaution,
                visible : false,
                onValueChanged: function (e) {
                    if(e.value > montantCaution || e.value < 0){
                        if( e.value < 0) montantInputBox.option('value', 0);
                        if( e.value > montantCaution) montantInputBox.option('value', montantCaution);
                        alert('Le montant de la caution doit être compris entre 0 et ' + montantCaution);
                    }
                    return;
                }
            }).dxNumberBox('instance');

            var confirmButtonDiv = $('<div>');
            var confirmButton = confirmButtonDiv.dxButton({
                text: 'Enregistrer',
                onClick: function() {
                    alert('do something !')
                }
            }).dxButton('instance');
            checkboxDiv.appendTo(itemElement);
            itemElement.append('<br/>');
            montantRembourseDiv.appendTo(itemElement);
            itemElement.append('<br/>');
            confirmButtonDiv.appendTo(itemElement);
        },
        showTitle: true,
        title: "Clotûrer",
        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: true
};

button_cloture = $("#" + sectionId + " .button-cloture").dxButton({
    text: 'Cloturer',
    visible : false,
    onClick: function() {
        popupCloture && $(".popup-cloture").remove();
        $popupContainer = $("<div />")
                                .addClass("popup")
                                .appendTo($("#" + sectionId));
        popupCloture = $popupContainer.dxPopup(popupCloture_options).dxPopup("instance");
        popupCloture.show();
    }
}).dxButton('instance');


var button_imprimer_recu_inscription = null;

button_imprimer_recu_inscription = $("#" + sectionId + " .button-imprimer-recu-inscription").dxButton({
    text: 'Imprimer reçu inscription',
    visible : false,
    onClick: function() {
        print_recu_inscription();
    }
}).dxButton('instance');

function print_recu_inscription(){    
    loadBase64Logos(function( logo_fr, logo_ar){
        var content = '';
        content += '<div style="font-size:11px">';
        content += '<img style="float:left" height="80" src="'+logo_fr+'"/>';
        content += '<img style="float:right" height="80" src="'+logo_ar+'"/>';
        content += '<br/><br/><br/><br/><br/><br/><br/><br/><div></div>';
        content += '<p>Code :  ' + formData.resident_code +'</p>';
        content += '<p>Nom complet :  ' + formData.resident_infos +'</p>';
        content += '<p>Num chambre :  ' + findChambreInListe( chambreLibreList, formData.chambre_id).num +'</p>';
        var date = new Date();
        date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        content += '<p>Date :  ' + date +'</p><br><br>';
        content += '<p style="margin-left:250px;"><u>Signature</u></p><br><br>';
        // put border on the content
        content = '<div style="margin:50px; padding :10px; border:1px solid silver; font-size:11px;">' + content + '</div>';
        Utils.printPdf(content);
    });          
}

function print_recu_reglement( reglement){
    loadBase64Logos(function( logo_fr, logo_ar){
        var num_quittance = reglement.num_quittance;
        var listFrais = reglement.listFrais;
        var date = new Date();
        date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        var content = '';
        content += '<img style="float:left" height="80" src="'+logo_fr+'"/>';
        content += '<img style="float:right" height="80" src="'+logo_ar+'"/>';
        content += '<br/><br/><br/><br/><br/><br/><br/><br/>';
        content += '<div style="float:right"><p>Date :  ' + reglement.date +'</p>';
        content += '<p>Reçu n° :  ' + num_quittance +'</p></div>';
        content += '<p>Nom :  ' + formData.resident_nom +'</p>';
        content += '<p>Prénom :  ' + formData.resident_prenom +'</p>';
        content += '<table style="font-size:11px">';
        for(var i = 0; i< listFrais.length; i++){
            var frais = listFrais[i];
            if(frais.type_frais == 'Avance')
                content += '<tr><td style="width:100px">>Avance :  </td><td>' + frais.montant +' DH</td></tr>';
            if(frais.type_frais == 'Assurance')
                content += '<tr><td>Assurance :  </td><td>' + frais.montant +' DH</td></tr>';
            if(frais.type_frais == 'Frais de dossier')
                content += '<tr><td>Frais de dossier :  </td><td>' + frais.montant +' DH</td></tr>';
            if(frais.type_frais == 'Caution')
                content += '<tr><td>Caution :  </td><td>' + frais.montant +' DH</td></tr>';
        }
        content += '</table>';
        var affichageEnteteMois = false;
        var total = 0;
        // sort by order
        listFrais.sort(function(a,b) {return (parseInt(a.list_order) > parseInt(b.list_order)) ? 1 : ((parseInt(b.list_order) > parseInt(a.list_order)) ? -1 : 0);} ); 

        for(var i = 0; i< listFrais.length; i++){
            var frais = listFrais[i];
            total += parseInt(frais.montant);
            if(frais.type_frais == 'Avance' || frais.type_frais == 'Caution' || frais.type_frais == 'Assurance' || frais.type_frais == 'Frais de dossier' )
                continue;
            if(!affichageEnteteMois){
                content += '<p>Mois payés : </p>';
                content += '<table style="margin-left:50px; font-size:11px">';
                affichageEnteteMois = true;
            }
            content += '<tr>';
            content += '<td style="width:100px"> - ' + frais.type_frais + '</td>';
            content += '<td>' + frais.montant + ' DH </td>';
            content += '</tr>';
        }
        if(affichageEnteteMois){
            content += '</table>';
        }
        if(reglement.remise_montant > 0){
            content += '<p>Remise :  ' + reglement.remise_montant  + ' DH</p>';
        }
        content += '<p>Total :  ' + (total - reglement.remise_montant) +' DH </p>';
        content += '<p style="margin-left:250px;"><u>Signature</u></p><br><br>';
        // put border on the content
        content = '<div style="margin:50px; padding :10px; border:1px solid silver; font-size:11px;">' + content + '</div>';
        Utils.printPdf(content);
    });
}

var logo_fr_img = null;
var logo_ar_img = null;
function loadBase64Logos(callback){
    if(logo_fr_img != null && logo_ar_img != null){
        callback(logo_fr_img, logo_ar_img);
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            var xhr2 = new XMLHttpRequest();
            xhr2.responseType = 'blob';
            xhr2.onload = function() {
                var reader2 = new FileReader();
                reader2.onloadend = function() {
                    logo_fr_img = reader.result;
                    logo_ar_img = reader2.result;

                    callback(logo_fr_img, logo_ar_img);
                }
                reader2.readAsDataURL(xhr2.response);
            }
            xhr2.open('GET', 'assets/img/logo/logo_ar.png');
            xhr2.send();
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', 'assets/img/logo/logo_fr.png');
    xhr.send();
}