let Store_Resident = require('../../stores/resident')
let Utils = require('../../utils')


var sectionId = 'ui-resident-new-section';
//let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')
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
    appartenance_politique : '',
    recommandation : '',
    photo : 'assets/img/resident-homme-placeholder.png'
}

var form = $("#" + sectionId + " .form").dxForm({
    formData: formData,
    enctype : 'multipart/form-data',
    items: [//{dataField: 'id'},
            {dataField: 'code', editorOptions : { disabled : true} },
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
            {dataField: 'lieu_naissance'},
            {dataField: 'tel_resident'},
            {dataField: 'tel_tuteur'},
            {
                editorType: 'dxSelectBox',
                dataField: 'sexe',
                editorOptions : {
                    dataSource : [{val : 'M', txt : 'Masculin'}, {val : 'F', txt : 'Feminin'}],
                    valueExpr: 'val',
                    displayExpr: 'txt',
                    onValueChanged: function (e) {
                        //alert('Pavillon selectionné : ' + e.value);
                        setCodeResident(e.value);
                        return;
                    } 
                }
            },
            {dataField: 'nationalite'},
            {dataField: 'ville'},
            {dataField: 'appartenance_politique'},
            {dataField: 'recommandation'},
            //{editorType : 'dxTextArea', dataField: 'adresse'},
            {
             editorType: 'string', 
             dataField: 'photo',
             
             // editorType 'dxFileUploader' causes problem if declared here 

             /*editorOptions : {
                    selectButtonText: "Select photo",
                    labelText: 'Drop file here',
                    multiple: false,
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
                },*/ 
            }],
            customizeItem: function (item) {
                    if (item.dataField !== 'photo')
                        return;
                        //alert('customizeItem');
                    item.template = function (data, itemElement) {
                        var value = data.editorOptions.value;
                        //$('<input>').attr('type', 'hidden').prop('value', value).appendTo(itemElement);
                        var img = $('<img>').attr('src', value).attr('height', '180px').attr('width', '160px');
                        img.appendTo(itemElement);
                        //$('<div>').html(value).appendTo(itemElement);
                        $('<div>').dxFileUploader({selectButtonText: "Parcourir",
                                            labelText: 'Ou glissez la par ici',
                                            multiple: false,
                                            accept: 'image/*',
                                            //accept: "image/*",
                                            uploadMode: "useForm",
                                            name: 'photo',
                                            uploadUrl: '/upload.php',
                                            onValueChanged: function (e) {
                                                alert('File upload changed, new value : ' + e.value);
                                                console.log('File upload changed, new value : ');
                                                console.log(e);
                                                if (e.value != null) {
                                                    if (e.value.size > 150000) {
                                                        alert('file too big') ;
                                                        //e.element.find(".dx-fileuploader-file-container").eq(0).find(".dx-fileuploader-cancel-button").trigger("dxclick");
                                                    }
                                                }
                                                //data.editorOptions.value = e.value; // convert to base64
                                                var fileReader = new FileReader();
                                                fileReader.onload = function(e) {
                                                    img.attr('src', e.target.result);
                                                    data.editorOptions.value = e.target.result;
                                                    //EL("img").src       = e.target.result;
                                                    //EL("b64").innerHTML = e.target.result;
                                                    alert('data.editorOptions.value : ' + data.editorOptions.value);
                                                }; 
                                                var blobFile = e.value[0];
                                                //var blobFile = e.value;
                                                fileReader.readAsDataURL( blobFile );  
                                            } 
                        }).appendTo(itemElement);
                    }
                },
    colCount: 2
}).dxForm('instance');

$("#" + sectionId + " .button-save").dxButton({
    text: 'Enregistrer',
    onClick: function() {
        var formData = form.option('formData');
        //console.log(formData.toString());
        //return $.post(apiBaseURL, formData);
        Store_Resident.insert(formData);
    }
});

setCodeResident('M');
function setCodeResident(sexe){
    Store_Resident.load()
    .done(function(result) {
        var lastCode = 0;
        for (var i = 0; i < result.length; i++) {
            var resident = result[i];
            if(resident.code == null || resident.code.length == 0) continue;
            if(sexe == resident.sexe){
                var residentCodeConvertedToInt = parseInt(resident.code.substring (1,4));
                if( residentCodeConvertedToInt > lastCode)
                    lastCode = residentCodeConvertedToInt;
            }
        }
        formData.sexe = sexe;
        var newNum = Utils.pad(lastCode + 1, 3);
        var newCode = (sexe == 'M')?'G'+newNum: 'F'+newNum;
        formData.code = newCode;
        form.updateData(formData);
        return;
    })
    .fail(function(error) {
        // handle error
    });
}