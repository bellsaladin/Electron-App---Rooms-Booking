let Config = require('../../config')
let Utils = require('../../utils')

var sectionId = 'ui-rapports-list-section';

$("#" + sectionId + " .button-rapport-1").dxButton({
    text: 'Imprimer',
    onClick: function() {
        print_rapport_1();
    }
});

$("#" + sectionId + " .button-rapport-2").dxButton({
    text: 'Imprimer',
    onClick: function() {
        print_rapport_2();
    }
});


function print_rapport_1(){
    $.get(Config.API_REPORTS_URL + 'rapport_situation_globale.php').done(function (html) {
        Utils.printPdf(html);
    }); 
}

function print_rapport_2(){
    $.get(Config.API_REPORTS_URL + 'rapport_journal_encaissement.php').done(function (html) {
        Utils.printPdf(html);
    }); 
}