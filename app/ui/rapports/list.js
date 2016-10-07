let Config = require('../../config')
let Utils = require('../../utils')

var sectionId = 'ui-rapports-list-section';

$("#" + sectionId + " .button-rapport-1").dxButton({
    text: 'Imprimer',
    onClick: function() {
        print_rapport_1();
    }
});


function print_rapport_1(){
    $.get(Config.API_REPORTS_URL + 'rapport_situation_globale.php'/*, {  
            filter: filterOptions,
            sort: sortOptions,
            requireTotalCount: requireTotalCount,
            skip: skip,
            take: take
    }*/).done(function (html) {
        Utils.printPdf(html);
    }); 
}