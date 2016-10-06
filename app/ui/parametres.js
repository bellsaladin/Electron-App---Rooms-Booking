let Store_Parametres = require('../stores/chambre')
let Utils = require('../utils')


var sectionId = 'ui-parametres-section';
//let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')
var formData = {
    nbr_jours_annulation_localisation : 7,
    titre_application : '',
}

var form = $("#" + sectionId + " .form").dxForm({
    formData: formData,
    items: [
            {dataField: 'nbr_jours_annulation_localisation'},
            {},
            {dataField: 'exercice_date_debut'},
            {dataField: 'exercice_date_fin'},
            //{dataField: 'titre_application'}
           ],
    colCount: 2
}).dxForm('instance');

$("#" + sectionId + " .button-save").dxButton({
    text: 'Enregistrer',
    onClick: function() {
        var formData = form.option('formData');
        //console.log(formData.toString());
        //return $.post(apiBaseURL, formData);
        Store_Parametres.update(formData);
    }
});