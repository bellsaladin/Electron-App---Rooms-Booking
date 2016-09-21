let Store_Chambre = require('../../stores/chambre')
let Store_Pavillon = require('../../stores/pavillon')
let Store_Etage = require('../../stores/etage')
let Store_Categorie = require('../../stores/categorie')
let Store_Type = require('../../stores/type')
let Utils = require('../../utils')


var sectionId = 'ui-chambre-new-section';
//let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')
var formData = {
    pavillon_id : 1,
    num : '001',
    nbr_lits : 1,
    etape_id : 1,
    categorie_id : 1,
    type_id : 1,
}

var form = $("#" + sectionId + " .form").dxForm({
    formData: formData,
    enctype : 'multipart/form-data',
    items: [//{dataField: 'id'},
            {
                editorType: 'dxSelectBox',
                dataField: 'pavillon_id',
                label : {text : 'Pavillon'},
                editorOptions : {
                    dataSource : Store_Pavillon,
                    valueExpr: 'id',
                    displayExpr: 'nom',
                    onValueChanged: function (e) {
                        //alert('Pavillon selectionné : ' + e.value);
                        setNewNumChambre(e.value);
                        return;
                    } 
                }
            },
            {},
            {dataField: 'num'},
            {dataField: 'nbr_lits'},
            {
                editorType: 'dxSelectBox',
                dataField: 'etage_id',
                label : {text : 'Etage'},
                editorOptions : {
                    dataSource : Store_Etage,
                    valueExpr: 'id',
                    displayExpr: 'nom',
                }
            },
            {
                editorType: 'dxSelectBox',
                dataField: 'categorie_id',
                label : {text : 'Catégorie'},
                editorOptions : {
                    dataSource : Store_Categorie,
                    valueExpr: 'id',
                    displayExpr: 'nom',
                }
            },
            {
                editorType: 'dxSelectBox',
                dataField: 'type_id',
                label : {text : 'Type'},
                editorOptions : {
                    dataSource : Store_Type,
                    valueExpr: 'id',
                    displayExpr: 'nom',
                }
            },
           ],
    colCount: 2
}).dxForm('instance');

$("#" + sectionId + " .button-save").dxButton({
    text: 'Enregistrer',
    onClick: function() {
        var formData = form.option('formData');
        //console.log(formData.toString());
        //return $.post(apiBaseURL, formData);
        Store_Chambre.insert(formData);
    }
});

/*$("#ui-file-uploader").dxFileUploader({selectButtonText: "Select photo",
                    labelText: 'Drop file here',
                    multiple: true,
                    accept: 'image/*',
                    //accept: "image/*",
                    uploadMode: "useForm",
                    name: 'photo',
                    uploadUrl: '/upload.php',
                    onValueChanged: function (e) {
                        alert('File upload changed, new value : ' + e.value);
                        if (e.value != null) {
                            if (e.value.size > 150000) {
                                alert('file too big') ;
                                //e.element.find(".dx-fileuploader-file-container").eq(0).find(".dx-fileuploader-cancel-button").trigger("dxclick");
                            }
                        }
                        return;
                    } 
});*/


function setNewNumChambre( PavillonId){
    Store_Chambre.load()
    .done(function(result) {
        console.log(result);
        var maxNumChambreInPavillon = 0;
        for (var i = 0; i < result.length; i++) {
            var chambre = result[i];
            console.log(chambre);
            console.log(PavillonId);
            if(chambre.pavillon_id == PavillonId){
                //alert(chambre.num)
                if(parseInt(chambre.num) > maxNumChambreInPavillon)
                maxNumChambreInPavillon = parseInt(chambre.num);
            }
            //alert(formData.pavillon_id);
            //console.log(k, result[k]);
        }

        var newNumChambre = maxNumChambreInPavillon + 1;
        var formattedNewNumChambre = Utils.pad(newNumChambre, 3);
        formData.num = formattedNewNumChambre;
        formData.pavillon_id = PavillonId;
        //alert(formData.num);
        
        form.updateData(formData);
    })
    .fail(function(error) {
        // handle error
    });
}

// alert('Todo : le numéro de chambre doit être le dernier à selectionner après le choix du pavillon ... ');